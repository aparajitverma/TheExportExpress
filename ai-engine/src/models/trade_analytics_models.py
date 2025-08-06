import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Tuple
import logging
import asyncio
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.cluster import KMeans
import joblib
import os
from dataclasses import dataclass, asdict
from enum import Enum

class RiskLevel(Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class TradeProfitability(Enum):
    POOR = "poor"
    FAIR = "fair"
    GOOD = "good"
    EXCELLENT = "excellent"

@dataclass
class CountryProfile:
    """Complete country trade profile"""
    country_code: str
    country_name: str
    region: str
    currency: str
    exchange_rate: float
    import_regulations: Dict[str, Any]
    export_regulations: Dict[str, Any]
    trade_treaties: List[str]
    customs_procedures: Dict[str, Any]
    documentation_requirements: List[str]
    typical_lead_times: Dict[str, int]  # transport_mode -> days
    risk_factors: List[str]
    trade_relationships: Dict[str, float]  # country -> trade_strength_score
    port_efficiency: float  # 0-1 score
    infrastructure_quality: float  # 0-1 score
    business_environment: Dict[str, Any]

@dataclass
class ProductProfile:
    """Complete product trade profile"""
    product_id: str
    product_name: str
    category: str
    subcategory: str
    hs_code: str
    origin_country: str
    seasonal_factors: Dict[str, float]  # month -> factor
    perishability: bool
    special_handling: List[str]
    packaging_requirements: Dict[str, Any]
    quality_standards: Dict[str, List[str]]  # country -> standards
    certifications_required: Dict[str, List[str]]  # country -> certifications
    storage_requirements: Dict[str, Any]
    transport_restrictions: List[str]
    market_demand_patterns: Dict[str, Dict[str, float]]  # country -> seasonal_demand

@dataclass
class SupplierProfile:
    """Complete supplier profile"""
    supplier_id: str
    name: str
    country: str
    region: str
    contact_info: Dict[str, str]
    products_supplied: List[str]
    capacity: Dict[str, int]  # product_id -> monthly_capacity
    quality_rating: float  # 0-5 scale
    reliability_score: float  # 0-1 scale
    pricing_competitiveness: float  # 0-1 scale
    payment_terms: List[str]
    lead_times: Dict[str, int]  # product_id -> days
    certifications: List[str]
    trade_references: List[Dict[str, str]]
    preferred_order_sizes: Dict[str, Tuple[int, int]]  # product_id -> (min, max)
    languages_spoken: List[str]
    business_hours: str
    response_time: str  # typical response time

@dataclass
class BuyerProfile:
    """Complete buyer profile"""
    buyer_id: str
    name: str
    country: str
    region: str
    contact_info: Dict[str, str]
    products_needed: List[str]
    volume_requirements: Dict[str, int]  # product_id -> monthly_volume
    quality_standards: Dict[str, List[str]]  # product_id -> standards
    payment_capacity: float
    payment_preferences: List[str]
    delivery_preferences: Dict[str, Any]
    seasonal_buying_patterns: Dict[str, Dict[str, float]]  # product -> month -> factor
    price_sensitivity: float  # 0-1 scale
    relationship_strength: float  # 0-1 scale
    market_position: str  # wholesale, retail, distributor
    growth_potential: float  # 0-1 scale

@dataclass
class TradeRoute:
    """Complete trade route analysis"""
    origin_country: str
    destination_country: str
    product_category: str
    transport_modes: List[Dict[str, Any]]
    total_transit_time: int  # days
    cost_breakdown: Dict[str, float]
    risk_assessment: Dict[str, Any]
    documentation_timeline: Dict[str, int]  # document -> days_needed
    seasonal_variations: Dict[str, float]  # month -> cost_factor
    alternative_routes: List[Dict[str, Any]]
    insurance_requirements: Dict[str, Any]
    tracking_capabilities: Dict[str, bool]

class ComprehensiveArbitrageModel:
    """Advanced arbitrage prediction model with comprehensive analytics"""
    
    def __init__(self):
        self.price_model = None
        self.demand_model = None
        self.risk_model = None
        self.route_optimizer = None
        self.scaler = StandardScaler()
        self.label_encoders = {}
        self.model_path = "models/comprehensive_arbitrage_model.pkl"
        self.is_trained = False
        
        # Reference data
        self.countries_data = {}
        self.products_data = {}
        self.suppliers_data = {}
        self.buyers_data = {}
        self.trade_routes = {}
        self.market_intelligence = {}
        
    async def load_models(self):
        """Load all trained models"""
        try:
            if os.path.exists(self.model_path):
                model_data = joblib.load(self.model_path)
                self.price_model = model_data['price_model']
                self.demand_model = model_data['demand_model']
                self.risk_model = model_data['risk_model']
                self.scaler = model_data['scaler']
                self.label_encoders = model_data['label_encoders']
                self.is_trained = True
                logging.info("Loaded comprehensive arbitrage models")
            else:
                await self.train_models()
        except Exception as e:
            logging.error(f"Error loading models: {str(e)}")
            await self.train_models()
    
    async def train_models(self):
        """Train all prediction models"""
        try:
            # Generate synthetic training data
            training_data = self._generate_training_data()
            
            # Prepare features
            X = self._prepare_features(training_data)
            
            # Train price prediction model
            price_targets = training_data['market_prices']
            self.price_model = GradientBoostingRegressor(
                n_estimators=200,
                max_depth=8,
                random_state=42
            )
            self.price_model.fit(X, price_targets)
            
            # Train demand prediction model
            demand_targets = training_data['demand_scores']
            self.demand_model = RandomForestRegressor(
                n_estimators=150,
                max_depth=10,
                random_state=42
            )
            self.demand_model.fit(X, demand_targets)
            
            # Train risk assessment model
            risk_targets = training_data['risk_scores']
            self.risk_model = RandomForestRegressor(
                n_estimators=100,
                max_depth=6,
                random_state=42
            )
            self.risk_model.fit(X, risk_targets)
            
            # Save models
            os.makedirs("models", exist_ok=True)
            model_data = {
                'price_model': self.price_model,
                'demand_model': self.demand_model,
                'risk_model': self.risk_model,
                'scaler': self.scaler,
                'label_encoders': self.label_encoders
            }
            joblib.dump(model_data, self.model_path)
            
            self.is_trained = True
            logging.info("Trained comprehensive arbitrage models")
            
        except Exception as e:
            logging.error(f"Error training models: {str(e)}")
            self.is_trained = False
    
    async def analyze_arbitrage_opportunity(
        self, 
        product_id: str, 
        source_country: str, 
        target_country: str,
        quantity: int,
        current_price: float
    ) -> Dict[str, Any]:
        """Comprehensive arbitrage analysis"""
        try:
            if not self.is_trained:
                await self.train_models()
            
            # Get comprehensive analysis
            analysis = {
                "opportunity_id": f"{product_id}_{source_country}_{target_country}",
                "product_analysis": await self._analyze_product_opportunity(
                    product_id, source_country, target_country, quantity, current_price
                ),
                "market_intelligence": await self._get_market_intelligence(
                    product_id, source_country, target_country
                ),
                "supplier_recommendations": await self._recommend_suppliers(
                    product_id, source_country, quantity
                ),
                "buyer_recommendations": await self._recommend_buyers(
                    product_id, target_country, quantity
                ),
                "route_optimization": await self._optimize_trade_route(
                    product_id, source_country, target_country, quantity
                ),
                "cost_analysis": await self._comprehensive_cost_analysis(
                    product_id, source_country, target_country, quantity, current_price
                ),
                "regulatory_compliance": await self._analyze_regulatory_compliance(
                    product_id, source_country, target_country
                ),
                "risk_assessment": await self._comprehensive_risk_assessment(
                    product_id, source_country, target_country, quantity
                ),
                "negotiation_strategy": await self._generate_negotiation_strategy(
                    product_id, source_country, target_country, current_price
                ),
                "timeline_analysis": await self._analyze_trade_timeline(
                    product_id, source_country, target_country
                ),
                "payment_recommendations": await self._recommend_payment_methods(
                    source_country, target_country, quantity * current_price
                ),
                "packaging_transport": await self._analyze_packaging_transport(
                    product_id, source_country, target_country, quantity
                ),
                "best_practices": await self._get_best_practices(
                    product_id, source_country, target_country
                ),
                "generated_at": datetime.utcnow().isoformat()
            }
            
            return analysis
            
        except Exception as e:
            logging.error(f"Error analyzing arbitrage opportunity: {str(e)}")
            return {"error": str(e)}
    
    async def _analyze_product_opportunity(
        self, product_id: str, source_country: str, target_country: str, 
        quantity: int, current_price: float
    ) -> Dict[str, Any]:
        """Analyze the specific product opportunity"""
        try:
            # Predict market price
            features = self._create_prediction_features(
                product_id, source_country, target_country, quantity
            )
            predicted_price = self.price_model.predict([features])[0]
            predicted_demand = self.demand_model.predict([features])[0]
            predicted_risk = self.risk_model.predict([features])[0]
            
            # Calculate profit potential
            transport_cost = self._estimate_transport_cost(
                source_country, target_country, quantity
            )
            duty_cost = predicted_price * self._get_duty_rate(target_country, product_id)
            documentation_cost = self._estimate_documentation_cost(
                source_country, target_country
            )
            
            total_cost = current_price + transport_cost + duty_cost + documentation_cost
            net_profit = (predicted_price * quantity) - (total_cost * quantity)
            profit_margin = net_profit / (total_cost * quantity) if total_cost > 0 else 0
            
            return {
                "predicted_market_price": round(predicted_price, 2),
                "current_source_price": current_price,
                "predicted_demand_score": round(predicted_demand, 3),
                "risk_score": round(predicted_risk, 3),
                "cost_breakdown": {
                    "source_price": current_price,
                    "transport_cost": round(transport_cost, 2),
                    "duty_cost": round(duty_cost, 2),
                    "documentation_cost": round(documentation_cost, 2),
                    "total_cost_per_unit": round(total_cost, 2)
                },
                "profit_analysis": {
                    "total_revenue": round(predicted_price * quantity, 2),
                    "total_cost": round(total_cost * quantity, 2),
                    "net_profit": round(net_profit, 2),
                    "profit_margin": round(profit_margin, 3),
                    "roi": round(net_profit / (current_price * quantity), 3) if current_price > 0 else 0
                },
                "opportunity_score": round(
                    (profit_margin * 0.4) + (predicted_demand * 0.3) + ((1-predicted_risk) * 0.3), 3
                ),
                "confidence_level": self._calculate_confidence(profit_margin, predicted_demand, predicted_risk)
            }
            
        except Exception as e:
            logging.error(f"Error analyzing product opportunity: {str(e)}")
            return {"error": str(e)}
    
    def _generate_training_data(self) -> Dict[str, Any]:
        """Generate comprehensive training data"""
        np.random.seed(42)
        n_samples = 2000
        
        # Create feature combinations
        countries = ["IN", "US", "DE", "CN", "JP", "UK", "CA", "AU", "BR", "MX"]
        products = ["spices", "textiles", "electronics", "machinery", "chemicals"]
        
        data = {
            'source_countries': np.random.choice(countries, n_samples),
            'target_countries': np.random.choice(countries, n_samples),
            'product_categories': np.random.choice(products, n_samples),
            'quantities': np.random.randint(100, 10000, n_samples),
            'source_prices': np.random.uniform(10, 1000, n_samples),
            'seasonal_factors': np.random.uniform(0.8, 1.3, n_samples),
            'market_volatility': np.random.uniform(0.1, 0.6, n_samples),
            'trade_relationship': np.random.uniform(0.3, 1.0, n_samples)
        }
        
        # Generate target variables with realistic relationships
        market_prices = []
        demand_scores = []
        risk_scores = []
        
        for i in range(n_samples):
            # Market price influenced by source price, trade relationship, volatility
            base_multiplier = 1.5 + (0.5 * data['trade_relationship'][i])
            volatility_factor = 1 + (data['market_volatility'][i] * 0.3)
            seasonal_factor = data['seasonal_factors'][i]
            
            market_price = (data['source_prices'][i] * base_multiplier * 
                          volatility_factor * seasonal_factor)
            market_prices.append(market_price)
            
            # Demand score influenced by price difference and market factors
            price_attractiveness = min(1.0, (market_price - data['source_prices'][i]) / data['source_prices'][i])
            demand_score = min(1.0, price_attractiveness * data['trade_relationship'][i] * 
                             np.random.uniform(0.7, 1.0))
            demand_scores.append(demand_score)
            
            # Risk score influenced by countries, volatility, and trade relationship
            base_risk = 0.3
            volatility_risk = data['market_volatility'][i] * 0.4
            relationship_risk = (1 - data['trade_relationship'][i]) * 0.3
            risk_score = min(1.0, base_risk + volatility_risk + relationship_risk)
            risk_scores.append(risk_score)
        
        data['market_prices'] = np.array(market_prices)
        data['demand_scores'] = np.array(demand_scores)
        data['risk_scores'] = np.array(risk_scores)
        
        return data
    
    def _prepare_features(self, training_data: Dict[str, Any]) -> np.ndarray:
        """Prepare features for model training"""
        # Encode categorical variables
        if 'source_countries' not in self.label_encoders:
            self.label_encoders['source_countries'] = LabelEncoder()
            self.label_encoders['target_countries'] = LabelEncoder()
            self.label_encoders['product_categories'] = LabelEncoder()
        
        source_encoded = self.label_encoders['source_countries'].fit_transform(
            training_data['source_countries']
        )
        target_encoded = self.label_encoders['target_countries'].fit_transform(
            training_data['target_countries']
        )
        product_encoded = self.label_encoders['product_categories'].fit_transform(
            training_data['product_categories']
        )
        
        # Combine features
        features = np.column_stack([
            source_encoded,
            target_encoded,
            product_encoded,
            training_data['quantities'],
            training_data['source_prices'],
            training_data['seasonal_factors'],
            training_data['market_volatility'],
            training_data['trade_relationship']
        ])
        
        # Scale features
        features = self.scaler.fit_transform(features)
        
        return features
    
    def _create_prediction_features(
        self, product_id: str, source_country: str, target_country: str, quantity: int
    ) -> np.ndarray:
        """Create features for prediction"""
        # Simplified feature creation for prediction
        # In production, these would come from real data
        
        # Encode categorical features
        try:
            source_encoded = self.label_encoders['source_countries'].transform([source_country])[0]
        except:
            source_encoded = 0
            
        try:
            target_encoded = self.label_encoders['target_countries'].transform([target_country])[0]
        except:
            target_encoded = 0
            
        try:
            product_encoded = self.label_encoders['product_categories'].transform(['spices'])[0]
        except:
            product_encoded = 0
        
        # Create feature vector
        features = np.array([
            source_encoded,
            target_encoded,
            product_encoded,
            quantity,
            2500,  # base price
            1.0,   # seasonal factor
            0.3,   # market volatility
            0.8    # trade relationship
        ])
        
        # Scale features
        features = self.scaler.transform([features])[0]
        
        return features
    
    def _estimate_transport_cost(self, source: str, target: str, quantity: int) -> float:
        """Estimate transportation cost"""
        base_costs = {
            "IN": {"US": 1200, "DE": 800, "UK": 900, "AU": 1500},
            "US": {"DE": 1000, "UK": 800, "IN": 1200, "JP": 1300},
            "DE": {"US": 1000, "UK": 300, "IN": 800, "CN": 900}
        }
        
        base_cost = base_costs.get(source, {}).get(target, 1000)
        quantity_factor = 1.0 + (quantity / 10000) * 0.2  # Volume discount
        
        return base_cost / quantity_factor
    
    def _get_duty_rate(self, country: str, product_id: str) -> float:
        """Get import duty rate"""
        duty_rates = {
            "US": 0.05, "DE": 0.08, "UK": 0.06, "AU": 0.10,
            "JP": 0.04, "CA": 0.07, "BR": 0.12, "MX": 0.09
        }
        return duty_rates.get(country, 0.08)
    
    def _estimate_documentation_cost(self, source: str, target: str) -> float:
        """Estimate documentation and handling costs"""
        return 500  # Base documentation cost
    
    def _calculate_confidence(self, profit_margin: float, demand: float, risk: float) -> float:
        """Calculate confidence level for the opportunity"""
        # Higher profit margin and demand, lower risk = higher confidence
        confidence = (profit_margin * 0.4) + (demand * 0.3) + ((1-risk) * 0.3)
        return min(0.95, max(0.1, confidence))