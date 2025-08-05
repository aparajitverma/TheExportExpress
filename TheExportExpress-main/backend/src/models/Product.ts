import mongoose, { Schema, Document, Types } from 'mongoose';
// import { ProductCategory } from '../types/product'; // Removed: ProductCategory enum is no longer used here

// Forward declaration or import of ICategory if needed for population type, but for schema ref string is enough
// For now, we will use Types.ObjectId for the type in IProduct interface.

export interface IProduct extends Document {
  name: string;
  description: string;
  shortDescription: string;
  category: Types.ObjectId; // Changed from ProductCategory to Types.ObjectId
  specifications: Record<string, string>;
  images: string[];
  certifications: string[];
  packagingOptions: string[];
  origin: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  // createdBy: Types.ObjectId; // Consider adding this if products are user-specific
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId, // Changed to ObjectId
      ref: 'Category', // Added reference to Category model
      required: true,
      // enum: Object.values(ProductCategory), // Removed enum validation
    },
    specifications: {
      type: Map,
      of: String,
      default: {},
    },
    images: {
      type: [String],
      default: [],
    },
    certifications: {
      type: [String],
      default: [],
    },
    packagingOptions: {
      type: [String],
      default: [],
    },
    origin: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    /* Consider adding createdBy field
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false, // or true, depending on your logic
    }, */
  },
  {
    timestamps: true,
  }
);

// Add text index for search functionality
productSchema.index({
  name: 'text',
  description: 'text',
  shortDescription: 'text',
});

// Add compound index for category and isActive
// This index is still valid and useful, now with ObjectId for category
productSchema.index({ category: 1, isActive: 1 });

export const Product = mongoose.model<IProduct>('Product', productSchema); 