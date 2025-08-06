import express from 'express';
import {
  createShipment,
  getShipments,
  getShipmentById,
  updateShipmentTracking,
  uploadShipmentDocument,
  verifyShipmentDocument,
  getShipmentAnalytics,
  getLiveTracking
} from '../controllers/shipment.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/roleCheck';

const router = express.Router();

// Public route for live tracking (no authentication required)
router.get('/track/:shipmentId', getLiveTracking);

// Apply authentication to all other routes
router.use(authenticate);

// Get all shipments (with filtering and pagination)
router.get('/', authorize(['admin', 'manager']), getShipments);

// Get shipment analytics
router.get('/analytics', authorize(['admin', 'manager']), getShipmentAnalytics);

// Get shipment by ID
router.get('/:id', authorize(['admin', 'manager']), getShipmentById);

// Create shipment from order
router.post('/orders/:orderId', authorize(['admin', 'manager']), createShipment);

// Update shipment tracking
router.post('/:id/tracking', authorize(['admin', 'manager']), updateShipmentTracking);

// Upload shipment document
router.post('/:id/documents', authorize(['admin', 'manager']), uploadShipmentDocument);

// Verify shipment document
router.patch('/:id/documents/:documentId/verify', authorize(['admin', 'manager']), verifyShipmentDocument);

export default router;