import asyncio
import logging
import uvicorn
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, List, Any, Optional
from datetime import datetime
import os

# Import our services
from .database.mongodb_client import MongoDBClient
from .database.redis_client import RedisClient
from .services.market_analyzer import MarketAnalyzer
from .services.news_processor import NewsProcessor
from .services.trade_intelligence_service import TradeIntelligenceService
from .data_processing.trade_data_processor import TradeDataProcessor
from .models.prediction_models import PricePredictionModel, ArbitragePredictionModel
from .models.trade_analytics_models import ComprehensiveArbitrageModel
from .utils.websocket_manager import WebSocketManager

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Export Express Pro - AI Analytics Engine",
    description="Advanced AI-powered trade analytics and arbitrage prediction system",
    version="2.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global service instances
db_client = None
redis_client = None
market_analyzer = None
news_processor = None
trade_intelligence = None
data_processor = None
price_model = None
arbitrage_model = None
comprehensive_model = None
websocket_manager = None

@app.on_event("startup")
async def startup_event():
    """Initialize all services on startup"""
    global db_client, redis_client, market_analyzer, news_processor
    global trade_intelligence, data_processor, price_model, arbitrage_model
    global comprehensive_model, websocket_manager
    
    try:
        logger.info("Starting AI Analytics Engine...")
        
        # Initialize database connections
        db_client = MongoDBClient()
        await db_client.connect()
        
        redis_client = RedisClient()
        await redis_client.connect()
        
        # Initialize core services
        market_analyzer = MarketAnalyzer(db_client, redis_client)
        news_processor = NewsProcessor(db_client)
        
        # Initialize new analytics services
        trade_intelligence = TradeIntelligenceService(db_client, redis_client)
        await trade_intelligence.initialize()
        
        data_processor = TradeDataProcessor(db_client, redis_client)
        
        # Initialize ML models
        price_model = PricePredictionModel()
        await price_model.load_model()
        
        arbitrage_model = ArbitragePredictionModel()
        await arbitrage_model.load_model()
        
        comprehensive_model = ComprehensiveArbitrageModel()
        await comprehensive_model.load_models()
        
        # Initialize WebSocket manager
        websocket_manager = WebSocketManager()
        
        logger.info("All services initialized successfully!")
        
    except Exception as e:
        logger.error(f"Failed to initialize services: {str(e)}")
        raise

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    global db_client, redis_client
    
    if db_client:
        await db_client.disconnect()
    if redis_client:
        await redis_client.disconnect()
    
    logger.info("Services shut down successfully")

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "services": {
            "database": "connected" if db_client else "disconnected",
            "redis": "connected" if redis_client else "disconnected",
            "models": "loaded" if comprehensive_model and comprehensive_model.is_trained else "not_loaded"
        }
    }

# Enhanced Trade Analytics Endpoints

