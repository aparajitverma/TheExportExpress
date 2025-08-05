import numpy as np
from datetime import datetime, timezone
from typing import Dict, List, Any, Optional
import logging
from dataclasses import dataclass


@dataclass
class MarketOpportunity:
    """Market opportunity data structure"""
    product_id: str
    market: str
    buy_price: float
    sell_price: float
    profit_margin: float
    confidence: float
    risk_score: float
    optimal_quantity: str
    time_sensitivity: str
    expires_at: datetime


class MarketAnalyzer:
    """Advanced market analysis service"""
    
    def __init__(self, db_client: Any, redis_client: Any):
        self.db_client = db_client
        self.redis_client = redis_client
        self.markets = ["US", "EU", "UK", "Canada", "Australia", "Japan"]
        self.analysis_cache_ttl = 300  # 5 minutes
        
    async def analyze_multiple_products(
        self, 
        product_ids: List[str], 
        target_markets: List[str], 
        analysis_type: str = "arbitrage"
    ) -> Dict[str, Any]:
        """Analyze multiple products across target markets"""
        try:
            analysis_results: Dict[str, Any] = {
                "products_analyzed": len(product_ids),
                "markets_analyzed": len(target_markets),
                "analysis_type": analysis_type,
                "opportunities": [],
                "market_trends": {},
                "risk_assessment": {},
                "generated_at": datetime.now(timezone.utc).isoformat()
            }
            
            for product_id in product_ids:
                product_analysis = await self._analyze_single_product(
                    product_id, target_markets, analysis_type
                )
                opportunities = product_analysis.get("opportunities", [])
                if isinstance(opportunities, list):
                    analysis_results["opportunities"].extend(opportunities)
                
                # Aggregate market trends
                market_trends = product_analysis.get("market_trends", {})
                if isinstance(market_trends, dict):
                    for market, trend in market_trends.items():
                        if market not in analysis_results["market_trends"]:
                            analysis_results["market_trends"][market] = []
                        analysis_results["market_trends"][market].append(trend)
            
            # Calculate overall risk assessment
            analysis_results["risk_assessment"] = await self._calculate_overall_risk(
                analysis_results["opportunities"]
            )
            
            return analysis_results
            
        except Exception as e:
            logging.error(f"Multi-product analysis error: {str(e)}")
            return {"error": str(e)}
    
    async def get_product_intelligence(self, product_id: str) -> Dict[str, Any]:
        """Get comprehensive market intelligence for a product"""
        try:
            # Check cache first
            cache_key = f"intelligence_{product_id}"
            cached_intelligence = await self.redis_client.get(cache_key)
            if cached_intelligence:
                return cached_intelligence
            
            # Get product data
            product = await self.db_client.get_product(product_id)
            if not product:
                return {"error": "Product not found"}
            
            intelligence: Dict[str, Any] = {
                "product_id": product_id,
                "product_name": product.get("name", "Unknown"),
                "current_price": product.get("pricing", {}).get("current_price", 0),
                "market_analysis": {},
                "price_trends": {},
                "supply_analysis": {},
                "demand_analysis": {},
                "risk_factors": [],
                "opportunities": [],
                "recommendations": [],
                "generated_at": datetime.now(timezone.utc).isoformat()
            }
            
            # Analyze each market
            for market in self.markets:
                market_analysis = await self._analyze_market_for_product(
                    product_id, market, product
                )
                intelligence["market_analysis"][market] = market_analysis
            
            # Generate price trends
            intelligence["price_trends"] = await self._generate_price_trends(
                product_id
            )
            
            # Analyze supply and demand
            intelligence["supply_analysis"] = await self._analyze_supply_factors(
                product_id
            )
            intelligence["demand_analysis"] = await self._analyze_demand_factors(
                product_id
            )
            
            # Identify risk factors
            intelligence["risk_factors"] = await self._identify_risk_factors(
                product_id
            )
            
            # Find opportunities
            intelligence["opportunities"] = await self._find_product_opportunities(
                product_id, product
            )
            
            # Generate recommendations
            intelligence["recommendations"] = await self._generate_recommendations(
                product_id, intelligence
            )
            
            # Cache the intelligence
            await self.redis_client.set(
                cache_key, intelligence, expire=self.analysis_cache_ttl
            )
            
            return intelligence
            
        except Exception as e:
            logging.error(f"Product intelligence error: {str(e)}")
            return {"error": str(e)}
    
    async def analyze_order_profit(self, order_data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze profit potential for an order"""
        try:
            analysis: Dict[str, Any] = {
                "order_id": order_data.get("order_id", "unknown"),
                "total_value": 0,
                "estimated_costs": 0.0,
                "predicted_profit": 0,
                "profit_margin": 0,
                "risk_score": 0,
                "confidence": 0,
                "market_opportunities": [],
                "cost_breakdown": {},
                "risk_factors": [],
                "recommendations": [],
                "generated_at": datetime.now(timezone.utc).isoformat()
            }
            
            # Calculate total order value
            total_value = 0
            total_costs = 0.0
            
            for product in order_data.get("products", []):
                product_id = product.get("product_id")
                quantity = product.get("quantity", 0)
                unit_price = product.get("unit_price", 0)
                
                product_value = quantity * unit_price
                total_value += product_value
                
                # Get product intelligence
                intelligence = await self.get_product_intelligence(product_id)
                
                # Calculate costs including transport, duties, etc.
                product_costs = await self._calculate_product_costs(
                    product_id, quantity, intelligence
                )
                total_costs += product_costs
                
                # Find market opportunities for this product
                opportunities = await self._find_market_opportunities(
                    product_id, quantity, intelligence
                )
                analysis["market_opportunities"].extend(opportunities)
            
            analysis["total_value"] = total_value
            analysis["estimated_costs"] = total_costs
            analysis["predicted_profit"] = total_value - total_costs
            analysis["profit_margin"] = (
                (total_value - total_costs) / total_value 
                if total_value > 0 else 0
            )
            
            # Calculate risk and confidence
            analysis["risk_score"] = await self._calculate_order_risk(order_data)
            analysis["confidence"] = await self._calculate_order_confidence(
                order_data
            )
            
            # Generate cost breakdown
            analysis["cost_breakdown"] = await self._generate_cost_breakdown(
                order_data
            )
            
            # Identify risk factors
            analysis["risk_factors"] = await self._identify_order_risks(order_data)
            
            # Generate recommendations
            analysis["recommendations"] = await self._generate_order_recommendations(
                order_data, analysis
            )
            
            return analysis
            
        except Exception as e:
            logging.error(f"Order profit analysis error: {str(e)}")
            return {"error": str(e)}
    
    async def _analyze_single_product(
        self, 
        product_id: str, 
        target_markets: List[str], 
        analysis_type: str
    ) -> Dict[str, Any]:
        """Analyze a single product across target markets"""
        try:
            product = await self.db_client.get_product(product_id)
            if not product:
                return {"error": "Product not found"}
            
            analysis: Dict[str, Any] = {
                "product_id": product_id,
                "product_name": product.get("name", "Unknown"),
                "opportunities": [],
                "market_trends": {},
                "analysis_type": analysis_type
            }
            
            current_price = product.get("pricing", {}).get("current_price", 0)
            
            for market in target_markets:
                if market in self.markets:
                    # Analyze market opportunity
                    opportunity = await self._analyze_market_opportunity(
                        product_id, market, current_price
                    )
                    
                    if opportunity and opportunity["profit_margin"] > 0.1:
                        analysis["opportunities"].append(opportunity)
                    
                    # Analyze market trends
                    trend = await self._analyze_market_trend(product_id, market)
                    analysis["market_trends"][market] = trend
            
            return analysis
            
        except Exception as e:
            logging.error(f"Single product analysis error: {str(e)}")
            return {"error": str(e)}
    
    async def _analyze_market_for_product(
        self, 
        product_id: str, 
        market: str, 
        product: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Analyze specific market for a product"""
        try:
            current_price = product.get("pricing", {}).get("current_price", 0)
            
            # Generate market-specific analysis
            market_price = self._generate_market_price(current_price, market)
            transport_cost = self._get_transport_cost(market)
            duty_rate = self._get_duty_rate(market)
            
            total_cost = current_price + transport_cost + (market_price * duty_rate)
            profit_potential = market_price - total_cost
            
            analysis = {
                "market": market,
                "current_price": current_price,
                "market_price": market_price,
                "transport_cost": transport_cost,
                "duty_rate": duty_rate,
                "total_cost": total_cost,
                "profit_potential": profit_potential,
                "demand_level": self._generate_demand_level(market),
                "supply_level": self._generate_supply_level(market),
                "market_volatility": self._generate_volatility(market),
                "trend": self._generate_market_trend(market),
                "risk_factors": self._identify_market_risks(market)
            }
            
            return analysis
            
        except Exception as e:
            logging.error(f"Market analysis error: {str(e)}")
            return {"error": str(e)}
    
    async def _generate_price_trends(self, product_id: str) -> Dict[str, Any]:
        """Generate price trends for a product"""
        try:
            # Simulate price trend data
            trends = {
                "short_term": {
                    "trend": "increasing",
                    "change_percentage": 5.2,
                    "confidence": 0.75
                },
                "medium_term": {
                    "trend": "stable",
                    "change_percentage": 2.1,
                    "confidence": 0.65
                },
                "long_term": {
                    "trend": "increasing",
                    "change_percentage": 8.5,
                    "confidence": 0.55
                }
            }
            
            return trends
            
        except Exception as e:
            logging.error(f"Price trends error: {str(e)}")
            return {"error": str(e)}
    
    async def _analyze_supply_factors(self, product_id: str) -> Dict[str, Any]:
        """Analyze supply factors for a product"""
        try:
            supply_analysis = {
                "current_supply": "moderate",
                "supply_trend": "stable",
                "supply_risks": ["seasonal_variation", "transport_disruption"],
                "supply_confidence": 0.7,
                "supply_forecast": {
                    "next_month": "stable",
                    "next_quarter": "increasing",
                    "next_year": "stable"
                }
            }
            
            return supply_analysis
            
        except Exception as e:
            logging.error(f"Supply analysis error: {str(e)}")
            return {"error": str(e)}
    
    async def _analyze_demand_factors(self, product_id: str) -> Dict[str, Any]:
        """Analyze demand factors for a product"""
        try:
            demand_analysis = {
                "current_demand": "high",
                "demand_trend": "increasing",
                "demand_drivers": ["health_trends", "export_growth"],
                "demand_confidence": 0.8,
                "demand_forecast": {
                    "next_month": "increasing",
                    "next_quarter": "stable",
                    "next_year": "increasing"
                }
            }
            
            return demand_analysis
            
        except Exception as e:
            logging.error(f"Demand analysis error: {str(e)}")
            return {"error": str(e)}
    
    async def _identify_risk_factors(self, product_id: str) -> List[str]:
        """Identify risk factors for a product"""
        try:
            risk_factors = [
                "price_volatility",
                "supply_disruption_risk",
                "currency_fluctuation",
                "regulatory_changes"
            ]
            
            return risk_factors
            
        except Exception as e:
            logging.error(f"Risk identification error: {str(e)}")
            return []
    
    async def _find_product_opportunities(
        self, 
        product_id: str, 
        product: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        """Find opportunities for a product"""
        try:
            opportunities: List[Dict[str, Any]] = []
            current_price = product.get("pricing", {}).get("current_price", 0)
            
            for market in self.markets:
                opportunity = await self._analyze_market_opportunity(
                    product_id, market, current_price
                )
                
                if opportunity and opportunity["profit_margin"] > 0.1:
                    opportunities.append(opportunity)
            
            return opportunities
            
        except Exception as e:
            logging.error(f"Opportunity finding error: {str(e)}")
            return []
    
    async def _generate_recommendations(
        self, 
        product_id: str, 
        intelligence: Dict[str, Any]
    ) -> List[str]:
        """Generate recommendations based on market intelligence"""
        try:
            recommendations: List[str] = []
            
            # Analyze opportunities
            opportunities = intelligence.get("opportunities", [])
            if opportunities:
                best_opportunity = max(
                    opportunities, 
                    key=lambda x: x.get("profit_margin", 0)
                )
                recommendations.append(
                    f"Consider exporting to {best_opportunity['market']} "
                    f"for {best_opportunity['profit_margin']:.1%} profit margin"
                )
            
            # Analyze risk factors
            risk_factors = intelligence.get("risk_factors", [])
            if "price_volatility" in risk_factors:
                recommendations.append(
                    "Implement hedging strategies for price volatility"
                )
            
            if "supply_disruption_risk" in risk_factors:
                recommendations.append(
                    "Diversify supplier base to reduce supply risks"
                )
            
            # Analyze trends
            price_trends = intelligence.get("price_trends", {})
            short_term = price_trends.get("short_term", {})
            if short_term.get("trend") == "increasing":
                recommendations.append(
                    "Consider forward pricing for short-term gains"
                )
            
            return recommendations
            
        except Exception as e:
            logging.error(f"Recommendation generation error: {str(e)}")
            return []
    
    # Helper methods for market analysis
    def _generate_market_price(self, base_price: float, market: str) -> float:
        """Generate market-specific price"""
        multipliers = {
            "US": 1.8, "EU": 1.6, "UK": 1.7,
            "Canada": 1.9, "Australia": 2.1, "Japan": 1.5
        }
        random_factor = np.random.uniform(0.9, 1.1)
        return base_price * multipliers.get(market, 1.5) * random_factor
    
    def _get_transport_cost(self, market: str) -> float:
        """Get transport cost for market"""
        costs = {
            "US": 800, "EU": 600, "UK": 700,
            "Canada": 900, "Australia": 1200, "Japan": 1000
        }
        return costs.get(market, 1000)
    
    def _get_duty_rate(self, market: str) -> float:
        """Get import duty rate for market"""
        duties = {
            "US": 0.05, "EU": 0.08, "UK": 0.06,
            "Canada": 0.07, "Australia": 0.10, "Japan": 0.04
        }
        return duties.get(market, 0.08)
    
    def _generate_demand_level(self, market: str) -> float:
        """Generate demand level for market"""
        return np.random.uniform(0.4, 1.0)
    
    def _generate_supply_level(self, market: str) -> float:
        """Generate supply level for market"""
        return np.random.uniform(0.3, 0.9)
    
    def _generate_volatility(self, market: str) -> float:
        """Generate market volatility"""
        return np.random.uniform(0.1, 0.4)
    
    def _generate_market_trend(self, market: str) -> str:
        """Generate market trend"""
        trends = ["increasing", "stable", "decreasing"]
        return np.random.choice(trends, p=[0.4, 0.4, 0.2])
    
    def _identify_market_risks(self, market: str) -> List[str]:
        """Identify risks for market"""
        risks: List[str] = []
        if np.random.random() > 0.7:
            risks.append("regulatory_risk")
        if np.random.random() > 0.8:
            risks.append("currency_risk")
        return risks if risks else ["low_risk"]
    
    async def _analyze_market_opportunity(
        self, 
        product_id: str, 
        market: str, 
        current_price: float
    ) -> Optional[Dict[str, Any]]:
        """Analyze market opportunity"""
        try:
            market_price = self._generate_market_price(current_price, market)
            transport_cost = self._get_transport_cost(market)
            duty_cost = market_price * self._get_duty_rate(market)
            total_cost = current_price + transport_cost + duty_cost
            
            profit = market_price - total_cost
            profit_margin = profit / total_cost if total_cost > 0 else 0
            
            if profit > 0 and profit_margin > 0.1:
                return {
                    "market": market,
                    "buy_price": current_price,
                    "sell_price": market_price,
                    "transport_cost": transport_cost,
                    "duty_cost": duty_cost,
                    "total_cost": total_cost,
                    "net_profit": round(profit, 2),
                    "profit_margin": round(profit_margin, 3),
                    "confidence": min(0.95, 0.7 + profit_margin * 2),
                    "risk_score": max(0.1, 0.5 - profit_margin)
                }
            
            return None
            
        except Exception as e:
            logging.error(f"Market opportunity analysis error: {str(e)}")
            return None
    
    async def _analyze_market_trend(
        self, product_id: str, market: str
    ) -> Dict[str, Any]:
        """Analyze market trend"""
        return {
            "trend": self._generate_market_trend(market),
            "confidence": np.random.uniform(0.6, 0.9),
            "factors": ["demand_growth", "supply_stability"]
        }
    
    async def _calculate_overall_risk(
        self, opportunities: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Calculate overall risk assessment"""
        try:
            if not opportunities:
                return {"risk_level": "low", "risk_score": 0.2}
            
            avg_risk_score = np.mean(
                [opp.get("risk_score", 0.5) for opp in opportunities]
            )
            
            if avg_risk_score < 0.3:
                risk_level = "low"
            elif avg_risk_score < 0.6:
                risk_level = "medium"
            else:
                risk_level = "high"
            
            return {
                "risk_level": risk_level,
                "risk_score": round(avg_risk_score, 3),
                "risk_factors": ["market_volatility", "currency_risk"]
            }
            
        except Exception as e:
            logging.error(f"Risk calculation error: {str(e)}")
            return {"risk_level": "medium", "risk_score": 0.5}
    
    async def _calculate_product_costs(
        self, 
        product_id: str, 
        quantity: float, 
        intelligence: Dict[str, Any]
    ) -> float:
        """Calculate total costs for a product"""
        try:
            base_cost = quantity * intelligence.get("current_price", 0)
            transport_cost = quantity * 0.1  # 10% of base cost for transport
            duty_cost = base_cost * 0.05  # 5% duty
            documentation_cost = 200  # Fixed documentation cost
            
            return base_cost + transport_cost + duty_cost + documentation_cost
            
        except Exception as e:
            logging.error(f"Cost calculation error: {str(e)}")
            return 0
    
    async def _find_market_opportunities(
        self, 
        product_id: str, 
        quantity: float, 
        intelligence: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        """Find market opportunities for a product"""
        try:
            opportunities = intelligence.get("opportunities", [])
            return opportunities[:3]  # Return top 3 opportunities
            
        except Exception as e:
            logging.error(f"Market opportunity finding error: {str(e)}")
            return []
    
    async def _calculate_order_risk(self, order_data: Dict[str, Any]) -> float:
        """Calculate risk score for an order"""
        try:
            # Simple risk calculation based on order size and complexity
            total_value = sum(
                p.get("quantity", 0) * p.get("unit_price", 0) 
                for p in order_data.get("products", [])
            )
            
            if total_value > 100000:
                return 0.7  # High risk for large orders
            elif total_value > 50000:
                return 0.5  # Medium risk
            else:
                return 0.3  # Low risk
            
        except Exception as e:
            logging.error(f"Order risk calculation error: {str(e)}")
            return 0.5
    
    async def _calculate_order_confidence(
        self, order_data: Dict[str, Any]
    ) -> float:
        """Calculate confidence level for an order"""
        try:
            # Simple confidence calculation
            num_products = len(order_data.get("products", []))
            
            if num_products == 1:
                return 0.9  # High confidence for single product
            elif num_products <= 3:
                return 0.8  # Medium-high confidence
            else:
                return 0.6  # Lower confidence for complex orders
            
        except Exception as e:
            logging.error(f"Order confidence calculation error: {str(e)}")
            return 0.7
    
    async def _generate_cost_breakdown(
        self, order_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Generate detailed cost breakdown for an order"""
        try:
            breakdown = {
                "product_costs": 0,
                "transport_costs": 0,
                "duty_costs": 0,
                "documentation_costs": 0,
                "insurance_costs": 0,
                "total_costs": 0
            }
            
            for product in order_data.get("products", []):
                quantity = product.get("quantity", 0)
                unit_price = product.get("unit_price", 0)
                
                product_cost = quantity * unit_price
                breakdown["product_costs"] += product_cost
                
                # Estimate other costs
                breakdown["transport_costs"] += product_cost * 0.1
                breakdown["duty_costs"] += product_cost * 0.05
                breakdown["documentation_costs"] += 50  # Fixed per product
                breakdown["insurance_costs"] += product_cost * 0.02
            
            breakdown["total_costs"] = sum(breakdown.values()) - breakdown["total_costs"]
            
            return breakdown
            
        except Exception as e:
            logging.error(f"Cost breakdown generation error: {str(e)}")
            return {}
    
    async def _identify_order_risks(self, order_data: Dict[str, Any]) -> List[str]:
        """Identify risks for an order"""
        try:
            risks: List[str] = []
            
            total_value = sum(
                p.get("quantity", 0) * p.get("unit_price", 0) 
                for p in order_data.get("products", [])
            )
            
            if total_value > 100000:
                risks.append("high_value_risk")
            
            if len(order_data.get("products", [])) > 5:
                risks.append("complex_order_risk")
            
            if any(
                p.get("quantity", 0) > 1000 
                for p in order_data.get("products", [])
            ):
                risks.append("large_quantity_risk")
            
            return risks if risks else ["low_risk"]
            
        except Exception as e:
            logging.error(f"Order risk identification error: {str(e)}")
            return ["unknown_risk"]
    
    async def _generate_order_recommendations(
        self, 
        order_data: Dict[str, Any], 
        analysis: Dict[str, Any]
    ) -> List[str]:
        """Generate recommendations for an order"""
        try:
            recommendations: List[str] = []
            
            profit_margin = analysis.get("profit_margin", 0)
            risk_score = analysis.get("risk_score", 0.5)
            
            if profit_margin > 0.2:
                recommendations.append(
                    "High profit margin - consider expanding order"
                )
            elif profit_margin < 0.1:
                recommendations.append(
                    "Low profit margin - consider renegotiating prices"
                )
            
            if risk_score > 0.7:
                recommendations.append(
                    "High risk order - consider insurance coverage"
                )
            
            if len(order_data.get("products", [])) > 3:
                recommendations.append(
                    "Complex order - consider splitting into smaller orders"
                )
            
            return recommendations
            
        except Exception as e:
            logging.error(f"Order recommendation generation error: {str(e)}")
            return ["Unable to generate recommendations"] 