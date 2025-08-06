import express from 'express';
import authRoutes from './auth.routes';
import adminRoutes from './admin.routes';
import productRoutes from './product.routes';
import categoryRoutes from './category.routes';
import inquiryRoutes from './inquiry.routes';
import uploadRoutes from './upload.routes';
import bulkRoutes from './bulk.routes';
import vendorRoutes from './vendor.routes';
import orderRoutes from './order.routes';
import paymentRoutes from './payment.routes';
import shipmentRoutes from './shipment.routes';

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// API routes
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/inquiries', inquiryRoutes);
router.use('/uploads', uploadRoutes);
router.use('/bulk', bulkRoutes);
router.use('/vendors', vendorRoutes);
router.use('/orders', orderRoutes);
router.use('/payments', paymentRoutes);
router.use('/shipments', shipmentRoutes);

export default router; 