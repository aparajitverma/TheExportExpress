import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  description?: string;
  slug: string;
  parentCategory?: Types.ObjectId | ICategory;
  isActive: boolean;
  createdBy: Types.ObjectId; // Assuming User model exists and is referenced
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    parentCategory: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      default: null, // Explicitly null for top-level categories
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Ensure you have a User model
      required: true,
    },
  },
  {
    timestamps: true,
    // Consider a pre-save hook to auto-generate slug from name if not provided
    // or to ensure its uniqueness in a more robust way if needed.
  }
);

// Indexes for better query performance
// CategorySchema.index({ slug: 1 }); // Removed, unique:true on slug field creates this index
// CategorySchema.index({ name: 1 }); // Removed, unique:true on name field creates this index
CategorySchema.index({ parentCategory: 1, isActive: 1 });


// Method to generate slug (example, can be more sophisticated)
// CategorySchema.pre<ICategory>('save', async function (next) {
//   if (!this.slug) {
//     this.slug = this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
//   }
//   // Potentially check for slug uniqueness here and append a number if not unique
//   next();
// });

export const Category = mongoose.model<ICategory>('Category', CategorySchema);
 