import express from 'express';
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  updateOrderStatus,
  updateItemStatus,
  addShipment,
  updateShipment,
  deleteShipment,
  getOrderStats,
  deleteOrder,
  bulkUpdateOrderStatus
} from '../controllers/order.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/roleCheck';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

// Get all orders (with filtering and pagination)
router.get('/', authorize(['admin', 'manager']), getOrders);

// Get order statistics
router.get('/stats', authorize(['admin', 'manager']), getOrderStats);

// Get order by ID
router.get('/:id', authorize(['admin', 'manager']), getOrderById);

// Create new order
router.post('/', authorize(['admin', 'manager']), createOrder);

// Update order
router.put('/:id', authorize(['admin', 'manager']), updateOrder);

// Update order status
router.patch('/:id/status', authorize(['admin', 'manager']), updateOrderStatus);

// Update item status
router.patch('/:id/items/:itemId/status', authorize(['admin', 'manager']), updateItemStatus);

// Add shipment to order
router.post('/:id/shipments', authorize(['admin', 'manager']), addShipment);

// Update shipment
router.put('/:id/shipments/:shipmentId', authorize(['admin', 'manager']), updateShipment);

// Delete shipment
router.delete('/:id/shipments/:shipmentId', authorize(['admin', 'manager']), deleteShipment);

// Bulk update order status
router.patch('/bulk/status', authorize(['admin', 'manager']), bulkUpdateOrderStatus);

// Delete order
router.delete('/:id', authorize(['admin']), deleteOrder);

export default router; 