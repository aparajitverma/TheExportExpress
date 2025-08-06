import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Shipment, { 
  IShipment, 
  ShipmentPhase, 
  ShipmentStatus, 
  TransportMode,
  DocumentType 
} from '../models/Shipment';
import Order from '../models/Order';
import { ApiError, asyncHandler } from '../utils/ApiError';

// Create shipment from order
export const createShipment = asyncHandler(async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const {
    originLocation,
    destinationLocation,
    transitPorts = [],
    transportMode,
    totalWeight,
    totalVolume,
    numberOfPackages,
    cargoDescription,
    hsCode,
    insuranceValue,
    shippingCost,
    specialInstructions,
    dangerousGoods = false,
    temperatureControlled = false,
    fragile = false
  } = req.body;

  // Get order details
  const order = await Order.findById(orderId)
    .populate('items.vendor', 'name companyName email phone')
    .populate('createdBy', 'name email phone');

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  // Calculate estimated delivery date based on transport mode and destination
  const estimatedDeliveryDate = calculateEstimatedDelivery(
    transportMode,
    destinationLocation.country,
    new Date()
  );

  // Create stakeholders based on order and shipment info
  const stakeholders = [
    // Customer
    {
      type: 'customer',
      id: order.createdBy._id,
      name: order.customerName,
      email: order.customerEmail,
      phone: order.customerPhone || '',
      role: 'Consignee',
      phase: [ShipmentPhase.PORT_TO_CLIENT]
    },
    // Platform (Host)
    {
      type: 'platform',
      id: req.user._id,
      name: 'ExportExpress',
      company: 'ExportExpress India',
      email: 'shipments@exportexpress.com',
      phone: '+91-9876543210',
      role: 'Export Management',
      phase: Object.values(ShipmentPhase)
    }
  ];

  // Add vendors as stakeholders
  const uniqueVendors = [...new Map(
    order.items.map(item => [item.vendor._id.toString(), item.vendor])
  ).values()];

  uniqueVendors.forEach(vendor => {
    stakeholders.push({
      type: 'vendor',
      id: vendor._id,
      name: vendor.name,
      company: vendor.companyName,
      email: vendor.email,
      phone: vendor.phone || '',
      role: 'Supplier',
      phase: [ShipmentPhase.VENDOR_TO_HOST]
    });
  });

  // Create initial tracking update
  const initialTrackingUpdate = {
    phase: ShipmentPhase.VENDOR_TO_HOST,
    status: ShipmentStatus.PENDING_PICKUP,
    location: originLocation,
    timestamp: new Date(),
    description: 'Shipment created and awaiting pickup from vendor',
    updatedBy: req.user._id,
    estimatedNextUpdate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    expectedDuration: 48 // 2 days
  };

  const shipment = await Shipment.create({
    orderId: order._id,
    orderNumber: order.orderNumber,
    originLocation,
    destinationLocation,
    transitPorts,
    transportMode,
    estimatedDeliveryDate,
    totalWeight,
    totalVolume,
    numberOfPackages,
    cargoDescription,
    hsCode,
    insuranceValue,
    shippingCost,
    insuranceCost: insuranceValue * 0.01, // 1% of insurance value
    specialInstructions,
    dangerousGoods,
    temperatureControlled,
    fragile,
    trackingUpdates: [initialTrackingUpdate],
    stakeholders,
    createdBy: req.user._id,
    updatedBy: req.user._id
  });

  res.status(201).json({
    success: true,
    data: shipment
  });
});

// Get all shipments with filtering
export const getShipments = asyncHandler(async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 10,
    phase,
    status,
    country,
    transportMode,
    search,
    startDate,
    endDate
  } = req.query;

  const filter: any = {};

  if (phase) filter.currentPhase = phase;
  if (status) filter.currentStatus = status;
  if (transportMode) filter.transportMode = transportMode;
  if (country) {
    filter.$or = [
      { 'originLocation.country': country },
      { 'destinationLocation.country': country }
    ];
  }

  // Date range filter
  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate as string);
    if (endDate) filter.createdAt.$lte = new Date(endDate as string);
  }

  // Search filter
  if (search) {
    filter.$or = [
      { shipmentId: { $regex: search, $options: 'i' } },
      { orderNumber: { $regex: search, $options: 'i' } },
      { cargoDescription: { $regex: search, $options: 'i' } }
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);

  const shipments = await Shipment.find(filter)
    .populate('orderId', 'orderNumber customerName finalAmount')
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Shipment.countDocuments(filter);

  res.status(200).json({
    success: true,
    data: shipments,
    pagination: {
      currentPage: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      totalItems: total,
      itemsPerPage: Number(limit)
    }
  });
});

// Get shipment by ID with full tracking details
export const getShipmentById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const shipment = await Shipment.findById(id)
    .populate('orderId', 'orderNumber customerName customerEmail customerPhone items finalAmount')
    .populate('trackingUpdates.updatedBy', 'name email')
    .populate('documents.uploadedBy', 'name email')
    .populate('documents.verifiedBy', 'name email');

  if (!shipment) {
    throw new ApiError(404, 'Shipment not found');
  }

  res.status(200).json({
    success: true,
    data: shipment
  });
});

