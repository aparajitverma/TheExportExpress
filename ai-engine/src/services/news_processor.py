import asyncio
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import json
import re
from dataclasses import dataclass

@dataclass
class NewsImpact:
    """News impact data structure"""
    headline: str
    summary: str
    severity: float
    affected_products: List[str]
    market_impact: str
    sentiment: str
    timestamp: datetime
    source: str

class NewsProcessor:
    """Advanced news processing and market impact analysis"""
    
    def __init__(self, db_client):
        self.db_client = db_client
        self.keywords = {
            "agriculture": ["crop", "harvest", "drought", "flood", "pest", "fertilizer"],
            "trade": ["tariff", "import", "export", "trade_war", "sanction", "agreement"],
            "currency": ["rupee", "dollar", "euro", "exchange_rate", "devaluation"],
            "logistics": ["shipping", "port", "container", "freight", "transport"],
            "regulatory": ["regulation", "certification", "standard", "compliance"],
            "weather": ["monsoon", "temperature", "climate", "weather_pattern"]
        }
        self.products = ["saffron", "cardamom", "turmeric", "pepper", "ginger"]
        self.sentiment_words = {
            "positive": ["increase", "growth", "surge", "boost", "recovery", "profit"],
            "negative": ["decrease", "decline", "drop", "fall", "crisis", "loss"],
            "neutral": ["stable", "maintain", "steady", "unchanged"]
        }
    
    async def process_latest_news(self) -> List[Dict[str, Any]]:
        """Process latest news articles for market impact"""
        try:
            # Simulate fetching news articles
            news_articles = await self._fetch_news_articles()
            
            impacts = []
            for article in news_articles:
                impact = await self._analyze_news_impact(article)
                if impact and impact.severity > 0.3:  # Only significant impacts
                    impacts.append(self._impact_to_dict(impact))
            
            # Store impacts in database
            if impacts:
                await self._store_news_impacts(impacts)
            
            return impacts
            
        except Exception as e:
            logging.error(f"News processing error: {str(e)}")
            return []
    
    async def get_market_sentiment(self, product_id: str) -> Dict[str, Any]:
        """Get market sentiment for a specific product"""
        try:
            # Get recent news impacts for the product
            recent_impacts = await self._get_recent_impacts(product_id, days=7)
            
            if not recent_impacts:
                return {
                    "sentiment": "neutral",
                    "confidence": 0.5,
                    "trend": "stable",
                    "factors": ["insufficient_data"]
                }
            
            # Calculate sentiment score
            positive_count = sum(1 for impact in recent_impacts if impact.get("sentiment") == "positive")
            negative_count = sum(1 for impact in recent_impacts if impact.get("sentiment") == "negative")
            total_count = len(recent_impacts)
            
            if total_count == 0:
                sentiment = "neutral"
                confidence = 0.5
            else:
                positive_ratio = positive_count / total_count
                negative_ratio = negative_count / total_count
                
                if positive_ratio > negative_ratio + 0.2:
                    sentiment = "positive"
                    confidence = positive_ratio
                elif negative_ratio > positive_ratio + 0.2:
                    sentiment = "negative"
                    confidence = negative_ratio
                else:
                    sentiment = "neutral"
                    confidence = 0.5
            
            # Determine trend
            trend = self._calculate_sentiment_trend(recent_impacts)
            
            # Identify key factors
            factors = self._identify_sentiment_factors(recent_impacts)
            
            return {
                "sentiment": sentiment,
                "confidence": round(confidence, 3),
                "trend": trend,
                "factors": factors,
                "recent_impacts": len(recent_impacts),
                "last_updated": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logging.error(f"Sentiment analysis error: {str(e)}")
            return {
                "sentiment": "neutral",
                "confidence": 0.5,
                "trend": "stable",
                "factors": ["analysis_error"]
            }
    
    async def get_news_alerts(self, product_id: str = None) -> List[Dict[str, Any]]:
        """Get recent news alerts"""
        try:
            # Get recent high-impact news
            recent_news = await self._get_recent_high_impact_news(product_id)
            
            alerts = []
            for news in recent_news:
                alert = {
                    "headline": news.get("headline", ""),
                    "summary": news.get("summary", ""),
                    "severity": news.get("severity", 0),
                    "sentiment": news.get("sentiment", "neutral"),
                    "affected_products": news.get("affected_products", []),
                    "timestamp": news.get("timestamp", ""),
                    "alert_level": self._get_alert_level(news.get("severity", 0))
                }
                alerts.append(alert)
            
            return alerts
            
        except Exception as e:
            logging.error(f"News alerts error: {str(e)}")
            return []
    
    async def _fetch_news_articles(self) -> List[Dict[str, Any]]:
        """Fetch news articles (simulated for now)"""
        # Simulate news articles
        articles = [
            {
                "headline": "India's Spice Exports Surge 25% in Q3",
                "content": "India's spice exports have increased by 25% in the third quarter, driven by strong demand from US and EU markets. Saffron and cardamom exports lead the growth.",
                "source": "Economic Times",
                "timestamp": datetime.utcnow() - timedelta(hours=2),
                "url": "https://example.com/news1"
            },
            {
                "headline": "Monsoon Rains Boost Agricultural Production",
                "content": "Above-average monsoon rains have significantly improved agricultural production across major spice-growing regions. This is expected to stabilize prices.",
                "source": "Business Standard",
                "timestamp": datetime.utcnow() - timedelta(hours=4),
                "url": "https://example.com/news2"
            },
            {
                "headline": "New Export Regulations Impact Spice Trade",
                "content": "New certification requirements for spice exports to EU markets may temporarily disrupt trade flows and increase compliance costs.",
                "source": "Financial Express",
                "timestamp": datetime.utcnow() - timedelta(hours=6),
                "url": "https://example.com/news3"
            },
            {
                "headline": "Rupee Depreciation Benefits Exporters",
                "content": "Recent rupee depreciation against major currencies is making Indian exports more competitive in international markets.",
                "source": "Mint",
                "timestamp": datetime.utcnow() - timedelta(hours=8),
                "url": "https://example.com/news4"
            },
            {
                "headline": "Shipping Container Shortage Affects Export Costs",
                "content": "Global container shortage is leading to increased shipping costs and delays, impacting export profitability across sectors.",
                "source": "Economic Times",
                "timestamp": datetime.utcnow() - timedelta(hours=10),
                "url": "https://example.com/news5"
            }
        ]
        
        return articles
    
    async def _analyze_news_impact(self, article: Dict[str, Any]) -> Optional[NewsImpact]:
        """Analyze the market impact of a news article"""
        try:
            headline = article.get("headline", "")
            content = article.get("content", "")
            source = article.get("source", "")
            timestamp = article.get("timestamp", datetime.utcnow())
            
            # Analyze sentiment
            sentiment = self._analyze_sentiment(headline + " " + content)
            
            # Identify affected products
            affected_products = self._identify_affected_products(headline + " " + content)
            
            # Calculate severity
            severity = self._calculate_severity(headline, content, sentiment)
            
            # Generate summary
            summary = self._generate_news_summary(headline, content)
            
            # Determine market impact
            market_impact = self._determine_market_impact(severity, sentiment, affected_products)
            
            # Only return significant impacts
            if severity > 0.3 or len(affected_products) > 0:
                return NewsImpact(
                    headline=headline,
                    summary=summary,
                    severity=severity,
                    affected_products=affected_products,
                    market_impact=market_impact,
                    sentiment=sentiment,
                    timestamp=timestamp,
                    source=source
                )
            
            return None
            
        except Exception as e:
            logging.error(f"News impact analysis error: {str(e)}")
            return None
    
    def _analyze_sentiment(self, text: str) -> str:
        """Analyze sentiment of text"""
        text_lower = text.lower()
        
        positive_count = sum(1 for word in self.sentiment_words["positive"] if word in text_lower)
        negative_count = sum(1 for word in self.sentiment_words["negative"] if word in text_lower)
        
        if positive_count > negative_count:
            return "positive"
        elif negative_count > positive_count:
            return "negative"
        else:
            return "neutral"
    
    def _identify_affected_products(self, text: str) -> List[str]:
        """Identify products mentioned in the text"""
        text_lower = text.lower()
        affected = []
        
        for product in self.products:
            if product in text_lower:
                affected.append(product)
        
        return affected
    
    def _calculate_severity(self, headline: str, content: str, sentiment: str) -> float:
        """Calculate the severity of news impact"""
        severity = 0.0
        
        # Base severity from keywords
        text = (headline + " " + content).lower()
        
        # Check for high-impact keywords
        high_impact_keywords = ["crisis", "surge", "crash", "emergency", "ban", "sanction"]
        for keyword in high_impact_keywords:
            if keyword in text:
                severity += 0.3
        
        # Check for medium-impact keywords
        medium_impact_keywords = ["increase", "decrease", "change", "regulation", "policy"]
        for keyword in medium_impact_keywords:
            if keyword in text:
                severity += 0.15
        
        # Sentiment adjustment
        if sentiment == "positive":
            severity *= 0.8  # Positive news has less severe impact
        elif sentiment == "negative":
            severity *= 1.2  # Negative news has more severe impact
        
        # Source credibility
        credible_sources = ["Economic Times", "Business Standard", "Financial Express"]
        if any(source in headline for source in credible_sources):
            severity *= 1.1
        
        return min(1.0, max(0.0, severity))
    
    def _generate_news_summary(self, headline: str, content: str) -> str:
        """Generate a summary of the news"""
        # Simple summary generation
        if len(content) > 200:
            return content[:200] + "..."
        return content
    
    def _determine_market_impact(self, severity: float, sentiment: str, products: List[str]) -> str:
        """Determine the type of market impact"""
        if severity > 0.7:
            return "high_impact"
        elif severity > 0.4:
            return "medium_impact"
        else:
            return "low_impact"
    
    def _impact_to_dict(self, impact: NewsImpact) -> Dict[str, Any]:
        """Convert NewsImpact to dictionary"""
        return {
            "headline": impact.headline,
            "summary": impact.summary,
            "severity": impact.severity,
            "affected_products": impact.affected_products,
            "market_impact": impact.market_impact,
            "sentiment": impact.sentiment,
            "timestamp": impact.timestamp.isoformat(),
            "source": impact.source
        }
    
    async def _store_news_impacts(self, impacts: List[Dict[str, Any]]) -> None:
        """Store news impacts in database"""
        try:
            for impact in impacts:
                await self.db_client.store_news_impact(impact)
        except Exception as e:
            logging.error(f"Error storing news impacts: {str(e)}")
    
    async def _get_recent_impacts(self, product_id: str, days: int = 7) -> List[Dict[str, Any]]:
        """Get recent news impacts for a product"""
        try:
            # This would typically query the database
            # For now, return simulated data
            return [
                {
                    "sentiment": "positive",
                    "severity": 0.6,
                    "timestamp": datetime.utcnow() - timedelta(days=1)
                },
                {
                    "sentiment": "neutral",
                    "severity": 0.3,
                    "timestamp": datetime.utcnow() - timedelta(days=3)
                }
            ]
        except Exception as e:
            logging.error(f"Error getting recent impacts: {str(e)}")
            return []
    
    def _calculate_sentiment_trend(self, impacts: List[Dict[str, Any]]) -> str:
        """Calculate sentiment trend from recent impacts"""
        if not impacts:
            return "stable"
        
        positive_count = sum(1 for impact in impacts if impact.get("sentiment") == "positive")
        negative_count = sum(1 for impact in impacts if impact.get("sentiment") == "negative")
        
        if positive_count > negative_count:
            return "improving"
        elif negative_count > positive_count:
            return "declining"
        else:
            return "stable"
    
    def _identify_sentiment_factors(self, impacts: List[Dict[str, Any]]) -> List[str]:
        """Identify factors contributing to sentiment"""
        factors = []
        
        for impact in impacts:
            if impact.get("severity", 0) > 0.5:
                factors.append("high_impact_news")
            if impact.get("sentiment") == "positive":
                factors.append("positive_developments")
            elif impact.get("sentiment") == "negative":
                factors.append("negative_developments")
        
        return list(set(factors)) if factors else ["stable_conditions"]
    
    async def _get_recent_high_impact_news(self, product_id: str = None) -> List[Dict[str, Any]]:
        """Get recent high-impact news"""
        try:
            # This would typically query the database
            # For now, return simulated data
            return [
                {
                    "headline": "Spice Exports Surge 25%",
                    "summary": "Strong demand drives export growth",
                    "severity": 0.7,
                    "sentiment": "positive",
                    "affected_products": ["saffron", "cardamom"],
                    "timestamp": datetime.utcnow() - timedelta(hours=2)
                }
            ]
        except Exception as e:
            logging.error(f"Error getting high impact news: {str(e)}")
            return []
    
    def _get_alert_level(self, severity: float) -> str:
        """Get alert level based on severity"""
        if severity > 0.7:
            return "high"
        elif severity > 0.4:
            return "medium"
        else:
            return "low" 