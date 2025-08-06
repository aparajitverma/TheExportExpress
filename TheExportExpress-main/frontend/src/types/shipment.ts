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
  _id: string;
  phase: ShipmentPhase;
  status: ShipmentStatus;
  location: ILocation;
  timestamp: string;
  description: string;
  updatedBy: {
    _id: string;
    name: string;
    email: string;
  };
  estimatedNextUpdate?: string;
  actualDuration?: number;
  expectedDuration?: number;
  attachments?: string[];
  isException?: boolean;
  exceptionReason?: string;
}

export interface IShipmentDocument {
  _id: string;
  type: DocumentType;
  phase: ShipmentPhase;
  fileName: string;
  fileUrl: string;
  uploadedBy: {
    _id: string;
    name: string;
    email: string;
  };
  uploadedAt: string;
  verified: boolean;
  verifiedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  verifiedAt?: string;
  expiryDate?: string;
  documentNumber?: string;
}

export interface IStakeholder {
  type: 'vendor' | 'platform' | 'freight_forwarder' | 'customs_agent' | 'shipping_line' | 'delivery_partner' | 'customer';
  id: string;
  name: string;
  company?: string;
  email: string;
  phone?: string;
  role: string;
  phase: ShipmentPhase[];
}

export interface IPhaseInfo {
  startDate?: string;
  endDate?: string;
  estimatedDuration: number;
  actualDuration?: number;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
}

export interface IShipment {
  _id: string;
  shipmentId: string;
  orderId: string;
  orderNumber: string;
  
  originLocation: ILocation;
  destinationLocation: ILocation;
  transitPorts: ILocation[];
  
  currentPhase: ShipmentPhase;
  currentStatus: ShipmentStatus;
  transportMode: TransportMode;
  estimatedDeliveryDate: string;
  actualDeliveryDate?: string;
  
  totalWeight: number;
  totalVolume: number;
  numberOfPackages: number;
  cargoDescription: string;
  hsCode?: string;
  insuranceValue: number;
  
  trackingUpdates: ITrackingUpdate[];
  documents: IShipmentDocument[];
  stakeholders: IStakeholder[];
  
  phases: {
    [key in ShipmentPhase]?: IPhaseInfo;
  };
  
  shippingCost: number;
  insuranceCost: number;
  customsDuties: number;
  totalCost: number;
  currency: string;
  
  specialInstructions?: string;
  dangerousGoods: boolean;
  temperatureControlled: boolean;
  fragile: boolean;
  
  customerNotifications: boolean;
  customerPreferences: {
    smsUpdates: boolean;
    emailUpdates: boolean;
    whatsappUpdates: boolean;
  };
  
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  updatedBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface IShipmentAnalytics {
  totalShipments: number;
  phaseBreakdown: Array<{
    _id: ShipmentPhase;
    count: number;
  }>;
  statusBreakdown: Array<{
    _id: ShipmentStatus;
    count: number;
  }>;
  transportModeBreakdown: Array<{
    _id: TransportMode;
    count: number;
  }>;
  countryBreakdown: Array<{
    _id: string;
    count: number;
  }>;
  averageDeliveryTime: number;
  delayedShipments: number;
  exceptionShipments: number;
}

export interface IShipmentFilters {
  phase?: ShipmentPhase;
  status?: ShipmentStatus;
  country?: string;
  transportMode?: TransportMode;
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface IShipmentFormData {
  orderId: string;
  originLocation: ILocation;
  destinationLocation: ILocation;
  transitPorts: ILocation[];
  transportMode: TransportMode;
  totalWeight: number;
  totalVolume: number;
  numberOfPackages: number;
  cargoDescription: string;
  hsCode?: string;
  insuranceValue: number;
  shippingCost: number;
  specialInstructions?: string;
  dangerousGoods: boolean;
  temperatureControlled: boolean;
  fragile: boolean;
}

export interface ITrackingUpdateFormData {
  phase: ShipmentPhase;
  status: ShipmentStatus;
  location: ILocation;
  description: string;
  estimatedNextUpdate?: string;
  attachments?: string[];
  isException?: boolean;
  exceptionReason?: string;
}

export interface IDocumentUploadFormData {
  type: DocumentType;
  phase: ShipmentPhase;
  fileName: string;
  fileUrl: string;
  documentNumber?: string;
  expiryDate?: string;
}

export interface ILiveTracking {
  shipmentId: string;
  orderNumber: string;
  currentPhase: ShipmentPhase;
  currentStatus: ShipmentStatus;
  estimatedDeliveryDate: string;
  origin: {
    city: string;
    country: string;
  };
  destination: {
    city: string;
    country: string;
  };
  trackingUpdates: Array<{
    phase: ShipmentPhase;
    status: ShipmentStatus;
    location: {
      city: string;
      country: string;
    };
    timestamp: string;
    description: string;
    estimatedNextUpdate?: string;
  }>;
}