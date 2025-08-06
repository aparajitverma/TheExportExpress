import mongoose, { Schema, Document } from 'mongoose';

// Shipment Flow Phases based on SHIPMENT_FLOW_ARCHITECTURE.txt
export enum ShipmentPhase {
  VENDOR_TO_HOST = 'vendor_to_host',
  HOST_TO_PORT = 'host_to_port',
  PORT_TO_PORT = 'port_to_port',
  IMPORT_PROCESSING = 'import_processing',
  PORT_TO_CLIENT = 'port_to_client'
}

// Detailed status for each phase
export enum ShipmentStatus {
  // Phase 1: Vendor to Host
  PENDING_PICKUP = 'pending_pickup',
  PICKED_UP = 'picked_up',
  IN_TRANSIT_TO_HOST = 'in_transit_to_host',
  ARRIVED_AT_HOST = 'arrived_at_host',
  QUALITY_CHECKED = 'quality_checked',
  READY_FOR_EXPORT = 'ready_for_export',
  
  // Phase 2: Host to Port
  DOCUMENTATION_IN_PROGRESS = 'documentation_in_progress',
  CUSTOMS_SUBMITTED = 'customs_submitted',
  IN_TRANSIT_TO_PORT = 'in_transit_to_port',
  ARRIVED_AT_PORT = 'arrived_at_port',
  CUSTOMS_CLEARED = 'customs_cleared',
  LOADED_FOR_SHIPPING = 'loaded_for_shipping',
  
  // Phase 3: Port to Port (International)
  DEPARTED_ORIGIN_PORT = 'departed_origin_port',
  IN_TRANSIT_INTERNATIONAL = 'in_transit_international',
  ARRIVED_DESTINATION_PORT = 'arrived_destination_port',
  DISCHARGED = 'discharged',
  
  // Phase 4: Import Processing
  IMPORT_DOCUMENTATION_SUBMITTED = 'import_documentation_submitted',
  CUSTOMS_INSPECTION = 'customs_inspection',
  DUTIES_PAID = 'duties_paid',
  IMPORT_CLEARED = 'import_cleared',
  READY_FOR_DELIVERY = 'ready_for_delivery',
  
  // Phase 5: Port to Client
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERY_ATTEMPTED = 'delivery_attempted',
  DELIVERED = 'delivered',
  DELIVERY_CONFIRMED = 'delivery_confirmed',
  
  // Exception statuses
  DELAYED = 'delayed',
  EXCEPTION = 'exception',
  RETURNED = 'returned',
  LOST = 'lost'
}

export enum TransportMode {
  SEA_FREIGHT = 'sea_freight',
  AIR_FREIGHT = 'air_freight',
  ROAD_TRANSPORT = 'road_transport',
  RAIL_TRANSPORT = 'rail_transport',
  MULTIMODAL = 'multimodal'
}

export enum DocumentType {
  COMMERCIAL_INVOICE = 'commercial_invoice',
  PACKING_LIST = 'packing_list',
  BILL_OF_LADING = 'bill_of_lading',
  CERTIFICATE_OF_ORIGIN = 'certificate_of_origin',
  EXPORT_LICENSE = 'export_license',
  CUSTOMS_DECLARATION = 'customs_declaration',
  INSURANCE_CERTIFICATE = 'insurance_certificate',
  PHYTOSANITARY_CERTIFICATE = 'phytosanitary_certificate',
  QUALITY_CERTIFICATE = 'quality_certificate',
  IMPORT_PERMIT = 'import_permit'
}

export interface ILocation {
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  portCode?: string;
  facilityType?: 'warehouse' | 'port' | 'airport' | 'border' | 'distribution_center';
}

export interface ITrackingUpdate {
  _id: mongoose.Types.ObjectId;
  phase: ShipmentPhase;
  status: ShipmentStatus;
  location: ILocation;
  timestamp: Date;
  description: string;
  updatedBy: mongoose.Types.ObjectId;
  estimatedNextUpdate?: Date;
  actualDuration?: number; // in hours
  expectedDuration?: number; // in hours
  attachments?: string[];
  isException?: boolean;
  exceptionReason?: string;
}

export interface IShipmentDocument {
  _id: mongoose.Types.ObjectId;
  type: DocumentType;
  phase: ShipmentPhase;
  fileName: string;
  fileUrl: string;
  uploadedBy: mongoose.Types.ObjectId;
  uploadedAt: Date;
  verified: boolean;
  verifiedBy?: mongoose.Types.ObjectId;
  verifiedAt?: Date;
  expiryDate?: Date;
  documentNumber?: string;
}

