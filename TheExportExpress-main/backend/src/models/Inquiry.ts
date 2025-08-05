import mongoose, { Schema, Document, Types } from 'mongoose';

export enum InquiryStatus {
  PENDING = 'Pending',
  CONTACTED = 'Contacted',
  RESOLVED = 'Resolved',
  SPAM = 'Spam',
}

export interface IInquiry extends Document {
  product: Types.ObjectId; // Reference to Product model
  name: string;
  email: string;
  phone?: string;
  companyName?: string;
  message: string;
  status: InquiryStatus;
  notes?: string; // Admin notes
  createdAt: Date;
  updatedAt: Date;
}

const InquirySchema: Schema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      // Basic email validation, more robust validation can be added
      match: [/^\S+@\S+\.\S+$/, 'Please fill a valid email address'],
    },
    phone: {
      type: String,
      trim: true,
    },
    companyName: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(InquiryStatus),
      default: InquiryStatus.PENDING,
      required: true,
    },
    notes: {
        type: String,
        trim: true,
    }
  },
  {
    timestamps: true,
  }
);

InquirySchema.index({ product: 1, createdAt: -1 });
InquirySchema.index({ status: 1, createdAt: -1 });
InquirySchema.index({ email: 1 });

export const Inquiry = mongoose.model<IInquiry>('Inquiry', InquirySchema); 