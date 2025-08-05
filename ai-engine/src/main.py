from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import asyncio
import uvicorn
from datetime import datetime, timedelta
import logging
import json
from contextlib import asynccontextmanager

# Custom modules
from models.prediction_models import PricePredictionModel, ArbitragePredictionModel
from services.market_analyzer import MarketAnalyzer
from services.news_processor import NewsProcessor
from database.mongodb_client import MongoDBClient
from database.redis_client import RedisClient
from utils.websocket_manager import WebSocketManager

# Global instances
db_client = MongoDBClient()
redis_client = RedisClient()
websocket_manager = WebSocketManager()
market_analyzer = MarketAnalyzer(db_client, redis_client)
news_processor = NewsProcessor(db_client)
price_model = PricePredictionModel()
arbitrage_model = ArbitragePredictionModel()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logging.info("Starting AI Engine...")
    
    # Initialize database connections
    await db_client.connect()
    await redis_client.connect()
    
    # Load ML models
    await price_model.load_model()
    await arbitrage_model.load_model()
    
    # Start background tasks
    asyncio.create_task(continuous_market_analysis())
    asyncio.create_task(news_monitoring())
    
    logging.info("AI Engine started successfully")
    yield
    # Shutdown
    await db_client.disconnect()
    await redis_client.disconnect()
    logging.info("AI Engine shut down")

# Initialize FastAPI app
app = FastAPI(
    title="ExportExpressPro AI Engine",
    description="AI-powered market analysis and prediction service",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request/Response models
class PredictionRequest(BaseModel):
    product_id: str
    timeframe: int = 3  # days
    include_arbitrage: bool = True

class MarketAnalysisRequest(BaseModel):
    product_ids: List[str]
    markets: List[str]
    analysis_type: str = "arbitrage"

class PredictionResponse(BaseModel):
    product_id: str
    predictions: Dict[str, Any]
    arbitrage_opportunities: List[Dict[str, Any]]
    confidence: float
    generated_at: datetime

# API Endpoints

@app.get("/")
async def root():
    return {"message": "ExportExpressPro AI Engine", "status": "running"}

@app.post("/predict", response_model=PredictionResponse)
async def predict_price_and_arbitrage(request: PredictionRequest):
    """Generate price predictions and arbitrage opportunities"""
    try:
        # Get product data
        product = await db_client.get_product(request.product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        # Generate price predictions
        price_predictions = await price_model.predict(
            product_id=request.product_id,
            timeframe=request.timeframe
        )
        
        # Generate arbitrage opportunities if requested
        arbitrage_opportunities = []
        if request.include_arbitrage:
            arbitrage_opportunities = await arbitrage_model.find_opportunities(
                product_id=request.product_id,
                current_price=product.get('pricing', {}).get('current_price', 0)
            )
        
        # Calculate overall confidence
        confidence = min(
            price_predictions.get('confidence', 0.5),
            max([opp.get('confidence', 0.5) for opp in arbitrage_opportunities] + [0.5])
        )
        
        # Store predictions in database
        prediction_data = {
            "product_id": request.product_id,
            "timestamp": datetime.utcnow(),
            "predictions": price_predictions,
            "arbitrage_opportunities": arbitrage_opportunities,
            "confidence": confidence
        }
        
        await db_client.store_prediction(prediction_data)
        
        # Send real-time update
        await websocket_manager.broadcast({
            "type": "prediction_update",
            "product_id": request.product_id,
            "predictions": price_predictions,
            "arbitrage_opportunities": arbitrage_opportunities
        })
        
        return PredictionResponse(
            product_id=request.product_id,
            predictions=price_predictions,
            arbitrage_opportunities=arbitrage_opportunities,
            confidence=confidence,
            generated_at=datetime.utcnow()
        )
        
    except Exception as e:
        logging.error(f"Prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/market-analysis")
async def analyze_market(request: MarketAnalysisRequest):
    """Perform comprehensive market analysis"""
    try:
        analysis_result = await market_analyzer.analyze_multiple_products(
            product_ids=request.product_ids,
            target_markets=request.markets,
            analysis_type=request.analysis_type
        )
        
        return {
            "analysis": analysis_result,
            "generated_at": datetime.utcnow(),
            "products_analyzed": len(request.product_ids),
            "markets_analyzed": len(request.markets)
        }
        
    except Exception as e:
        logging.error(f"Market analysis error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/opportunities")
async def get_current_opportunities():
    """Get current arbitrage opportunities"""
    try:
        # Get opportunities from cache first
        cached_opportunities = await redis_client.get("current_opportunities")
        if cached_opportunities:
            return cached_opportunities
        
        # Generate new opportunities
        opportunities = await arbitrage_model.get_all_opportunities()
        
        # Cache for 5 minutes
        await redis_client.set("current_opportunities", opportunities, expire=300)
        
        return {
            "opportunities": opportunities,
            "generated_at": datetime.utcnow(),
            "total_opportunities": len(opportunities)
        }
        
    except Exception as e:
        logging.error(f"Opportunities error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/market-intelligence/{product_id}")
async def get_market_intelligence(product_id: str):
    """Get comprehensive market intelligence for a product"""
    try:
        intelligence = await market_analyzer.get_product_intelligence(product_id)
        return {
            "product_id": product_id,
            "intelligence": intelligence,
            "generated_at": datetime.utcnow()
        }
        
    except Exception as e:
        logging.error(f"Market intelligence error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze-order-profit")
async def analyze_order_profit(order_data: Dict[str, Any]):
    """Analyze profit potential for an order"""
    try:
        analysis = await market_analyzer.analyze_order_profit(order_data)
        return {
            "order_analysis": analysis,
            "generated_at": datetime.utcnow()
        }
        
    except Exception as e:
        logging.error(f"Order profit analysis error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Background Tasks

async def continuous_market_analysis():
    """Continuous market analysis background task"""
    while True:
        try:
            # Get all active products
            products = await db_client.get_all_products()
            
            for product in products:
                # Generate predictions
                predictions = await price_model.predict(
                    product_id=product['_id'],
                    timeframe=7
                )
                
                # Store in database
                await db_client.store_prediction({
                    "product_id": product['_id'],
                    "timestamp": datetime.utcnow(),
                    "predictions": predictions
                })
                
                # Broadcast updates
                await websocket_manager.broadcast({
                    "type": "market_update",
                    "product_id": product['_id'],
                    "predictions": predictions
                })
            
            # Wait 30 minutes before next analysis
            await asyncio.sleep(1800)
            
        except Exception as e:
            logging.error(f"Continuous analysis error: {str(e)}")
            await asyncio.sleep(300)  # Wait 5 minutes on error

async def news_monitoring():
    """Monitor news for market impact"""
    while True:
        try:
            # Process news articles
            news_impact = await news_processor.process_latest_news()
            
            if news_impact:
                # Store news impact
                await db_client.store_news_impact(news_impact)
                
                # Broadcast to connected clients
                await websocket_manager.broadcast({
                    "type": "news_impact",
                    "impact": news_impact
                })
            
            # Wait 15 minutes before next news check
            await asyncio.sleep(900)
            
        except Exception as e:
            logging.error(f"News monitoring error: {str(e)}")
            await asyncio.sleep(300)  # Wait 5 minutes on error

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