export interface IStakeholder {
  type: 'vendor' | 'platform' | 'freight_forwarder' | 'customs_agent' | 'shipping_line' | 'delivery_partner' | 'customer';
  id: mongoose.Types.ObjectId;
  name: string;
  company?: string;
  email: string;
  phone?: string;
  role: string;
  phase: ShipmentPhase[];
}

export interface IShipment extends Document {
  // Core Information
  shipmentId: string;
  orderId: mongoose.Types.ObjectId;
  orderNumber: string;
  
  // Route Information
  originLocation: ILocation;
  destinationLocation: ILocation;
  transitPorts: ILocation[];
  
  // Shipment Details
  currentPhase: ShipmentPhase;
  currentStatus: ShipmentStatus;
  transportMode: TransportMode;
  estimatedDeliveryDate: Date;
  actualDeliveryDate?: Date;
  
  // Cargo Information
  totalWeight: number;
  totalVolume: number;
  numberOfPackages: number;
  cargoDescription: string;
  hsCode?: string;
  insuranceValue: number;
  
  // Tracking & Updates
  trackingUpdates: ITrackingUpdate[];
  documents: IShipmentDocument[];
  stakeholders: IStakeholder[];
  
  // Timing
  phases: {
    [key in ShipmentPhase]?: {
      startDate?: Date;
      endDate?: Date;
      estimatedDuration: number; // in hours
      actualDuration?: number; // in hours
      status: 'pending' | 'in_progress' | 'completed' | 'delayed';
    };
  };
  
  // Financial
  shippingCost: number;
  insuranceCost: number;
  customsDuties: number;
  totalCost: number;
  currency: string;
  
  // Special Instructions
  specialInstructions?: string;
  dangerousGoods: boolean;
  temperatureControlled: boolean;
  fragile: boolean;
  
  // Customer Information
  customerNotifications: boolean;
  customerPreferences: {
    smsUpdates: boolean;
    emailUpdates: boolean;
    whatsappUpdates: boolean;
  };
  
