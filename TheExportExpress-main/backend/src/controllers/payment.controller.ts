import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Payment, { IPayment, PaymentType, PaymentStatus, PaymentMethod } from '../models/Payment';
import Order from '../models/Order';
import { ApiError, asyncHandler } from '../utils/ApiError';

// Create payment flow for an order
export const createPaymentFlow = asyncHandler(async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const { paymentMethod, escrowEnabled = false } = req.body;

  // Get the order details
  const order = await Order.findById(orderId)
    .populate('items.vendor', 'name companyName email')
    .populate('createdBy', 'name email');

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  // Calculate payment breakdown
  const platformFeeRate = 0.05; // 5% platform fee
  const processingFeeRate = 0.029; // 2.9% processing fee

  const breakdown = {
    subtotal: order.totalAmount,
    tax: order.taxAmount,
    shipping: order.shippingAmount,
    platformFee: order.totalAmount * platformFeeRate,
    vendorCommission: order.totalAmount * 0.85, // Vendor gets 85%
    shippingCompanyFee: order.shippingAmount,
    processingFee: order.finalAmount * processingFeeRate,
    discount: order.discountAmount,
    total: order.finalAmount
  };

  // Create customer to platform payment
  const customerPayment = await Payment.create({
    orderNumber: order.orderNumber,
    orderId: order._id,
    paymentType: PaymentType.CUSTOMER_TO_PLATFORM,
    paymentMethod,
    status: PaymentStatus.PENDING,
    payer: {
      type: 'customer',
      id: order.createdBy._id,
      name: order.customerName,
      email: order.customerEmail
    },
    payee: {
      type: 'platform',
      id: req.user._id,
      name: 'ExportExpress Platform',
      email: 'payments@exportexpress.com'
    },
    breakdown,
    currency: order.currency,
    escrow: {
      isEscrow: escrowEnabled,
      escrowProvider: escrowEnabled ? 'ExportExpress Escrow' : undefined,
      releaseConditions: escrowEnabled ? [
        'Order delivered successfully',
        'Customer confirmation received',
        'No disputes raised within 7 days'
      ] : undefined
    },
    description: `Payment for order ${order.orderNumber}`,
    createdBy: req.user._id,
    updatedBy: req.user._id
  });

  // Create vendor payment schedules
  const vendorPayments = [];
  for (const item of order.items) {
    const vendorPayment = await Payment.create({
      orderNumber: order.orderNumber,
      orderId: order._id,
      paymentType: PaymentType.PLATFORM_TO_VENDOR,
      paymentMethod: PaymentMethod.BANK_TRANSFER,
      status: PaymentStatus.PENDING,
      payer: {
        type: 'platform',
        id: req.user._id,
        name: 'ExportExpress Platform',
        email: 'payments@exportexpress.com'
      },
      payee: {
        type: 'vendor',
        id: item.vendor._id,
        name: item.vendor.name,
        email: item.vendor.email
      },
      breakdown: {
        subtotal: item.totalPrice,
        tax: 0,
        shipping: 0,
        platformFee: item.totalPrice * platformFeeRate,
        vendorCommission: item.totalPrice * 0.85,
        shippingCompanyFee: 0,
        processingFee: 0,
        discount: 0,
        total: item.totalPrice * 0.85
      },
      currency: order.currency,
      description: `Vendor payment for ${item.product.name} in order ${order.orderNumber}`,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      createdBy: req.user._id,
      updatedBy: req.user._id
    });
    vendorPayments.push(vendorPayment);
  }

  // Create shipping payment if applicable
  let shippingPayment = null;
  if (order.shippingAmount > 0) {
    shippingPayment = await Payment.create({
      orderNumber: order.orderNumber,
      orderId: order._id,
      paymentType: PaymentType.PLATFORM_TO_SHIPPING,
      paymentMethod: PaymentMethod.BANK_TRANSFER,
      status: PaymentStatus.PENDING,
      payer: {
        type: 'platform',
        id: req.user._id,
        name: 'ExportExpress Platform',
        email: 'payments@exportexpress.com'
      },
      payee: {
        type: 'shipping_company',
        id: new mongoose.Types.ObjectId(), // This would be actual shipping company ID
        name: 'Shipping Partner',
        email: 'billing@shippingpartner.com'
      },
      breakdown: {
        subtotal: 0,
        tax: 0,
        shipping: order.shippingAmount,
        platformFee: 0,
        vendorCommission: 0,
        shippingCompanyFee: order.shippingAmount,
        processingFee: 0,
        discount: 0,
        total: order.shippingAmount
      },
      currency: order.currency,
      description: `Shipping payment for order ${order.orderNumber}`,
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      createdBy: req.user._id,
      updatedBy: req.user._id
    });
  }

  res.status(201).json({
    success: true,
    data: {
      customerPayment,
      vendorPayments,
      shippingPayment,
      paymentFlow: 'created'
    }
  });
});

