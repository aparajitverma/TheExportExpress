import express from 'express';
import {
  createPaymentFlow,
  getPayments,
  getPaymentById,
  updatePaymentStatus,
  processRefund,
  releaseEscrow,
  getPaymentAnalytics,
  bulkProcessPayments
} from '../controllers/payment.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/roleCheck';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

// Get all payments (with filtering and pagination)
router.get('/', authorize(['admin', 'manager']), getPayments);

// Get payment analytics
router.get('/analytics', authorize(['admin', 'manager']), getPaymentAnalytics);

// Get payment by ID
router.get('/:id', authorize(['admin', 'manager']), getPaymentById);

// Create payment flow for an order
router.post('/orders/:orderId/flow', authorize(['admin', 'manager']), createPaymentFlow);

// Update payment status
router.patch('/:id/status', authorize(['admin', 'manager']), updatePaymentStatus);

// Process refund
router.post('/:id/refund', authorize(['admin', 'manager']), processRefund);

// Release escrow
router.post('/:id/escrow/release', authorize(['admin', 'manager']), releaseEscrow);

// Bulk process payments
router.patch('/bulk/process', authorize(['admin', 'manager']), bulkProcessPayments);

export default router;