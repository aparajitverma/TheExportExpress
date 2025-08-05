import asyncio
import logging
from typing import List, Dict, Any, Optional
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError

class MongoDBClient:
    def __init__(self):
        self.client: Optional[AsyncIOMotorClient] = None
        self.db = None
        self.connection_string = "mongodb://localhost:27017"
        self.database_name = "exportexpresspro"

    async def connect(self):
        """Connect to MongoDB"""
        try:
            self.client = AsyncIOMotorClient(self.connection_string)
            self.db = self.client[self.database_name]
            
            # Test the connection
            await self.client.admin.command('ping')
            logging.info("Successfully connected to MongoDB")
        except (ConnectionFailure, ServerSelectionTimeoutError) as e:
            logging.error(f"Failed to connect to MongoDB: {e}")
            raise

    async def disconnect(self):
        """Disconnect from MongoDB"""
        if self.client:
            self.client.close()
            logging.info("Disconnected from MongoDB")

    async def get_all_products(self) -> List[Dict[str, Any]]:
        """Get all products from the database"""
        try:
            if not self.db:
                logging.warning("Database not connected, returning empty list")
                return []
            
            cursor = self.db.products.find({})
            products = await cursor.to_list(length=None)
            logging.info(f"Retrieved {len(products)} products from database")
            return products
        except Exception as e:
            logging.error(f"Error getting products: {e}")
            return []

    async def store_news_impact(self, news_impact: Dict[str, Any]) -> bool:
        """Store news impact in the database"""
        try:
            if not self.db:
                logging.warning("Database not connected, cannot store news impact")
                return False
            
            result = await self.db.news_impacts.insert_one(news_impact)
            logging.info(f"Stored news impact with ID: {result.inserted_id}")
            return True
        except Exception as e:
            logging.error(f"Error storing news impact: {e}")
            return False

    async def get_products_by_category(self, category: str) -> List[Dict[str, Any]]:
        """Get products by category"""
        try:
            if not self.db:
                return []
            
            cursor = self.db.products.find({"category": category})
            products = await cursor.to_list(length=None)
            return products
        except Exception as e:
            logging.error(f"Error getting products by category: {e}")
            return []

    async def get_product_by_id(self, product_id: str) -> Optional[Dict[str, Any]]:
        """Get a single product by ID"""
        try:
            if not self.db:
                return None
            
            product = await self.db.products.find_one({"_id": product_id})
            return product
        except Exception as e:
            logging.error(f"Error getting product by ID: {e}")
            return None

    async def update_product(self, product_id: str, update_data: Dict[str, Any]) -> bool:
        """Update a product"""
        try:
            if not self.db:
                return False
            
            result = await self.db.products.update_one(
                {"_id": product_id}, 
                {"$set": update_data}
            )
            return result.modified_count > 0
        except Exception as e:
            logging.error(f"Error updating product: {e}")
            return False

    async def get_market_data(self, product_id: str) -> List[Dict[str, Any]]:
        """Get market data for a product"""
        try:
            if not self.db:
                return []
            
            cursor = self.db.market_data.find({"product_id": product_id})
            market_data = await cursor.to_list(length=None)
            return market_data
        except Exception as e:
            logging.error(f"Error getting market data: {e}")
            return []

    async def store_market_data(self, market_data: Dict[str, Any]) -> bool:
        """Store market data"""
        try:
            if not self.db:
                return False
            
            result = await self.db.market_data.insert_one(market_data)
            return True
        except Exception as e:
            logging.error(f"Error storing market data: {e}")
            return False

    async def get_orders(self, status: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get orders with optional status filter"""
        try:
            if not self.db:
                return []
            
            filter_query = {}
            if status:
                filter_query["status"] = status
            
            cursor = self.db.orders.find(filter_query)
            orders = await cursor.to_list(length=None)
            return orders
        except Exception as e:
            logging.error(f"Error getting orders: {e}")
            return []

    async def get_suppliers(self, country: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get suppliers with optional country filter"""
        try:
            if not self.db:
                return []
            
            filter_query = {}
            if country:
                filter_query["country"] = country
            
            cursor = self.db.suppliers.find(filter_query)
            suppliers = await cursor.to_list(length=None)
            return suppliers
        except Exception as e:
            logging.error(f"Error getting suppliers: {e}")
            return []

    async def store_prediction(self, prediction_data: Dict[str, Any]) -> bool:
        """Store AI prediction data"""
        try:
            if not self.db:
                return False
            
            result = await self.db.predictions.insert_one(prediction_data)
            return True
        except Exception as e:
            logging.error(f"Error storing prediction: {e}")
            return False

    async def get_predictions(self, product_id: str) -> List[Dict[str, Any]]:
        """Get predictions for a product"""
        try:
            if not self.db:
                return []
            
            cursor = self.db.predictions.find({"product_id": product_id})
            predictions = await cursor.to_list(length=None)
            return predictions
        except Exception as e:
            logging.error(f"Error getting predictions: {e}")
            return []

    async def store_arbitrage_opportunity(self, opportunity: Dict[str, Any]) -> bool:
        """Store arbitrage opportunity"""
        try:
            if not self.db:
                return False
            
            result = await self.db.arbitrage_opportunities.insert_one(opportunity)
            return True
        except Exception as e:
            logging.error(f"Error storing arbitrage opportunity: {e}")
            return False

    async def get_arbitrage_opportunities(self) -> List[Dict[str, Any]]:
        """Get all arbitrage opportunities"""
        try:
            if not self.db:
                return []
            
            cursor = self.db.arbitrage_opportunities.find({})
            opportunities = await cursor.to_list(length=None)
            return opportunities
        except Exception as e:
            logging.error(f"Error getting arbitrage opportunities: {e}")
            return [] 