// Get all payments with filtering
export const getPayments = asyncHandler(async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 10,
    status,
    paymentType,
    paymentMethod,
    search,
    startDate,
    endDate,
    participantId
  } = req.query;

  const filter: any = {};

  if (status) filter.status = status;
  if (paymentType) filter.paymentType = paymentType;
  if (paymentMethod) filter.paymentMethod = paymentMethod;

  // Date range filter
  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate as string);
    if (endDate) filter.createdAt.$lte = new Date(endDate as string);
  }

  // Participant filter
  if (participantId) {
    filter.$or = [
      { 'payer.id': participantId },
      { 'payee.id': participantId }
    ];
  }

  // Search filter
  if (search) {
    filter.$or = [
      { paymentId: { $regex: search, $options: 'i' } },
      { orderNumber: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);

  const payments = await Payment.find(filter)
    .populate('orderId', 'orderNumber customerName')
    .populate('createdBy', 'name email')
    .populate('updatedBy', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Payment.countDocuments(filter);

  res.status(200).json({
    success: true,
    data: payments,
    pagination: {
      currentPage: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      totalItems: total,
      itemsPerPage: Number(limit)
    }
  });
});

// Get payment by ID
export const getPaymentById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const payment = await Payment.findById(id)
    .populate('orderId', 'orderNumber customerName items')
    .populate('createdBy', 'name email')
    .populate('updatedBy', 'name email')
    .populate('statusHistory.updatedBy', 'name email');

  if (!payment) {
    throw new ApiError(404, 'Payment not found');
  }

  res.status(200).json({
    success: true,
    data: payment
  });
});

// Update payment status
export const updatePaymentStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, notes, transactionId, gatewayReference } = req.body;

  const payment = await Payment.findById(id);
  if (!payment) {
    throw new ApiError(404, 'Payment not found');
  }

  // Update payment
  payment.status = status;
  payment.updatedBy = req.user._id;
  if (notes) payment.notes = notes;
  if (transactionId) payment.transactionId = transactionId;
  if (gatewayReference) payment.gatewayReference = gatewayReference;

  // Set timestamps based on status
  const now = new Date();
  if (status === PaymentStatus.PROCESSING && !payment.processedAt) {
    payment.processedAt = now;
  }
  if (status === PaymentStatus.COMPLETED && !payment.completedAt) {
    payment.completedAt = now;
  }

  await payment.save();

  // Auto-trigger vendor payments when customer payment is completed
  if (status === PaymentStatus.COMPLETED && payment.paymentType === PaymentType.CUSTOMER_TO_PLATFORM) {
    await autoTriggerVendorPayments(payment.orderId);
  }

  res.status(200).json({
    success: true,
    data: payment
  });
});

// Process refund
export const processRefund = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { refundAmount, refundReason } = req.body;

  const originalPayment = await Payment.findById(id);
  if (!originalPayment) {
    throw new ApiError(404, 'Payment not found');
  }

  if (originalPayment.status !== PaymentStatus.COMPLETED) {
    throw new ApiError(400, 'Can only refund completed payments');
  }

  // Create refund payment
  const refundPayment = await Payment.create({
    orderNumber: originalPayment.orderNumber,
    orderId: originalPayment.orderId,
    paymentType: PaymentType.REFUND,
    paymentMethod: originalPayment.paymentMethod,
    status: PaymentStatus.PENDING,
    payer: originalPayment.payee, // Platform refunds to customer
    payee: originalPayment.payer,
    breakdown: {
      ...originalPayment.breakdown,
      total: refundAmount
    },
    currency: originalPayment.currency,
    description: `Refund for payment ${originalPayment.paymentId}`,
    refundAmount,
    refundReason,
    refundDate: new Date(),
    createdBy: req.user._id,
    updatedBy: req.user._id
  });

  // Update original payment
  originalPayment.status = PaymentStatus.REFUNDED;
  originalPayment.refundAmount = refundAmount;
  originalPayment.refundReason = refundReason;
  originalPayment.refundDate = new Date();
  originalPayment.updatedBy = req.user._id;
  await originalPayment.save();

  res.status(201).json({
    success: true,
    data: {
      originalPayment,
      refundPayment
    }
  });
});

