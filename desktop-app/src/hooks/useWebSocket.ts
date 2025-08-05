import { useEffect, useState } from 'react';
import { useAppStore } from '../stores/appStore';
import { toast } from 'react-hot-toast';
import io, { Socket } from 'socket.io-client';

export const useWebSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  
  const { 
    updateProducts, 
    updateOrders, 
    updatePredictions,
    setOnlineStatus 
  } = useAppStore();

  useEffect(() => {
    // Connect to WebSocket server
    const socketConnection = io('http://localhost:3001', {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketConnection.on('connect', () => {
      console.log('Connected to WebSocket server');
      setIsConnected(true);
      setOnlineStatus(true);
      toast.success('Real-time connection established');
    });

    socketConnection.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
      setIsConnected(false);
      setOnlineStatus(false);
      toast.error('Real-time connection lost');
    });

    // Handle real-time updates
    socketConnection.on('price_update', (data) => {
      console.log('Price update received:', data);
      // Update local store
      updateProducts(data.products);
      
      toast.success(
        `Price updated: ${data.product_name} → ₹${data.new_price}`,
        { icon: '💰' }
      );
    });

    socketConnection.on('arbitrage_opportunity', (data) => {
      console.log('Arbitrage opportunity:', data);
      updatePredictions([data]);
      
      toast.success(
        `🚀 Arbitrage Opportunity: ${data.product_name} - Profit: ₹${data.profit_potential}`,
        { duration: 10000 }
      );
    });

    socketConnection.on('order_status_update', (data) => {
      console.log('Order status update:', data);
      updateOrders(data.orders);
      
      toast.info(
        `Order ${data.order_number}: ${data.new_status}`,
        { icon: '📦' }
      );
    });

    socketConnection.on('market_alert', (data) => {
      console.log('Market alert:', data);
      
      toast.warning(
        `Market Alert: ${data.message}`,
        { duration: 8000, icon: '⚠️' }
      );
    });

    setSocket(socketConnection);

    return () => {
      socketConnection.disconnect();
    };
  }, [updateProducts, updateOrders, updatePredictions, setOnlineStatus]);

  const emitMessage = (event: string, data: any) => {
    if (socket && isConnected) {
      socket.emit(event, data);
    } else {
      toast.error('Not connected to server');
    }
  };

  return {
    socket,
    isConnected,
    emitMessage,
  };
}; 