@app.post("/api/v2/trade-analysis/comprehensive")
async def get_comprehensive_trade_analysis(request: Dict[str, Any]):
    """Get comprehensive trade analysis for a product and route"""
    try:
        product_name = request.get("product_name", "shilajit")
        source_country = request.get("source_country", "IN")
        target_country = request.get("target_country", "US")
        quantity = request.get("quantity", 1000)
        budget = request.get("budget", 50000)
        
        analysis = await trade_intelligence.get_comprehensive_trade_analysis(
            product_name=product_name,
            source_country=source_country,
            target_country=target_country,
            quantity=quantity,
            budget=budget
        )
        
        return {
            "success": True,
            "data": analysis,
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error in comprehensive trade analysis: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v2/arbitrage/opportunity-analysis")
async def analyze_arbitrage_opportunity(request: Dict[str, Any]):
    """Analyze comprehensive arbitrage opportunity"""
    try:
        product_id = request.get("product_id", "shilajit")
        source_country = request.get("source_country", "IN")
        target_country = request.get("target_country", "US")
        quantity = request.get("quantity", 1000)
        current_price = request.get("current_price", 25.0)
        
        analysis = await comprehensive_model.analyze_arbitrage_opportunity(
            product_id=product_id,
            source_country=source_country,
            target_country=target_country,
            quantity=quantity,
            current_price=current_price
        )
        
        return {
            "success": True,
            "data": analysis,
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error in arbitrage opportunity analysis: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v2/market-intelligence/{product_id}")
async def get_market_intelligence(product_id: str, countries: str = "US,DE,UK,AU"):
    """Get detailed market intelligence for a product"""
    try:
        country_list = [c.strip() for c in countries.split(",")]
        
        intelligence = await data_processor.process_market_data(
            product_id=product_id,
            countries=country_list
        )
        
        return {
            "success": True,
            "data": intelligence,
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error getting market intelligence: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v2/suppliers/{country}/{product_category}")
async def get_supplier_intelligence(country: str, product_category: str):
    """Get comprehensive supplier intelligence"""
    try:
        supplier_data = await data_processor.process_supplier_intelligence(
            country=country,
            product_category=product_category
        )
        
        return {
            "success": True,
            "data": supplier_data,
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error getting supplier intelligence: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v2/buyers/{country}/{product_category}")
async def get_buyer_intelligence(country: str, product_category: str):
    """Get comprehensive buyer intelligence"""
    try:
        buyer_data = await data_processor.process_buyer_intelligence(
            country=country,
            product_category=product_category
        )
        
        return {
            "success": True,
            "data": buyer_data,
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error getting buyer intelligence: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v2/predictions/price")
async def predict_price(request: Dict[str, Any]):
    """Advanced price prediction"""
    try:
        product_id = request.get("product_id")
        timeframe = request.get("timeframe", 7)
        
        if not product_id:
            raise HTTPException(status_code=400, detail="product_id is required")
        
        prediction = await price_model.predict(product_id, timeframe)
        
        return {
            "success": True,
            "data": prediction,
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error in price prediction: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v2/arbitrage/opportunities")
async def get_arbitrage_opportunities(
    market: Optional[str] = None,
    min_margin: Optional[float] = 0.1,
    max_risk: Optional[float] = 0.7
):
    """Get filtered arbitrage opportunities"""
    try:
        opportunities = await arbitrage_model.get_all_opportunities()
        
        # Apply filters
        if market:
            opportunities = [opp for opp in opportunities if opp.get("market") == market]
        
        if min_margin:
            opportunities = [opp for opp in opportunities if opp.get("profit_margin", 0) >= min_margin]
        
        if max_risk:
            opportunities = [opp for opp in opportunities if opp.get("risk_score", 1) <= max_risk]
        
        return {
            "success": True,
            "data": {
                "opportunities": opportunities,
                "total_count": len(opportunities),
                "filters_applied": {
                    "market": market,
                    "min_margin": min_margin,
                    "max_risk": max_risk
                }
            },
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error getting arbitrage opportunities: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v2/analytics/order-profit")
async def analyze_order_profit(request: Dict[str, Any]):
    """Analyze profit potential for an order"""
    try:
        order_data = request.get("order_data")
        
        if not order_data:
            raise HTTPException(status_code=400, detail="order_data is required")
        
        analysis = await market_analyzer.analyze_order_profit(order_data)
        
        return {
            "success": True,
            "data": analysis,
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error analyzing order profit: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v2/analytics/multi-product")
async def analyze_multiple_products(request: Dict[str, Any]):
    """Analyze multiple products across markets"""
    try:
        product_ids = request.get("product_ids", [])
        target_markets = request.get("target_markets", [])
        analysis_type = request.get("analysis_type", "arbitrage")
        
        if not product_ids or not target_markets:
            raise HTTPException(
                status_code=400, 
                detail="product_ids and target_markets are required"
            )
        
        analysis = await market_analyzer.analyze_multiple_products(
            product_ids=product_ids,
            target_markets=target_markets,
            analysis_type=analysis_type
        )
        
        return {
            "success": True,
            "data": analysis,
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error in multi-product analysis: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v2/news/impact/{product_id}")
async def get_news_impact(product_id: str, days: int = 7):
    """Get news impact analysis for a product"""
    try:
        impact_analysis = await news_processor.analyze_news_impact(product_id, days)
        
        return {
            "success": True,
            "data": impact_analysis,
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error getting news impact: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Background task endpoints
@app.post("/api/v2/background/update-market-data")
async def trigger_market_data_update(background_tasks: BackgroundTasks):
    """Trigger background market data update"""
    try:
        background_tasks.add_task(update_market_data_task)
        
        return {
            "success": True,
            "message": "Market data update triggered",
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error triggering market data update: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

async def update_market_data_task():
    """Background task to update market data"""
    try:
        logger.info("Starting market data update task...")
        
        # Update market data for key products
        products = ["shilajit", "turmeric", "cardamom", "saffron"]
        countries = ["US", "DE", "UK", "AU", "CA"]
        
        for product in products:
            await data_processor.process_market_data(product, countries)
            await asyncio.sleep(1)  # Rate limiting
        
        logger.info("Market data update task completed")
        
    except Exception as e:
        logger.error(f"Error in market data update task: {str(e)}")

# WebSocket endpoint for real-time updates
@app.websocket("/ws/analytics")
async def websocket_analytics_endpoint(websocket):
    """WebSocket endpoint for real-time analytics updates"""
    try:
        await websocket_manager.connect(websocket)
        
        while True:
            # Send periodic updates
            await asyncio.sleep(30)  # Update every 30 seconds
            
            # Get latest opportunities
            opportunities = await arbitrage_model.get_all_opportunities()
            
            await websocket_manager.send_message(websocket, {
                "type": "arbitrage_update",
                "data": opportunities[:5],  # Top 5 opportunities
                "timestamp": datetime.utcnow().isoformat()
            })
            
    except Exception as e:
        logger.error(f"WebSocket error: {str(e)}")
    finally:
        await websocket_manager.disconnect(websocket)

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )