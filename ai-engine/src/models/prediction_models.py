import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import logging
import asyncio
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
import joblib
import os

class PricePredictionModel:
    """Advanced price prediction model using machine learning"""
    
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self.model_path = "models/price_prediction_model.pkl"
        self.scaler_path = "models/price_scaler.pkl"
        self.is_trained = False
        
    async def load_model(self):
        """Load pre-trained model or create new one"""
        try:
            if os.path.exists(self.model_path) and os.path.exists(self.scaler_path):
                self.model = joblib.load(self.model_path)
                self.scaler = joblib.load(self.scaler_path)
                self.is_trained = True
                logging.info("Loaded pre-trained price prediction model")
            else:
                await self.train_model()
        except Exception as e:
            logging.error(f"Error loading model: {str(e)}")
            await self.train_model()
    
    async def train_model(self):
        """Train the price prediction model"""
        try:
            # Create synthetic training data for demonstration
            # In production, this would use real historical data
            np.random.seed(42)
            n_samples = 1000
            
            # Generate synthetic features
            historical_prices = np.random.normal(2000, 500, n_samples)
            supply_levels = np.random.uniform(0.3, 1.0, n_samples)
            demand_levels = np.random.uniform(0.4, 1.2, n_samples)
            seasonal_factors = np.random.uniform(0.8, 1.3, n_samples)
            market_volatility = np.random.uniform(0.1, 0.5, n_samples)
            
            # Generate target prices with some realistic patterns
            target_prices = (
                historical_prices * 
                (1 + 0.2 * (demand_levels - 0.8)) *
                (1 - 0.15 * (supply_levels - 0.65)) *
                seasonal_factors *
                (1 + 0.1 * market_volatility)
            )
            
            # Create feature matrix
            X = np.column_stack([
                historical_prices,
                supply_levels,
                demand_levels,
                seasonal_factors,
                market_volatility
            ])
            
            # Scale features
            X_scaled = self.scaler.fit_transform(X)
            
            # Train model
            self.model = RandomForestRegressor(
                n_estimators=100,
                max_depth=10,
                random_state=42
            )
            self.model.fit(X_scaled, target_prices)
            
            # Save model
            os.makedirs("models", exist_ok=True)
            joblib.dump(self.model, self.model_path)
            joblib.dump(self.scaler, self.scaler_path)
            
            self.is_trained = True
            logging.info("Trained new price prediction model")
            
        except Exception as e:
            logging.error(f"Error training model: {str(e)}")
            self.is_trained = False
    
    async def predict(self, product_id: str, timeframe: int = 3) -> Dict[str, Any]:
        """Predict price for a product over specified timeframe"""
        try:
            if not self.is_trained:
                await self.train_model()
            
            # Generate features for prediction
            # In production, these would come from real market data
            current_price = 2500  # Base price
            supply_level = np.random.uniform(0.4, 0.9)
            demand_level = np.random.uniform(0.5, 1.1)
            seasonal_factor = 1.0 + 0.2 * np.sin(2 * np.pi * datetime.now().timetuple().tm_yday / 365)
            market_volatility = np.random.uniform(0.1, 0.4)
            
            # Create feature vector
            features = np.array([[
                current_price,
                supply_level,
                demand_level,
                seasonal_factor,
                market_volatility
            ]])
            
            # Scale features
            features_scaled = self.scaler.transform(features)
            
            # Make prediction
            predicted_price = self.model.predict(features_scaled)[0]
            
            # Calculate confidence based on model uncertainty
            confidence = max(0.5, min(0.95, 1.0 - market_volatility))
            
            # Generate multiple timeframe predictions
            predictions = {}
            for days in [3, 7, 14, 30]:
                # Adjust prediction based on timeframe
                time_factor = 1.0 + 0.05 * (days - 3)  # Slight upward trend
                volatility_factor = 1.0 + 0.1 * market_volatility * (days / 7)
                
                adjusted_price = predicted_price * time_factor * volatility_factor
                
                predictions[f"price_{days}_days"] = {
                    "value": round(adjusted_price, 2),
                    "confidence": max(0.3, confidence - 0.1 * (days / 7)),
                    "factors": self._get_influencing_factors(supply_level, demand_level, market_volatility)
                }
            
            return {
                "predictions": predictions,
                "confidence": confidence,
                "model_version": "1.0",
                "last_updated": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logging.error(f"Prediction error: {str(e)}")
            return {
                "predictions": {
                    "price_3_days": {"value": 2500, "confidence": 0.5, "factors": ["default"]}
                },
                "confidence": 0.5,
                "error": str(e)
            }
    
    def _get_influencing_factors(self, supply: float, demand: float, volatility: float) -> List[str]:
        """Get list of factors influencing the prediction"""
        factors = []
        
        if supply < 0.5:
            factors.append("supply_disruption")
        elif supply > 0.8:
            factors.append("high_supply")
            
        if demand > 1.0:
            factors.append("increased_demand")
        elif demand < 0.6:
            factors.append("low_demand")
            
        if volatility > 0.3:
            factors.append("high_volatility")
            
        if not factors:
            factors.append("stable_market")
            
        return factors


class ArbitragePredictionModel:
    """Arbitrage opportunity detection model"""
    
    def __init__(self):
        self.markets = ["US", "EU", "UK", "Canada", "Australia", "Japan"]
        self.transport_costs = {
            "US": 800,
            "EU": 600,
            "UK": 700,
            "Canada": 900,
            "Australia": 1200,
            "Japan": 1000
        }
        self.import_duties = {
            "US": 0.05,
            "EU": 0.08,
            "UK": 0.06,
            "Canada": 0.07,
            "Australia": 0.10,
            "Japan": 0.04
        }
    
    async def load_model(self):
        """Load arbitrage detection model"""
        # For now, use rule-based approach
        # In production, train ML model on historical arbitrage successes
        logging.info("Arbitrage model loaded (rule-based)")
    
    async def find_opportunities(self, product_id: str, current_price: float) -> List[Dict[str, Any]]:
        """Find arbitrage opportunities for a product"""
        try:
            opportunities = []
            
            for market in self.markets:
                # Generate market-specific pricing
                market_price = self._generate_market_price(current_price, market)
                transport_cost = self.transport_costs[market]
                duty_cost = market_price * self.import_duties[market]
                total_cost = current_price + transport_cost + duty_cost
                
                # Calculate profit potential
                profit = market_price - total_cost
                profit_margin = profit / total_cost if total_cost > 0 else 0
                
                # Only include profitable opportunities
                if profit > 0 and profit_margin > 0.1:  # 10% minimum margin
                    confidence = self._calculate_confidence(profit_margin, market)
                    
                    opportunities.append({
                        "market": market,
                        "buy_price": current_price,
                        "sell_price": market_price,
                        "transport_cost": transport_cost,
                        "duty_cost": duty_cost,
                        "total_cost": total_cost,
                        "net_profit": round(profit, 2),
                        "profit_margin": round(profit_margin, 3),
                        "confidence": confidence,
                        "risk_score": self._calculate_risk_score(market, profit_margin),
                        "optimal_quantity": self._get_optimal_quantity(profit_margin),
                        "time_sensitivity": self._get_time_sensitivity(profit_margin),
                        "expires": datetime.utcnow() + timedelta(hours=np.random.randint(6, 48))
                    })
            
            # Sort by profit margin
            opportunities.sort(key=lambda x: x['profit_margin'], reverse=True)
            
            return opportunities[:5]  # Return top 5 opportunities
            
        except Exception as e:
            logging.error(f"Arbitrage analysis error: {str(e)}")
            return []
    
    async def get_all_opportunities(self) -> List[Dict[str, Any]]:
        """Get all current arbitrage opportunities across all products"""
        try:
            # This would typically fetch from database
            # For now, return synthetic opportunities
            opportunities = []
            
            products = [
                {"id": "saffron", "name": "Saffron", "price": 2500},
                {"id": "cardamom", "name": "Cardamom", "price": 1800},
                {"id": "turmeric", "name": "Turmeric", "price": 1200}
            ]
            
            for product in products:
                product_opportunities = await self.find_opportunities(
                    product["id"], 
                    product["price"]
                )
                
                for opp in product_opportunities:
                    opp["product_id"] = product["id"]
                    opp["product_name"] = product["name"]
                    opportunities.append(opp)
            
            return opportunities
            
        except Exception as e:
            logging.error(f"Error getting all opportunities: {str(e)}")
            return []
    
    def _generate_market_price(self, base_price: float, market: str) -> float:
        """Generate market-specific price"""
        # Market-specific multipliers
        multipliers = {
            "US": 1.8,
            "EU": 1.6,
            "UK": 1.7,
            "Canada": 1.9,
            "Australia": 2.1,
            "Japan": 1.5
        }
        
        # Add some randomness
        random_factor = np.random.uniform(0.9, 1.1)
        return base_price * multipliers[market] * random_factor
    
    def _calculate_confidence(self, profit_margin: float, market: str) -> float:
        """Calculate confidence level for an opportunity"""
        base_confidence = min(0.95, 0.7 + profit_margin * 2)
        
        # Market-specific adjustments
        market_confidence = {
            "US": 1.0,
            "EU": 0.95,
            "UK": 0.9,
            "Canada": 0.85,
            "Australia": 0.8,
            "Japan": 0.9
        }
        
        return base_confidence * market_confidence[market]
    
    def _calculate_risk_score(self, market: str, profit_margin: float) -> float:
        """Calculate risk score for an opportunity"""
        base_risk = 0.3
        
        # Market-specific risk
        market_risk = {
            "US": 0.2,
            "EU": 0.25,
            "UK": 0.3,
            "Canada": 0.35,
            "Australia": 0.4,
            "Japan": 0.25
        }
        
        # Profit margin adjustment
        margin_risk = max(0.1, 0.5 - profit_margin)
        
        return min(1.0, base_risk + market_risk[market] + margin_risk)
    
    def _get_optimal_quantity(self, profit_margin: float) -> str:
        """Get optimal quantity range based on profit margin"""
        if profit_margin > 0.3:
            return "200-500kg"
        elif profit_margin > 0.2:
            return "100-300kg"
        elif profit_margin > 0.15:
            return "50-200kg"
        else:
            return "25-100kg"
    
    def _get_time_sensitivity(self, profit_margin: float) -> str:
        """Get time sensitivity level"""
        if profit_margin > 0.25:
            return "high"
        elif profit_margin > 0.15:
            return "medium"
        else:
            return "low" 