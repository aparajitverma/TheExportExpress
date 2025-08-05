import json
import logging
from typing import Dict, Any, List
from datetime import datetime


class WebSocketManager:
    """Manages WebSocket connections for real-time updates"""
    
    def __init__(self):
        self.connections: List[Dict[str, Any]] = []
        self.logger = logging.getLogger(__name__)
    
    async def add_connection(self, websocket, client_id: str):
        """Add a new WebSocket connection"""
        connection = {
            "websocket": websocket,
            "client_id": client_id,
            "connected_at": datetime.utcnow(),
            "subscriptions": []
        }
        self.connections.append(connection)
        self.logger.info(f"New WebSocket connection: {client_id}")
    
    async def remove_connection(self, client_id: str):
        """Remove a WebSocket connection"""
        self.connections = [
            conn for conn in self.connections 
            if conn["client_id"] != client_id
        ]
        self.logger.info(f"Removed WebSocket connection: {client_id}")
    
    async def broadcast(self, message: Dict[str, Any]):
        """Broadcast message to all connected clients"""
        if not self.connections:
            return
        
        message_json = json.dumps(message)
        disconnected = []
        
        for connection in self.connections:
            try:
                await connection["websocket"].send_text(message_json)
            except Exception as e:
                self.logger.error(
                    f"Error sending to {connection['client_id']}: {str(e)}"
                )
                disconnected.append(connection["client_id"])
        
        # Remove disconnected clients
        for client_id in disconnected:
            await self.remove_connection(client_id)
    
    async def send_to_client(self, client_id: str, message: Dict[str, Any]):
        """Send message to specific client"""
        message_json = json.dumps(message)
        
        for connection in self.connections:
            if connection["client_id"] == client_id:
                try:
                    await connection["websocket"].send_text(message_json)
                    return
                except Exception as e:
                    self.logger.error(
                        f"Error sending to {client_id}: {str(e)}"
                    )
                    await self.remove_connection(client_id)
                    return
        
        self.logger.warning(f"Client {client_id} not found")
    
    async def subscribe_client(self, client_id: str, channel: str):
        """Subscribe client to a channel"""
        for connection in self.connections:
            if connection["client_id"] == client_id:
                if channel not in connection["subscriptions"]:
                    connection["subscriptions"].append(channel)
                    self.logger.info(
                        f"Client {client_id} subscribed to {channel}"
                    )
                return
        
        self.logger.warning(f"Client {client_id} not found for subscription")
    
    async def unsubscribe_client(self, client_id: str, channel: str):
        """Unsubscribe client from a channel"""
        for connection in self.connections:
            if connection["client_id"] == client_id:
                if channel in connection["subscriptions"]:
                    connection["subscriptions"].remove(channel)
                    self.logger.info(
                        f"Client {client_id} unsubscribed from {channel}"
                    )
                return
    
    async def broadcast_to_channel(self, channel: str, message: Dict[str, Any]):
        """Broadcast message to clients subscribed to a channel"""
        message_json = json.dumps(message)
        disconnected = []
        
        for connection in self.connections:
            if channel in connection["subscriptions"]:
                try:
                    await connection["websocket"].send_text(message_json)
                except Exception as e:
                    self.logger.error(
                        f"Error sending to {connection['client_id']}: {str(e)}"
                    )
                    disconnected.append(connection["client_id"])
        
        # Remove disconnected clients
        for client_id in disconnected:
            await self.remove_connection(client_id)
    
    def get_connection_count(self) -> int:
        """Get number of active connections"""
        return len(self.connections)
    
    def get_connection_info(self) -> List[Dict[str, Any]]:
        """Get information about all connections"""
        return [
            {
                "client_id": conn["client_id"],
                "connected_at": conn["connected_at"],
                "subscriptions": conn["subscriptions"]
            }
            for conn in self.connections
        ] 