// Release escrow
export const releaseEscrow = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { releaseNotes } = req.body;

  const payment = await Payment.findById(id);
  if (!payment) {
    throw new ApiError(404, 'Payment not found');
  }

  if (!payment.escrow.isEscrow) {
    throw new ApiError(400, 'This payment is not in escrow');
  }

  if (payment.escrow.releasedAt) {
    throw new ApiError(400, 'Escrow has already been released');
  }

  // Release escrow
  payment.escrow.releasedAt = new Date();
  payment.escrow.releasedBy = req.user._id;
  payment.status = PaymentStatus.COMPLETED;
  payment.completedAt = new Date();
  payment.notes = releaseNotes;
  payment.updatedBy = req.user._id;

  await payment.save();

  // Trigger vendor payments
  await autoTriggerVendorPayments(payment.orderId);

  res.status(200).json({
    success: true,
    data: payment
  });
});

// Get payment analytics
export const getPaymentAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const { startDate, endDate, participantType } = req.query;

  const filter: any = {};
  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate as string);
    if (endDate) filter.createdAt.$lte = new Date(endDate as string);
  }

  const [
    totalPayments,
    totalVolume,
    statusBreakdown,
    typeBreakdown,
    methodBreakdown,
    averageProcessingTime,
    escrowStats
  ] = await Promise.all([
    Payment.countDocuments(filter),
    Payment.aggregate([
      { $match: filter },
      { $group: { _id: null, total: { $sum: '$breakdown.total' } } }
    ]),
    Payment.aggregate([
      { $match: filter },
      { $group: { _id: '$status', count: { $sum: 1 }, volume: { $sum: '$breakdown.total' } } }
    ]),
    Payment.aggregate([
      { $match: filter },
      { $group: { _id: '$paymentType', count: { $sum: 1 }, volume: { $sum: '$breakdown.total' } } }
    ]),
    Payment.aggregate([
      { $match: filter },
      { $group: { _id: '$paymentMethod', count: { $sum: 1 }, volume: { $sum: '$breakdown.total' } } }
    ]),
    Payment.aggregate([
      { $match: { ...filter, completedAt: { $exists: true } } },
      { $project: {
        processingTime: { $subtract: ['$completedAt', '$initiatedAt'] }
      }},
      { $group: { _id: null, avgTime: { $avg: '$processingTime' } } }
    ]),
    Payment.aggregate([
      { $match: { ...filter, 'escrow.isEscrow': true } },
      { $group: {
        _id: null,
        totalEscrow: { $sum: 1 },
        releasedEscrow: { $sum: { $cond: [{ $ifNull: ['$escrow.releasedAt', false] }, 1, 0] } },
        escrowVolume: { $sum: '$breakdown.total' }
      }}
    ])
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalPayments,
      totalVolume: totalVolume[0]?.total || 0,
      statusBreakdown,
      typeBreakdown,
      methodBreakdown,
      averageProcessingTime: averageProcessingTime[0]?.avgTime || 0,
      escrowStats: escrowStats[0] || { totalEscrow: 0, releasedEscrow: 0, escrowVolume: 0 }
    }
  });
});

// Helper function to auto-trigger vendor payments
async function autoTriggerVendorPayments(orderId: mongoose.Types.ObjectId) {
  const vendorPayments = await Payment.find({
    orderId,
    paymentType: PaymentType.PLATFORM_TO_VENDOR,
    status: PaymentStatus.PENDING
  });

  for (const payment of vendorPayments) {
    payment.status = PaymentStatus.PROCESSING;
    payment.processedAt = new Date();
    await payment.save();
  }
}

// Bulk payment processing
export const bulkProcessPayments = asyncHandler(async (req: Request, res: Response) => {
  const { paymentIds, action, status, notes } = req.body;

  if (!paymentIds || !Array.isArray(paymentIds) || paymentIds.length === 0) {
    throw new ApiError(400, 'Payment IDs are required');
  }

  const updateData: any = {
    updatedBy: req.user._id
  };

  if (status) updateData.status = status;
  if (notes) updateData.notes = notes;

  const result = await Payment.updateMany(
    { _id: { $in: paymentIds } },
    updateData
  );

  res.status(200).json({
    success: true,
    message: `${result.modifiedCount} payments updated successfully`,
    data: {
      modifiedCount: result.modifiedCount
    }
  });
});

export default {
  createPaymentFlow,
  getPayments,
  getPaymentById,
  updatePaymentStatus,
  processRefund,
  releaseEscrow,
  getPaymentAnalytics,
  bulkProcessPayments
};