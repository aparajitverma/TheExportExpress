import { Request, Response } from 'express';
import Order, { IOrder } from '../models/Order';
import { ApiError, asyncHandler } from '../utils/ApiError';

// Get all orders with filtering and pagination
export const getOrders = asyncHandler(async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 10,
    status,
    paymentStatus,
    priority,
    assignedTo,
    search,
    startDate,
    endDate,
    vendor,
    product
  } = req.query;

  const filter: any = {};

  // Status filter
  if (status) {
    filter.orderStatus = status;
  }

  // Payment status filter
  if (paymentStatus) {
    filter.paymentStatus = paymentStatus;
  }

  // Priority filter
  if (priority) {
    filter.priority = priority;
  }

  // Assigned to filter
  if (assignedTo) {
    filter.assignedTo = assignedTo;
  }

  // Date range filter
  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) {
      filter.createdAt.$gte = new Date(startDate as string);
    }
    if (endDate) {
      filter.createdAt.$lte = new Date(endDate as string);
    }
  }

  // Vendor filter
  if (vendor) {
    filter['items.vendor'] = vendor;
  }

  // Product filter
  if (product) {
    filter['items.product'] = product;
  }

  // Search filter
  if (search) {
    filter.$or = [
      { orderNumber: { $regex: search, $options: 'i' } },
      { customerName: { $regex: search, $options: 'i' } },
      { customerEmail: { $regex: search, $options: 'i' } }
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);

  const orders = await Order.find(filter)
    .populate('items.product', 'name image price')
    .populate('items.vendor', 'name companyName')
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email')
    .populate('updatedBy', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Order.countDocuments(filter);

  res.status(200).json({
    success: true,
    data: orders,
    pagination: {
      currentPage: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      totalItems: total,
      itemsPerPage: Number(limit)
    }
  });
});

// Get order by ID
export const getOrderById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const order = await Order.findById(id)
    .populate('items.product', 'name image price description')
    .populate('items.vendor', 'name companyName email phone')
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email')
    .populate('updatedBy', 'name email');

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  res.status(200).json({
    success: true,
    data: order
  });
});

// Create new order
export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const orderData = {
    ...req.body,
    createdBy: req.user?._id,
    updatedBy: req.user?._id
  };

  const order = await Order.create(orderData);

  const populatedOrder = await Order.findById(order._id)
    .populate('items.product', 'name image price')
    .populate('items.vendor', 'name companyName')
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email')
    .populate('updatedBy', 'name email');

  res.status(201).json({
    success: true,
    data: populatedOrder
  });
});

// Update order
export const updateOrder = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = {
    ...req.body,
    updatedBy: req.user?._id
  };

  const order = await Order.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  )
    .populate('items.product', 'name image price')
    .populate('items.vendor', 'name companyName')
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email')
    .populate('updatedBy', 'name email');

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  res.status(200).json({
    success: true,
    data: order
  });
});

// Update order status
export const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { orderStatus, notes } = req.body;

  const order = await Order.findByIdAndUpdate(
    id,
    {
      orderStatus,
      notes: notes ? `${order.notes || ''}\n${new Date().toISOString()}: ${notes}`.trim() : order.notes,
      updatedBy: req.user?._id
    },
    { new: true, runValidators: true }
  )
    .populate('items.product', 'name image price')
    .populate('items.vendor', 'name companyName')
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email')
    .populate('updatedBy', 'name email');

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  res.status(200).json({
    success: true,
    data: order
  });
});

// Update item status
export const updateItemStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id, itemId } = req.params;
  const { status, trackingNumber, shippingCarrier, estimatedDelivery, notes } = req.body;

  const order = await Order.findById(id);
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  const item = order.items.id(itemId);
  if (!item) {
    throw new ApiError(404, 'Order item not found');
  }

  item.status = status;
  if (trackingNumber) item.trackingNumber = trackingNumber;
  if (shippingCarrier) item.shippingCarrier = shippingCarrier;
  if (estimatedDelivery) item.estimatedDelivery = estimatedDelivery;
  if (notes) item.notes = notes;

  order.updatedBy = req.user?._id;
  await order.save();

  const populatedOrder = await Order.findById(id)
    .populate('items.product', 'name image price')
    .populate('items.vendor', 'name companyName')
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email')
    .populate('updatedBy', 'name email');

  res.status(200).json({
    success: true,
    data: populatedOrder
  });
});

