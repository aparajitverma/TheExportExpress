import asyncio
import logging
import json
from typing import Any, Optional, Dict, List
import aioredis
from datetime import timedelta

class RedisClient:
    """Redis client for caching and real-time data"""
    
    def __init__(self):
        self.redis_pool = None
        self.connection_string = "redis://localhost:6379"
        self.db_index = 0
        
    async def connect(self):
        """Connect to Redis"""
        try:
            self.redis_pool = aioredis.ConnectionPool.from_url(
                self.connection_string,
                db=self.db_index,
                encoding="utf-8",
                decode_responses=True
            )
            
            # Test the connection
            redis = aioredis.Redis(connection_pool=self.redis_pool)
            await redis.ping()
            await redis.close()
            
            logging.info("Successfully connected to Redis")
            
        except Exception as e:
            logging.error(f"Failed to connect to Redis: {e}")
            # Create a mock Redis client for development
            self.redis_pool = MockRedisPool()
            logging.warning("Using mock Redis client for development")
    
    async def disconnect(self):
        """Disconnect from Redis"""
        if self.redis_pool and hasattr(self.redis_pool, 'disconnect'):
            await self.redis_pool.disconnect()
            logging.info("Disconnected from Redis")
    
    async def get(self, key: str) -> Optional[Any]:
        """Get value from Redis"""
        try:
            if isinstance(self.redis_pool, MockRedisPool):
                return await self.redis_pool.get(key)
            
            redis = aioredis.Redis(connection_pool=self.redis_pool)
            value = await redis.get(key)
            await redis.close()
            
            if value:
                try:
                    return json.loads(value)
                except json.JSONDecodeError:
                    return value
            return None
            
        except Exception as e:
            logging.error(f"Error getting value from Redis: {e}")
            return None
    
    async def set(self, key: str, value: Any, expire: Optional[int] = None) -> bool:
        """Set value in Redis"""
        try:
            if isinstance(self.redis_pool, MockRedisPool):
                return await self.redis_pool.set(key, value, expire)
            
            redis = aioredis.Redis(connection_pool=self.redis_pool)
            
            # Serialize value if it's not a string
            if not isinstance(value, str):
                value = json.dumps(value, default=str)
            
            if expire:
                result = await redis.setex(key, expire, value)
            else:
                result = await redis.set(key, value)
            
            await redis.close()
            return bool(result)
            
        except Exception as e:
            logging.error(f"Error setting value in Redis: {e}")
            return False
    
    async def delete(self, key: str) -> bool:
        """Delete key from Redis"""
        try:
            if isinstance(self.redis_pool, MockRedisPool):
                return await self.redis_pool.delete(key)
            
            redis = aioredis.Redis(connection_pool=self.redis_pool)
            result = await redis.delete(key)
            await redis.close()
            return bool(result)
            
        except Exception as e:
            logging.error(f"Error deleting key from Redis: {e}")
            return False
    
    async def exists(self, key: str) -> bool:
        """Check if key exists in Redis"""
        try:
            if isinstance(self.redis_pool, MockRedisPool):
                return await self.redis_pool.exists(key)
            
            redis = aioredis.Redis(connection_pool=self.redis_pool)
            result = await redis.exists(key)
            await redis.close()
            return bool(result)
            
        except Exception as e:
            logging.error(f"Error checking key existence in Redis: {e}")
            return False
    
    async def keys(self, pattern: str = "*") -> List[str]:
        """Get keys matching pattern"""
        try:
            if isinstance(self.redis_pool, MockRedisPool):
                return await self.redis_pool.keys(pattern)
            
            redis = aioredis.Redis(connection_pool=self.redis_pool)
            keys = await redis.keys(pattern)
            await redis.close()
            return keys
            
        except Exception as e:
            logging.error(f"Error getting keys from Redis: {e}")
            return []
    
    async def increment(self, key: str, amount: int = 1) -> int:
        """Increment value in Redis"""
        try:
            if isinstance(self.redis_pool, MockRedisPool):
                return await self.redis_pool.increment(key, amount)
            
            redis = aioredis.Redis(connection_pool=self.redis_pool)
            result = await redis.incrby(key, amount)
            await redis.close()
            return result
            
        except Exception as e:
            logging.error(f"Error incrementing value in Redis: {e}")
            return 0
    
    async def expire(self, key: str, seconds: int) -> bool:
        """Set expiration time for key"""
        try:
            if isinstance(self.redis_pool, MockRedisPool):
                return await self.redis_pool.expire(key, seconds)
            
            redis = aioredis.Redis(connection_pool=self.redis_pool)
            result = await redis.expire(key, seconds)
            await redis.close()
            return bool(result)
            
        except Exception as e:
            logging.error(f"Error setting expiration in Redis: {e}")
            return False
    
    async def hash_set(self, name: str, mapping: Dict[str, Any]) -> bool:
        """Set hash field values"""
        try:
            if isinstance(self.redis_pool, MockRedisPool):
                return await self.redis_pool.hash_set(name, mapping)
            
            redis = aioredis.Redis(connection_pool=self.redis_pool)
            
            # Serialize values
            serialized_mapping = {}
            for key, value in mapping.items():
                if not isinstance(value, str):
                    serialized_mapping[key] = json.dumps(value, default=str)
                else:
                    serialized_mapping[key] = value
            
            result = await redis.hset(name, mapping=serialized_mapping)
            await redis.close()
            return bool(result)
            
        except Exception as e:
            logging.error(f"Error setting hash in Redis: {e}")
            return False
    
    async def hash_get(self, name: str, key: str) -> Optional[Any]:
        """Get hash field value"""
        try:
            if isinstance(self.redis_pool, MockRedisPool):
                return await self.redis_pool.hash_get(name, key)
            
            redis = aioredis.Redis(connection_pool=self.redis_pool)
            value = await redis.hget(name, key)
            await redis.close()
            
            if value:
                try:
                    return json.loads(value)
                except json.JSONDecodeError:
                    return value
            return None
            
        except Exception as e:
            logging.error(f"Error getting hash value from Redis: {e}")
            return None
    
    async def hash_get_all(self, name: str) -> Dict[str, Any]:
        """Get all hash field values"""
        try:
            if isinstance(self.redis_pool, MockRedisPool):
                return await self.redis_pool.hash_get_all(name)
            
            redis = aioredis.Redis(connection_pool=self.redis_pool)
            values = await redis.hgetall(name)
            await redis.close()
            
            # Deserialize values
            result = {}
            for key, value in values.items():
                try:
                    result[key] = json.loads(value)
                except json.JSONDecodeError:
                    result[key] = value
            
            return result
            
        except Exception as e:
            logging.error(f"Error getting all hash values from Redis: {e}")
            return {}


