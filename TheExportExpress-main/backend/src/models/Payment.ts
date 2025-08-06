import mongoose, { Schema, Document } from 'mongoose';

// Payment types for different transaction flows
export enum PaymentType {
  CUSTOMER_TO_PLATFORM = 'customer_to_platform',
  PLATFORM_TO_VENDOR = 'platform_to_vendor',
  PLATFORM_TO_SHIPPING = 'platform_to_shipping',
  VENDOR_COMMISSION = 'vendor_commission',
  SHIPPING_PAYMENT = 'shipping_payment',
  REFUND = 'refund',
  DISPUTE = 'dispute'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
  DISPUTED = 'disputed',
  ON_HOLD = 'on_hold'
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  BANK_TRANSFER = 'bank_transfer',
  PAYPAL = 'paypal',
  STRIPE = 'stripe',
  ESCROW = 'escrow',
  CRYPTO = 'crypto',
  CASH_ON_DELIVERY = 'cash_on_delivery'
}

export interface IPaymentParticipant {
  type: 'customer' | 'vendor' | 'platform' | 'shipping_company';
  id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  accountDetails?: {
    bankName?: string;
    accountNumber?: string;
    routingNumber?: string;
    paypalEmail?: string;
    cryptoWallet?: string;
  };
}

export interface IPaymentBreakdown {
  subtotal: number;
  tax: number;
  shipping: number;
  platformFee: number;
  vendorCommission: number;
  shippingCompanyFee: number;
  processingFee: number;
  discount: number;
  total: number;
}

export interface IEscrowDetails {
  isEscrow: boolean;
  escrowProvider?: string;
  escrowId?: string;
  releaseConditions?: string[];
  releasedAt?: Date;
  releasedBy?: mongoose.Types.ObjectId;
}

export interface IPayment extends Document {
  // Core payment information
  paymentId: string;
  orderNumber: string;
  orderId: mongoose.Types.ObjectId;
  
  // Payment flow details
  paymentType: PaymentType;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  
  // Participants
  payer: IPaymentParticipant;
  payee: IPaymentParticipant;
  intermediaries: IPaymentParticipant[];
  
  // Financial breakdown
  breakdown: IPaymentBreakdown;
  currency: string;
  exchangeRate?: number;
  
  // Escrow and security
  escrow: IEscrowDetails;
  
  // Transaction details
  transactionId?: string;
  gatewayReference?: string;
  gatewayResponse?: any;
  
  // Timing
  initiatedAt: Date;
  processedAt?: Date;
  completedAt?: Date;
  dueDate?: Date;
  
  // Documentation
  description: string;
  notes?: string;
  metadata?: Record<string, any>;
  
  // Dispute and refund tracking
  disputeReason?: string;
  disputeDate?: Date;
  refundAmount?: number;
  refundReason?: string;
  refundDate?: Date;
  
  // Audit trail
  createdBy: mongoose.Types.ObjectId;
  updatedBy: mongoose.Types.ObjectId;
  statusHistory: Array<{
    status: PaymentStatus;
    timestamp: Date;
    updatedBy: mongoose.Types.ObjectId;
    notes?: string;
  }>;
  
  createdAt: Date;
  updatedAt: Date;
}

const paymentParticipantSchema = new Schema<IPaymentParticipant>({
  type: {
    type: String,
    enum: ['customer', 'vendor', 'platform', 'shipping_company'],
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
  email: {
    type: String,
    required: true
  },
  accountDetails: {
    bankName: String,
    accountNumber: String,
    routingNumber: String,
    paypalEmail: String,
    cryptoWallet: String
  }
});

const paymentBreakdownSchema = new Schema<IPaymentBreakdown>({
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  tax: {
    type: Number,
    default: 0,
    min: 0
  },
  shipping: {
    type: Number,
    default: 0,
    min: 0
  },
  platformFee: {
    type: Number,
    default: 0,
    min: 0
  },
  vendorCommission: {
    type: Number,
    default: 0,
    min: 0
  },
  shippingCompanyFee: {
    type: Number,
    default: 0,
    min: 0
  },
  processingFee: {
    type: Number,
    default: 0,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  }
});

const escrowDetailsSchema = new Schema<IEscrowDetails>({
  isEscrow: {
    type: Boolean,
    default: false
  },
  escrowProvider: String,
  escrowId: String,
  releaseConditions: [String],
  releasedAt: Date,
  releasedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

const paymentSchema = new Schema<IPayment>({
  paymentId: {
    type: String,
    required: true,
    unique: true
  },
  orderNumber: {
    type: String,
    required: true
  },
  orderId: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  
  paymentType: {
    type: String,
    enum: Object.values(PaymentType),
    required: true
  },
  paymentMethod: {
    type: String,
    enum: Object.values(PaymentMethod),
    required: true
  },
  status: {
    type: String,
    enum: Object.values(PaymentStatus),
    default: PaymentStatus.PENDING
  },
  
  payer: {
    type: paymentParticipantSchema,
    required: true
  },
  payee: {
    type: paymentParticipantSchema,
    required: true
  },
  intermediaries: [paymentParticipantSchema],
  
  breakdown: {
    type: paymentBreakdownSchema,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  exchangeRate: Number,
  
  escrow: {
    type: escrowDetailsSchema,
    default: () => ({ isEscrow: false })
  },
  
  transactionId: String,
  gatewayReference: String,
  gatewayResponse: Schema.Types.Mixed,
  
  initiatedAt: {
    type: Date,
    default: Date.now
  },
  processedAt: Date,
  completedAt: Date,
  dueDate: Date,
  
  description: {
    type: String,
    required: true
  },
  notes: String,
  metadata: Schema.Types.Mixed,
  
  disputeReason: String,
  disputeDate: Date,
  refundAmount: Number,
  refundReason: String,
  refundDate: Date,
  
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  statusHistory: [{
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    notes: String
  }]
}, {
  timestamps: true
});

// Generate payment ID
paymentSchema.pre('save', async function(next) {
  if (this.isNew && !this.paymentId) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    // Get count of payments for today
    const todayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    
    const count = await this.constructor.countDocuments({
      createdAt: { $gte: todayStart, $lt: todayEnd }
    });
    
    this.paymentId = `PAY-${year}${month}${day}-${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Add to status history on status change
paymentSchema.pre('save', function(next) {
  if (this.isModified('status') && !this.isNew) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
      updatedBy: this.updatedBy,
      notes: this.notes
    });
  }
  next();
});

// Indexes for better query performance
paymentSchema.index({ paymentId: 1 });
paymentSchema.index({ orderNumber: 1 });
paymentSchema.index({ orderId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ paymentType: 1 });
paymentSchema.index({ 'payer.id': 1 });
paymentSchema.index({ 'payee.id': 1 });
paymentSchema.index({ createdAt: -1 });

export default mongoose.model<IPayment>('Payment', paymentSchema);