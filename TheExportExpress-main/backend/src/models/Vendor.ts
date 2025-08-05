import mongoose, { Schema, Document } from 'mongoose';

export interface IVendor extends Document {
  // Basic Information
  name: string;
  companyName: string;
  vendorCode: string;
  email: string;
  phone: string;
  website?: string;
  
  // Address Information
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  
  // Business Information
  businessType: 'manufacturer' | 'wholesaler' | 'distributor' | 'exporter' | 'supplier';
  industry: string;
  specialization: string[];
  yearEstablished: number;
  employeeCount: number;
  
  // Contact Information
  primaryContact: {
    name: string;
    position: string;
    email: string;
    phone: string;
  };
  
  // Financial Information
  creditTerms: string;
  paymentMethod: 'advance' | 'net30' | 'net60' | 'net90' | 'letter_of_credit';
  currency: string;
  taxId: string;
  
  // Quality & Certifications
  certifications: {
    iso9001: boolean;
    iso14001: boolean;
    fssai: boolean;
    organic: boolean;
    fairTrade: boolean;
    other: string[];
  };
  
  // Product Information
  productCategories: mongoose.Types.ObjectId[];
  minimumOrderQuantity: number;
  leadTime: number; // in days
  samplePolicy: string;
  
  // Performance Metrics
  rating: number; // 1-5 stars
  reliabilityScore: number; // 1-100
  qualityScore: number; // 1-100
  deliveryScore: number; // 1-100
  
  // Status & Verification
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  verified: boolean;
  verificationDate?: Date;
  
  // Documents
  documents: {
    businessLicense: string;
    taxCertificate: string;
    qualityCertificates: string[];
    bankDetails: string;
    other: string[];
  };
  
  // Notes & History
  notes: string;
  tags: string[];
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const vendorSchema = new Schema<IVendor>(
  {
    // Basic Information
    name: {
      type: String,
      required: true,
      trim: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    vendorCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    
    // Address Information
    address: {
      street: {
        type: String,
        required: true,
        trim: true,
      },
      city: {
        type: String,
        required: true,
        trim: true,
      },
      state: {
        type: String,
        required: true,
        trim: true,
      },
      country: {
        type: String,
        required: true,
        trim: true,
      },
      postalCode: {
        type: String,
        required: true,
        trim: true,
      },
    },
    
    // Business Information
    businessType: {
      type: String,
      enum: ['manufacturer', 'wholesaler', 'distributor', 'exporter', 'supplier'],
      required: true,
    },
    industry: {
      type: String,
      required: true,
      trim: true,
    },
    specialization: [{
      type: String,
      trim: true,
    }],
    yearEstablished: {
      type: Number,
      required: true,
      min: 1900,
      max: new Date().getFullYear(),
    },
    employeeCount: {
      type: Number,
      required: true,
      min: 1,
    },
    
    // Contact Information
    primaryContact: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      position: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },
      phone: {
        type: String,
        required: true,
        trim: true,
      },
    },
    
    // Financial Information
    creditTerms: {
      type: String,
      required: true,
      trim: true,
    },
    paymentMethod: {
      type: String,
      enum: ['advance', 'net30', 'net60', 'net90', 'letter_of_credit'],
      required: true,
    },
    currency: {
      type: String,
      required: true,
      default: 'USD',
    },
    taxId: {
      type: String,
      required: true,
      trim: true,
    },
    
    // Quality & Certifications
    certifications: {
      iso9001: {
        type: Boolean,
        default: false,
      },
      iso14001: {
        type: Boolean,
        default: false,
      },
      fssai: {
        type: Boolean,
        default: false,
      },
      organic: {
        type: Boolean,
        default: false,
      },
      fairTrade: {
        type: Boolean,
        default: false,
      },
      other: [{
        type: String,
        trim: true,
      }],
    },
    
    // Product Information
    productCategories: [{
      type: Schema.Types.ObjectId,
      ref: 'Category',
    }],
    minimumOrderQuantity: {
      type: Number,
      required: true,
      min: 1,
    },
    leadTime: {
      type: Number,
      required: true,
      min: 1,
    },
    samplePolicy: {
      type: String,
      required: true,
      trim: true,
    },
    
    // Performance Metrics
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reliabilityScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    qualityScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    deliveryScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    
    // Status & Verification
    status: {
      type: String,
      enum: ['active', 'inactive', 'pending', 'suspended'],
      default: 'pending',
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verificationDate: {
      type: Date,
    },
    
    // Documents
    documents: {
      businessLicense: {
        type: String,
        trim: true,
      },
      taxCertificate: {
        type: String,
        trim: true,
      },
      qualityCertificates: [{
        type: String,
        trim: true,
      }],
      bankDetails: {
        type: String,
        trim: true,
      },
      other: [{
        type: String,
        trim: true,
      }],
    },
    
    // Notes & History
    notes: {
      type: String,
      trim: true,
    },
    tags: [{
      type: String,
      trim: true,
    }],
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
vendorSchema.index({ vendorCode: 1 });
vendorSchema.index({ email: 1 });
vendorSchema.index({ status: 1 });
vendorSchema.index({ businessType: 1 });
vendorSchema.index({ industry: 1 });
vendorSchema.index({ 'address.country': 1 });

// Virtual for full address
vendorSchema.virtual('fullAddress').get(function() {
  const addr = this.address;
  return `${addr.street}, ${addr.city}, ${addr.state} ${addr.postalCode}, ${addr.country}`;
});

// Method to calculate overall score
vendorSchema.methods.getOverallScore = function() {
  return Math.round((this.reliabilityScore + this.qualityScore + this.deliveryScore) / 3);
};

// Method to check if vendor is verified and active
vendorSchema.methods.isActiveAndVerified = function() {
  return this.status === 'active' && this.verified;
};

export const Vendor = mongoose.model<IVendor>('Vendor', vendorSchema); 