class MockRedisPool:
    """Mock Redis pool for development/testing"""
    
    def __init__(self):
        self.data = {}
        self.expirations = {}
    
    async def get(self, key: str) -> Optional[Any]:
        """Mock get operation"""
        if key in self.data:
            return self.data[key]
        return None
    
    async def set(self, key: str, value: Any, expire: Optional[int] = None) -> bool:
        """Mock set operation"""
        self.data[key] = value
        if expire:
            # In a real implementation, you'd handle expiration
            pass
        return True
    
    async def delete(self, key: str) -> bool:
        """Mock delete operation"""
        if key in self.data:
            del self.data[key]
            return True
        return False
    
    async def exists(self, key: str) -> bool:
        """Mock exists operation"""
        return key in self.data
    
    async def keys(self, pattern: str = "*") -> List[str]:
        """Mock keys operation"""
        if pattern == "*":
            return list(self.data.keys())
        # Simple pattern matching (not full regex support)
        import fnmatch
        return [key for key in self.data.keys() if fnmatch.fnmatch(key, pattern)]
    
    async def increment(self, key: str, amount: int = 1) -> int:
        """Mock increment operation"""
        current_value = self.data.get(key, 0)
        if isinstance(current_value, (int, float)):
            new_value = current_value + amount
        else:
            new_value = amount
        self.data[key] = new_value
        return new_value
    
    async def expire(self, key: str, seconds: int) -> bool:
        """Mock expire operation"""
        # Simplified - doesn't actually expire keys
        return key in self.data
    
    async def hash_set(self, name: str, mapping: Dict[str, Any]) -> bool:
        """Mock hash set operation"""
        if name not in self.data:
            self.data[name] = {}
        self.data[name].update(mapping)
        return True
    
    async def hash_get(self, name: str, key: str) -> Optional[Any]:
        """Mock hash get operation"""
        if name in self.data and isinstance(self.data[name], dict):
            return self.data[name].get(key)
        return None
    
    async def hash_get_all(self, name: str) -> Dict[str, Any]:
        """Mock hash get all operation"""
        if name in self.data and isinstance(self.data[name], dict):
            return self.data[name].copy()
        return {}