// Update shipment tracking
export const updateShipmentTracking = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    phase,
    status,
    location,
    description,
    estimatedNextUpdate,
    attachments = [],
    isException = false,
    exceptionReason
  } = req.body;

  const shipment = await Shipment.findById(id);
  if (!shipment) {
    throw new ApiError(404, 'Shipment not found');
  }

  // Create new tracking update
  const trackingUpdate = {
    _id: new mongoose.Types.ObjectId(),
    phase,
    status,
    location,
    timestamp: new Date(),
    description,
    updatedBy: req.user._id,
    estimatedNextUpdate: estimatedNextUpdate ? new Date(estimatedNextUpdate) : undefined,
    attachments,
    isException,
    exceptionReason
  };

  // Calculate duration from last update
  const lastUpdate = shipment.trackingUpdates[shipment.trackingUpdates.length - 1];
  if (lastUpdate) {
    trackingUpdate.actualDuration = (new Date().getTime() - lastUpdate.timestamp.getTime()) / (1000 * 60 * 60); // hours
  }

  shipment.trackingUpdates.push(trackingUpdate);
  shipment.currentPhase = phase;
  shipment.currentStatus = status;
  shipment.updatedBy = req.user._id;

  // Update phase timing
  if (shipment.phases[phase]) {
    if (!shipment.phases[phase].startDate) {
      shipment.phases[phase].startDate = new Date();
      shipment.phases[phase].status = 'in_progress';
    }
    
    // Check if phase is completed
    const phaseCompletionStatuses = getPhaseCompletionStatuses(phase);
    if (phaseCompletionStatuses.includes(status)) {
      shipment.phases[phase].endDate = new Date();
      shipment.phases[phase].status = 'completed';
      if (shipment.phases[phase].startDate) {
        shipment.phases[phase].actualDuration = 
          (new Date().getTime() - shipment.phases[phase].startDate.getTime()) / (1000 * 60 * 60); // hours
      }
    }
  }

  // Set actual delivery date if delivered
  if (status === ShipmentStatus.DELIVERY_CONFIRMED) {
    shipment.actualDeliveryDate = new Date();
  }

  await shipment.save();

  // Send notifications (implement notification service here)
  // await sendShipmentNotification(shipment, trackingUpdate);

  res.status(200).json({
    success: true,
    data: shipment
  });
});

// Upload shipment document
export const uploadShipmentDocument = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    type,
    phase,
    fileName,
    fileUrl,
    documentNumber,
    expiryDate
  } = req.body;

  const shipment = await Shipment.findById(id);
  if (!shipment) {
    throw new ApiError(404, 'Shipment not found');
  }

  const document = {
    _id: new mongoose.Types.ObjectId(),
    type,
    phase,
    fileName,
    fileUrl,
    uploadedBy: req.user._id,
    uploadedAt: new Date(),
    verified: false,
    documentNumber,
    expiryDate: expiryDate ? new Date(expiryDate) : undefined
  };

  shipment.documents.push(document);
  shipment.updatedBy = req.user._id;
  await shipment.save();

  res.status(201).json({
    success: true,
    data: document
  });
});

// Verify shipment document
export const verifyShipmentDocument = asyncHandler(async (req: Request, res: Response) => {
  const { id, documentId } = req.params;
  const { verified, notes } = req.body;

  const shipment = await Shipment.findById(id);
  if (!shipment) {
    throw new ApiError(404, 'Shipment not found');
  }

  const document = shipment.documents.id(documentId);
  if (!document) {
    throw new ApiError(404, 'Document not found');
  }

  document.verified = verified;
  document.verifiedBy = req.user._id;
  document.verifiedAt = new Date();
  shipment.updatedBy = req.user._id;

  await shipment.save();

  res.status(200).json({
    success: true,
    data: document
  });
});

