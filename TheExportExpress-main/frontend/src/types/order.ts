export interface IOrderItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    image?: string;
    price: number;
    description?: string;
  };
  vendor: {
    _id: string;
    name: string;
    companyName: string;
    email?: string;
    phone?: string;
  };
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  shippingCarrier?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  notes?: string;
}

export interface IShipment {
  _id: string;
  trackingNumber: string;
  carrier: string;
  status: 'pending' | 'in_transit' | 'delivered' | 'failed';
  shippedAt?: string;
  deliveredAt?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  trackingUrl?: string;
  notes?: string;
}

export interface IOrder {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  items: IOrderItem[];
  shipments: IShipment[];
  totalAmount: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  finalAmount: number;
  currency: string;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  source: 'website' | 'phone' | 'email' | 'walk_in' | 'other';
  notes?: string;
  internalNotes?: string;
  tags: string[];
  assignedTo?: {
    _id: string;
    name: string;
    email: string;
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

export interface IOrderStats {
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
}

export interface IOrderFilters {
  status?: string;
  paymentStatus?: string;
  priority?: string;
  assignedTo?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  vendor?: string;
  product?: string;
  page?: number;
  limit?: number;
}

export interface IOrderFormData {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  items: Array<{
    product: string;
    vendor: string;
    quantity: number;
    unitPrice: number;
  }>;
  totalAmount: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  currency: string;
  paymentMethod: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  source: 'website' | 'phone' | 'email' | 'walk_in' | 'other';
  notes?: string;
  tags: string[];
  assignedTo?: string;
}

export interface IShipmentFormData {
  trackingNumber: string;
  carrier: string;
  status: 'pending' | 'in_transit' | 'delivered' | 'failed';
  shippedAt?: string;
  deliveredAt?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  trackingUrl?: string;
  notes?: string;
}

export interface IOrderStatusUpdate {
  orderStatus: string;
  notes?: string;
}

export interface IItemStatusUpdate {
  status: string;
  trackingNumber?: string;
  shippingCarrier?: string;
  estimatedDelivery?: string;
  notes?: string;
}

export interface IBulkOrderUpdate {
  orderIds: string[];
  orderStatus: string;
  notes?: string;
} 