// Add shipment
export const addShipment = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const shipmentData = req.body;

  const order = await Order.findById(id);
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  order.shipments.push(shipmentData);
  order.updatedBy = req.user?._id;
  await order.save();

  const populatedOrder = await Order.findById(id)
    .populate('items.product', 'name image price')
    .populate('items.vendor', 'name companyName')
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email')
    .populate('updatedBy', 'name email');

  res.status(200).json({
    success: true,
    data: populatedOrder
  });
});

// Update shipment
export const updateShipment = asyncHandler(async (req: Request, res: Response) => {
  const { id, shipmentId } = req.params;
  const updateData = req.body;

  const order = await Order.findById(id);
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  const shipment = order.shipments.id(shipmentId);
  if (!shipment) {
    throw new ApiError(404, 'Shipment not found');
  }

  Object.assign(shipment, updateData);
  order.updatedBy = req.user?._id;
  await order.save();

  const populatedOrder = await Order.findById(id)
    .populate('items.product', 'name image price')
    .populate('items.vendor', 'name companyName')
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email')
    .populate('updatedBy', 'name email');

  res.status(200).json({
    success: true,
    data: populatedOrder
  });
});

// Delete shipment
export const deleteShipment = asyncHandler(async (req: Request, res: Response) => {
  const { id, shipmentId } = req.params;

  const order = await Order.findById(id);
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  order.shipments = order.shipments.filter(shipment => shipment._id.toString() !== shipmentId);
  order.updatedBy = req.user?._id;
  await order.save();

  const populatedOrder = await Order.findById(id)
    .populate('items.product', 'name image price')
    .populate('items.vendor', 'name companyName')
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email')
    .populate('updatedBy', 'name email');

  res.status(200).json({
    success: true,
    data: populatedOrder
  });
});

// Get order statistics
export const getOrderStats = asyncHandler(async (req: Request, res: Response) => {
  const { startDate, endDate } = req.query;

  const filter: any = {};
  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) {
      filter.createdAt.$gte = new Date(startDate as string);
    }
    if (endDate) {
      filter.createdAt.$lte = new Date(endDate as string);
    }
  }

  const [
    totalOrders,
    pendingOrders,
    processingOrders,
    shippedOrders,
    deliveredOrders,
    cancelledOrders,
    totalRevenue,
    averageOrderValue
  ] = await Promise.all([
    Order.countDocuments(filter),
    Order.countDocuments({ ...filter, orderStatus: 'pending' }),
    Order.countDocuments({ ...filter, orderStatus: 'processing' }),
    Order.countDocuments({ ...filter, orderStatus: 'shipped' }),
    Order.countDocuments({ ...filter, orderStatus: 'delivered' }),
    Order.countDocuments({ ...filter, orderStatus: 'cancelled' }),
    Order.aggregate([
      { $match: filter },
      { $group: { _id: null, total: { $sum: '$finalAmount' } } }
    ]),
    Order.aggregate([
      { $match: filter },
      { $group: { _id: null, average: { $avg: '$finalAmount' } } }
    ])
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      averageOrderValue: averageOrderValue[0]?.average || 0
    }
  });
});

// Delete order
export const deleteOrder = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const order = await Order.findByIdAndDelete(id);
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  res.status(200).json({
    success: true,
    message: 'Order deleted successfully'
  });
});

// Bulk update order status
export const bulkUpdateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const { orderIds, orderStatus, notes } = req.body;

  if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
    throw new ApiError(400, 'Order IDs are required');
  }

  const updateData: any = {
    orderStatus,
    updatedBy: req.user?._id
  };

  if (notes) {
    updateData.notes = notes;
  }

  const result = await Order.updateMany(
    { _id: { $in: orderIds } },
    updateData
  );

  res.status(200).json({
    success: true,
    message: `${result.modifiedCount} orders updated successfully`,
    data: {
      modifiedCount: result.modifiedCount
    }
  });
}); 