import redis.asyncio as redis
from typing import Any, Optional, Dict, List
import json
import logging


class RedisClient:
    """Async Redis client for AI engine caching"""
    
    def __init__(self, connection_string: str = "redis://localhost:6379"):
        self.connection_string = connection_string
        self.client = None
        
    async def connect(self):
        """Connect to Redis"""
        try:
            self.client = redis.from_url(self.connection_string)
            await self.client.ping()
            logging.info("Connected to Redis successfully")
        except Exception as e:
            logging.error(f"Failed to connect to Redis: {str(e)}")
            raise
    
    async def disconnect(self):
        """Disconnect from Redis"""
        if self.client:
            await self.client.close()
            logging.info("Disconnected from Redis")
    
    async def get(self, key: str) -> Optional[Any]:
        """Get value from Redis"""
        try:
            value = await self.client.get(key)
            if value:
                return json.loads(value)
            return None
        except Exception as e:
            logging.error(f"Error getting key {key}: {str(e)}")
            return None
    
    async def set(self, key: str, value: Any, expire: Optional[int] = None):
        """Set value in Redis with optional expiration"""
        try:
            serialized_value = json.dumps(value)
            await self.client.set(key, serialized_value, ex=expire)
        except Exception as e:
            logging.error(f"Error setting key {key}: {str(e)}")
            raise
    
    async def delete(self, key: str):
        """Delete key from Redis"""
        try:
            await self.client.delete(key)
        except Exception as e:
            logging.error(f"Error deleting key {key}: {str(e)}")
    
    async def exists(self, key: str) -> bool:
        """Check if key exists"""
        try:
            return await self.client.exists(key) > 0
        except Exception as e:
            logging.error(f"Error checking key {key}: {str(e)}")
            return False
    
    async def set_cache_prediction(
        self, product_id: str, prediction: Dict[str, Any]
    ):
        """Cache prediction for a product"""
        key = f"prediction:{product_id}"
        await self.set(key, prediction, expire=3600)  # 1 hour
    
    async def get_cache_prediction(
        self, product_id: str
    ) -> Optional[Dict[str, Any]]:
        """Get cached prediction for a product"""
        key = f"prediction:{product_id}"
        return await self.get(key)
    
    async def set_opportunities_cache(
        self, opportunities: List[Dict[str, Any]]
    ):
        """Cache current opportunities"""
        await self.set("current_opportunities", opportunities, expire=300)
    
    async def get_opportunities_cache(
        self
    ) -> Optional[List[Dict[str, Any]]]:
        """Get cached opportunities"""
        return await self.get("current_opportunities")
    
    async def publish_update(self, channel: str, message: Dict[str, Any]):
        """Publish message to Redis channel"""
        try:
            serialized_message = json.dumps(message)
            await self.client.publish(channel, serialized_message)
        except Exception as e:
            logging.error(
                f"Error publishing to channel {channel}: {str(e)}"
            )
    
    async def get_market_trends(
        self, product_id: str
    ) -> Optional[Dict[str, Any]]:
        """Get cached market trends"""
        key = f"trends:{product_id}"
        return await self.get(key)
    
    async def set_market_trends(
        self, product_id: str, trends: Dict[str, Any]
    ):
        """Cache market trends"""
        key = f"trends:{product_id}"
        await self.set(key, trends, expire=1800)  # 30 minutes 