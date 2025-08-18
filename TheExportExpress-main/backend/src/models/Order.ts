import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  vendor: mongoose.Types.ObjectId;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  shippingCarrier?: string;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  notes?: string;
}

export interface IShipment {
  _id: mongoose.Types.ObjectId;
  trackingNumber: string;
  carrier: string;
  status: 'pending' | 'in_transit' | 'delivered' | 'failed';
  shippedAt?: Date;
  deliveredAt?: Date;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  trackingUrl?: string;
  notes?: string;
}

export interface IOrder extends Document {
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
  assignedTo?: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  updatedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  vendor: {
    type: Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  trackingNumber: String,
  shippingCarrier: String,
  estimatedDelivery: Date,
  actualDelivery: Date,
  notes: String
}, { timestamps: true });

const shipmentSchema = new Schema<IShipment>({
  trackingNumber: {
    type: String,
    required: true
  },
  carrier: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in_transit', 'delivered', 'failed'],
    default: 'pending'
  },
  shippedAt: Date,
  deliveredAt: Date,
  estimatedDelivery: Date,
  actualDelivery: Date,
  trackingUrl: String,
  notes: String
}, { timestamps: true });

const orderSchema = new Schema<IOrder>({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  customerName: {
    type: String,
    required: true
  },
  customerEmail: {
    type: String,
    required: true
  },
  customerPhone: String,
  customerAddress: {
    street: {
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
    }
  },
  items: [orderItemSchema],
  shipments: [shipmentSchema],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  taxAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  shippingAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  discountAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  finalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  paymentMethod: {
    type: String,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  source: {
    type: String,
    enum: ['website', 'phone', 'email', 'walk_in', 'other'],
    default: 'website'
  },
  notes: String,
  internalNotes: String,
  tags: [String],
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User'
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

// Generate order number
orderSchema.pre('save', async function(next) {
  if (this.isNew && !this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    // Get count of orders for today
    const todayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    
    const OrderModel = this.constructor as mongoose.Model<typeof this>;
    const count = await OrderModel.countDocuments({
      createdAt: { $gte: todayStart, $lt: todayEnd }
    });
    
    this.orderNumber = `ORD-${year}${month}${day}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

// Calculate totals before saving
orderSchema.pre('save', function(next) {
  if (this.items && this.items.length > 0) {
    this.totalAmount = this.items.reduce((sum, item) => sum + item.totalPrice, 0);
    this.finalAmount = this.totalAmount + this.taxAmount + this.shippingAmount - this.discountAmount;
  }
  next();
});

// Indexes for better query performance
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ customerEmail: 1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ assignedTo: 1 });
orderSchema.index({ 'items.vendor': 1 });
orderSchema.index({ 'items.product': 1 });

export default mongoose.model<IOrder>('Order', orderSchema); 