// Get shipment analytics
export const getShipmentAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const { startDate, endDate, country, transportMode } = req.query;

  const filter: any = {};
  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate as string);
    if (endDate) filter.createdAt.$lte = new Date(endDate as string);
  }
  if (country) filter['destinationLocation.country'] = country;
  if (transportMode) filter.transportMode = transportMode;

  const [
    totalShipments,
    phaseBreakdown,
    statusBreakdown,
    transportModeBreakdown,
    countryBreakdown,
    averageDeliveryTime,
    delayedShipments,
    exceptionShipments
  ] = await Promise.all([
    Shipment.countDocuments(filter),
    Shipment.aggregate([
      { $match: filter },
      { $group: { _id: '$currentPhase', count: { $sum: 1 } } }
    ]),
    Shipment.aggregate([
      { $match: filter },
      { $group: { _id: '$currentStatus', count: { $sum: 1 } } }
    ]),
    Shipment.aggregate([
      { $match: filter },
      { $group: { _id: '$transportMode', count: { $sum: 1 } } }
    ]),
    Shipment.aggregate([
      { $match: filter },
      { $group: { _id: '$destinationLocation.country', count: { $sum: 1 } } }
    ]),
    Shipment.aggregate([
      { 
        $match: { 
          ...filter, 
          actualDeliveryDate: { $exists: true } 
        } 
      },
      {
        $project: {
          deliveryTime: { 
            $subtract: ['$actualDeliveryDate', '$createdAt'] 
          }
        }
      },
      {
        $group: {
          _id: null,
          avgTime: { $avg: '$deliveryTime' }
        }
      }
    ]),
    Shipment.aggregate([
      { 
        $match: { 
          ...filter,
          $expr: { $gt: [new Date(), '$estimatedDeliveryDate'] },
          actualDeliveryDate: { $exists: false }
        } 
      },
      { $count: 'count' }
    ]),
    Shipment.aggregate([
      { 
        $match: { 
          ...filter,
          'trackingUpdates.isException': true 
        } 
      },
      { $count: 'count' }
    ])
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalShipments,
      phaseBreakdown,
      statusBreakdown,
      transportModeBreakdown,
      countryBreakdown,
      averageDeliveryTime: averageDeliveryTime[0]?.avgTime || 0,
      delayedShipments: delayedShipments[0]?.count || 0,
      exceptionShipments: exceptionShipments[0]?.count || 0
    }
  });
});

// Get live tracking for customer
export const getLiveTracking = asyncHandler(async (req: Request, res: Response) => {
  const { shipmentId } = req.params;

  const shipment = await Shipment.findOne({ shipmentId })
    .select('shipmentId orderNumber currentPhase currentStatus estimatedDeliveryDate trackingUpdates originLocation destinationLocation')
    .populate('trackingUpdates.updatedBy', 'name');

  if (!shipment) {
    throw new ApiError(404, 'Shipment not found');
  }

  // Filter tracking updates for customer (remove internal details)
  const customerTrackingUpdates = shipment.trackingUpdates.map(update => ({
    phase: update.phase,
    status: update.status,
    location: {
      city: update.location.city,
      country: update.location.country
    },
    timestamp: update.timestamp,
    description: update.description,
    estimatedNextUpdate: update.estimatedNextUpdate
  }));

  res.status(200).json({
    success: true,
    data: {
      shipmentId: shipment.shipmentId,
      orderNumber: shipment.orderNumber,
      currentPhase: shipment.currentPhase,
      currentStatus: shipment.currentStatus,
      estimatedDeliveryDate: shipment.estimatedDeliveryDate,
      origin: {
        city: shipment.originLocation.city,
        country: shipment.originLocation.country
      },
      destination: {
        city: shipment.destinationLocation.city,
        country: shipment.destinationLocation.country
      },
      trackingUpdates: customerTrackingUpdates
    }
  });
});

// Helper functions
function calculateEstimatedDelivery(
  transportMode: TransportMode,
  destinationCountry: string,
  startDate: Date
): Date {
  let baseDays = 15; // Default 15 days

  // Adjust based on transport mode
  switch (transportMode) {
    case TransportMode.AIR_FREIGHT:
      baseDays = 7;
      break;
    case TransportMode.SEA_FREIGHT:
      baseDays = 25;
      break;
    case TransportMode.ROAD_TRANSPORT:
      baseDays = 10;
      break;
    case TransportMode.RAIL_TRANSPORT:
      baseDays = 12;
      break;
    case TransportMode.MULTIMODAL:
      baseDays = 18;
      break;
  }

  // Adjust based on destination (simplified logic)
  if (['USA', 'Canada', 'Mexico'].includes(destinationCountry)) {
    baseDays += 5;
  } else if (['UK', 'Germany', 'France', 'Italy', 'Spain'].includes(destinationCountry)) {
    baseDays += 3;
  } else if (['China', 'Japan', 'South Korea', 'Singapore'].includes(destinationCountry)) {
    baseDays += 2;
  }

  const estimatedDate = new Date(startDate);
  estimatedDate.setDate(estimatedDate.getDate() + baseDays);
  return estimatedDate;
}

function getPhaseCompletionStatuses(phase: ShipmentPhase): ShipmentStatus[] {
  switch (phase) {
    case ShipmentPhase.VENDOR_TO_HOST:
      return [ShipmentStatus.READY_FOR_EXPORT];
    case ShipmentPhase.HOST_TO_PORT:
      return [ShipmentStatus.LOADED_FOR_SHIPPING];
    case ShipmentPhase.PORT_TO_PORT:
      return [ShipmentStatus.DISCHARGED];
    case ShipmentPhase.IMPORT_PROCESSING:
      return [ShipmentStatus.READY_FOR_DELIVERY];
    case ShipmentPhase.PORT_TO_CLIENT:
      return [ShipmentStatus.DELIVERY_CONFIRMED];
    default:
      return [];
  }
}

export default {
  createShipment,
  getShipments,
  getShipmentById,
  updateShipmentTracking,
  uploadShipmentDocument,
  verifyShipmentDocument,
  getShipmentAnalytics,
  getLiveTracking
};