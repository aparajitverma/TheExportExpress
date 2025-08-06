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
  id: string;
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
  releasedAt?: string;
  releasedBy?: {
    _id: string;
    name: string;
    email: string;
  };
}

export interface IPayment {
  _id: string;
  paymentId: string;
  orderNumber: string;
  orderId: string;
  
  paymentType: PaymentType;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  
  payer: IPaymentParticipant;
  payee: IPaymentParticipant;
  intermediaries: IPaymentParticipant[];
  
  breakdown: IPaymentBreakdown;
  currency: string;
  exchangeRate?: number;
  
  escrow: IEscrowDetails;
  
  transactionId?: string;
  gatewayReference?: string;
  gatewayResponse?: any;
  
  initiatedAt: string;
  processedAt?: string;
  completedAt?: string;
  dueDate?: string;
  
  description: string;
  notes?: string;
  metadata?: Record<string, any>;
  
  disputeReason?: string;
  disputeDate?: string;
  refundAmount?: number;
  refundReason?: string;
  refundDate?: string;
  
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
  statusHistory: Array<{
    status: PaymentStatus;
    timestamp: string;
    updatedBy: {
      _id: string;
      name: string;
      email: string;
    };
    notes?: string;
  }>;
  
  createdAt: string;
  updatedAt: string;
}

export interface IPaymentAnalytics {
  totalPayments: number;
  totalVolume: number;
  statusBreakdown: Array<{
    _id: PaymentStatus;
    count: number;
    volume: number;
  }>;
  typeBreakdown: Array<{
    _id: PaymentType;
    count: number;
    volume: number;
  }>;
  methodBreakdown: Array<{
    _id: PaymentMethod;
    count: number;
    volume: number;
  }>;
  averageProcessingTime: number;
  escrowStats: {
    totalEscrow: number;
    releasedEscrow: number;
    escrowVolume: number;
  };
}

export interface IPaymentFilters {
  status?: PaymentStatus;
  paymentType?: PaymentType;
  paymentMethod?: PaymentMethod;
  search?: string;
  startDate?: string;
  endDate?: string;
  participantId?: string;
  page?: number;
  limit?: number;
}

export interface IPaymentStatusUpdate {
  status: PaymentStatus;
  notes?: string;
  transactionId?: string;
  gatewayReference?: string;
}

export interface IRefundRequest {
  refundAmount: number;
  refundReason: string;
}

export interface IEscrowRelease {
  releaseNotes: string;
}

export interface IBulkPaymentUpdate {
  paymentIds: string[];
  action: string;
  status?: PaymentStatus;
  notes?: string;
}