  // Audit
  createdBy: mongoose.Types.ObjectId;
  updatedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const locationSchema = new Schema<ILocation>({
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  postalCode: {
    type: String,
    required: true
  },
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  portCode: String,
  facilityType: {
    type: String,
    enum: ['warehouse', 'port', 'airport', 'border', 'distribution_center']
  }
});

const trackingUpdateSchema = new Schema<ITrackingUpdate>({
  phase: {
    type: String,
    enum: Object.values(ShipmentPhase),
    required: true
  },
  status: {
    type: String,
    enum: Object.values(ShipmentStatus),
    required: true
  },
  location: {
    type: locationSchema,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    required: true
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  estimatedNextUpdate: Date,
  actualDuration: Number,
  expectedDuration: Number,
  attachments: [String],
  isException: {
    type: Boolean,
    default: false
  },
  exceptionReason: String
}, { timestamps: true });

const shipmentDocumentSchema = new Schema<IShipmentDocument>({
  type: {
    type: String,
    enum: Object.values(DocumentType),
    required: true
  },
  phase: {
    type: String,
    enum: Object.values(ShipmentPhase),
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  uploadedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  verified: {
    type: Boolean,
    default: false
  },
  verifiedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedAt: Date,
  expiryDate: Date,
  documentNumber: String
}, { timestamps: true });

const stakeholderSchema = new Schema<IStakeholder>({
  type: {
    type: String,
    enum: ['vendor', 'platform', 'freight_forwarder', 'customs_agent', 'shipping_line', 'delivery_partner', 'customer'],
    required: true
  },
  id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  company: String,
  email: {
    type: String,
    required: true
  },
  phone: String,
  role: {
    type: String,
    required: true
  },
  phase: [{
    type: String,
    enum: Object.values(ShipmentPhase)
  }]
});

const shipmentSchema = new Schema<IShipment>({
  shipmentId: {
    type: String,
    required: true,
    unique: true
  },
  orderId: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  orderNumber: {
    type: String,
    required: true
  },
  
  originLocation: {
    type: locationSchema,
    required: true
  },
  destinationLocation: {
    type: locationSchema,
    required: true
  },
  transitPorts: [locationSchema],
  
  currentPhase: {
    type: String,
    enum: Object.values(ShipmentPhase),
    default: ShipmentPhase.VENDOR_TO_HOST
  },
  currentStatus: {
    type: String,
    enum: Object.values(ShipmentStatus),
    default: ShipmentStatus.PENDING_PICKUP
  },
  transportMode: {
    type: String,
    enum: Object.values(TransportMode),
    required: true
  },
  estimatedDeliveryDate: {
    type: Date,
    required: true
  },
  actualDeliveryDate: Date,
  
  totalWeight: {
    type: Number,
    required: true,
    min: 0
  },
  totalVolume: {
    type: Number,
    required: true,
    min: 0
  },
  numberOfPackages: {
    type: Number,
    required: true,
    min: 1
  },
  cargoDescription: {
    type: String,
    required: true
  },
  hsCode: String,
  insuranceValue: {
    type: Number,
    required: true,
    min: 0
  },
  
  trackingUpdates: [trackingUpdateSchema],
  documents: [shipmentDocumentSchema],
  stakeholders: [stakeholderSchema],
  
  phases: {
    [ShipmentPhase.VENDOR_TO_HOST]: {
      startDate: Date,
      endDate: Date,
      estimatedDuration: { type: Number, default: 48 }, // 2 days
      actualDuration: Number,
      status: { type: String, enum: ['pending', 'in_progress', 'completed', 'delayed'], default: 'pending' }
    },
    [ShipmentPhase.HOST_TO_PORT]: {
      startDate: Date,
      endDate: Date,
      estimatedDuration: { type: Number, default: 24 }, // 1 day
      actualDuration: Number,
      status: { type: String, enum: ['pending', 'in_progress', 'completed', 'delayed'], default: 'pending' }
    },
    [ShipmentPhase.PORT_TO_PORT]: {
      startDate: Date,
      endDate: Date,
      estimatedDuration: { type: Number, default: 240 }, // 10 days
      actualDuration: Number,
      status: { type: String, enum: ['pending', 'in_progress', 'completed', 'delayed'], default: 'pending' }
    },
    [ShipmentPhase.IMPORT_PROCESSING]: {
      startDate: Date,
      endDate: Date,
      estimatedDuration: { type: Number, default: 72 }, // 3 days
      actualDuration: Number,
      status: { type: String, enum: ['pending', 'in_progress', 'completed', 'delayed'], default: 'pending' }
    },
    [ShipmentPhase.PORT_TO_CLIENT]: {
      startDate: Date,
      endDate: Date,
      estimatedDuration: { type: Number, default: 48 }, // 2 days
      actualDuration: Number,
      status: { type: String, enum: ['pending', 'in_progress', 'completed', 'delayed'], default: 'pending' }
    }
  },
  
  shippingCost: {
    type: Number,
    required: true,
    min: 0
  },
  insuranceCost: {
    type: Number,
    default: 0,
    min: 0
  },
  customsDuties: {
    type: Number,
    default: 0,
    min: 0
  },
  totalCost: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  
  specialInstructions: String,
  dangerousGoods: {
    type: Boolean,
    default: false
  },
  temperatureControlled: {
    type: Boolean,
    default: false
  },
  fragile: {
    type: Boolean,
    default: false
  },
  
  customerNotifications: {
    type: Boolean,
    default: true
  },
  customerPreferences: {
    smsUpdates: { type: Boolean, default: true },
    emailUpdates: { type: Boolean, default: true },
    whatsappUpdates: { type: Boolean, default: false }
  },
  
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Generate shipment ID
shipmentSchema.pre('save', async function(next) {
  if (this.isNew && !this.shipmentId) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    const count = await this.constructor.countDocuments({
      createdAt: { 
        $gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
        $lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
      }
    });
    
    this.shipmentId = `SHP-${year}${month}${day}-${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Calculate total cost
shipmentSchema.pre('save', function(next) {
  this.totalCost = this.shippingCost + this.insuranceCost + this.customsDuties;
  next();
});

// Indexes for better query performance
shipmentSchema.index({ shipmentId: 1 });
shipmentSchema.index({ orderId: 1 });
shipmentSchema.index({ orderNumber: 1 });
shipmentSchema.index({ currentPhase: 1 });
shipmentSchema.index({ currentStatus: 1 });
shipmentSchema.index({ 'originLocation.country': 1 });
shipmentSchema.index({ 'destinationLocation.country': 1 });
shipmentSchema.index({ estimatedDeliveryDate: 1 });
shipmentSchema.index({ createdAt: -1 });

export default mongoose.model<IShipment>('Shipment', shipmentSchema);