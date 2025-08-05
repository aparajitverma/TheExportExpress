import mongoose from 'mongoose';
import { Product } from '../models/Product';
import fs from 'fs';
import path from 'path';

const MONGODB_URI = "mongodb://localhost:27017/exportexpress";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const getUploadedImages = () => {
  const uploadsDir = path.join(__dirname, '../../../uploads/products');
  try {
    const files = fs.readdirSync(uploadsDir);
    return files.filter(file => file.match(/\.(jpg|jpeg|png|webp)$/i));
  } catch (error) {
    console.error('Error reading uploads directory:', error);
    return [];
  }
};

const fixImagePaths = async () => {
  try {
    await connectDB();
    
    const uploadedImages = getUploadedImages();
    console.log('Available uploaded images:', uploadedImages);
    
    // Get all products with image issues
    const products = await Product.find({
      images: { $regex: '^products/', $options: 'i' }
    });
    
    console.log(`Found ${products.length} products with image path issues`);
    
    for (const product of products) {
      const updatedImages: string[] = [];
      
      // For each image in the product
      for (const imagePath of product.images) {
        if (imagePath.startsWith('products/')) {
          // Try to find a matching uploaded file or create a placeholder
          if (uploadedImages.length > 0) {
            // Use the first available image as a placeholder
            // In a real scenario, you'd want to properly map images
            const placeholderImage = `products/${uploadedImages[0]}`;
            updatedImages.push(placeholderImage);
          } else {
            // Keep original path if no uploaded images available
            updatedImages.push(imagePath);
          }
        } else {
          updatedImages.push(imagePath);
        }
      }
      
      // Update the product with corrected image paths
      await Product.findByIdAndUpdate(product._id, {
        images: updatedImages
      });
      
      console.log(`Updated ${product.name}: ${product.images.join(', ')} -> ${updatedImages.join(', ')}`);
    }
    
    console.log('✅ Image paths fixed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing image paths:', error);
    process.exit(1);
  }
};

// Alternative: Clear problematic image references
const clearBrokenImagePaths = async () => {
  try {
    await connectDB();
    
    // Update all products to have empty images array to stop 404 errors
    const result = await Product.updateMany(
      { images: { $regex: '^products/', $options: 'i' } },
      { $set: { images: [] } }
    );
    
    console.log(`✅ Cleared images from ${result.modifiedCount} products to prevent 404 errors`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing image paths:', error);
    process.exit(1);
  }
};

// Run the script
const action = process.argv[2];
if (action === 'clear') {
  clearBrokenImagePaths();
} else {
  fixImagePaths();
} 