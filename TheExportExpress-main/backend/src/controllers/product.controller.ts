import { Request, Response, NextFunction } from 'express';
import { Product } from '../models/Product';
import { IProductCreate, IProductUpdate } from '../types/product';
import { NotFoundError, BadRequestError } from '../utils/ApiError';
import { sendSuccess, sendPaginatedSuccess } from '../utils/response';
import mongoose from 'mongoose';

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description, shortDescription, category, origin, certifications, packagingOptions } = req.body;
    let specifications = {};

    // Parse specifications if it's a string
    if (req.body.specifications && typeof req.body.specifications === 'string') {
      try {
        specifications = JSON.parse(req.body.specifications);
      } catch (parseError) {
        return next(new BadRequestError('Invalid specifications JSON string'));
      }
    } else if (req.body.specifications) {
      // If it's already an object (e.g. if not using FormData for some reason, though unlikely here)
      specifications = req.body.specifications;
    }

    // Handle uploaded images
    let images: string[] = [];
    if (req.files && Array.isArray(req.files)) {
      images = (req.files as Express.Multer.File[]).map(file => `products/${file.filename}`);
    }

    // Basic validation (can be expanded with a validation library)
    if (!name || name.trim() === '' || 
        !description || description.trim() === '' || 
        !shortDescription || shortDescription.trim() === '' || 
        !category || category.trim() === '' || // Assuming category is also a string that needs to be non-empty
        !origin || origin.trim() === '') {
      return next(new BadRequestError('Missing or empty required product fields: name, description, shortDescription, category, origin'));
    }

    const productData = {
      name,
      description,
      shortDescription,
      category,
      origin,
      specifications,
      images,
      certifications: Array.isArray(certifications) ? certifications : (certifications ? [certifications] : []),
      packagingOptions: Array.isArray(packagingOptions) ? packagingOptions : (packagingOptions ? [packagingOptions] : []),
      // shortDescription and isActive can be added if sent, or defaulted in model/here
    };

    const product = await Product.create(productData);
    // Populate category after creation to return the full object, or re-fetch
    const populatedProduct = await Product.findById(product._id).populate('category', 'name _id slug');
    sendSuccess(res, populatedProduct, 201);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestError('Invalid product ID format');
    }
    
    const { name, description, shortDescription, category, origin, certifications, packagingOptions } = req.body;
    let specifications = {};
    let updatedImages: string[] | undefined = undefined;

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      throw new NotFoundError('Product not found');
    }

    // Parse specifications if it's a string
    if (req.body.specifications && typeof req.body.specifications === 'string') {
      try {
        specifications = JSON.parse(req.body.specifications);
      } catch (parseError) {
        return next(new BadRequestError('Invalid specifications JSON string'));
      }
    } else if (req.body.specifications) {
      specifications = req.body.specifications; 
    } else {
      specifications = existingProduct.specifications; // Keep existing if not provided
    }

    // Handle uploaded images
    // If new images are uploaded, they replace old ones.
    // If no new images are uploaded, old images are kept.
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      updatedImages = (req.files as Express.Multer.File[]).map(file => `products/${file.filename}`);
    }

    // Type assertion might be needed if IProductUpdate expects string for category
    const productData: any = { // Using any for productData to avoid TS errors during transition
      name: name || existingProduct.name,
      description: description || existingProduct.description,
      shortDescription: shortDescription || existingProduct.shortDescription,
      category: category || existingProduct.category,
      origin: origin || existingProduct.origin,
      specifications,
      certifications: Array.isArray(certifications) ? certifications : (certifications ? [certifications] : existingProduct.certifications),
      packagingOptions: Array.isArray(packagingOptions) ? packagingOptions : (packagingOptions ? [packagingOptions] : existingProduct.packagingOptions),
    };

    if (updatedImages) {
      productData.images = updatedImages;
      // TODO: Optionally delete old images from storage if they are replaced
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: productData },
      { new: true, runValidators: true }
    ).populate('category', 'name _id slug'); // Populate after update

    if (!updatedProduct) {
      throw new NotFoundError('Product not found after update attempt');
    }

    sendSuccess(res, updatedProduct);
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestError('Invalid product ID format');
    }
    
    const product = await Product.findOne({
      _id: id,
      isActive: true,
    }).populate('category', 'name _id slug'); // Populate category
    
    if (!product) {
      throw new NotFoundError('Product not found');
    }

    sendSuccess(res, product);
  } catch (error) {
    next(error);
  }
};

export const listProducts = async (
  req: Request<{}, {}, {}, {
    page?: string;
    limit?: string;
    category?: string; // Assuming this is category ID for filtering
    search?: string;
    isActive?: string; // Allow filtering by isActive status
  }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '10', 10);
    const skip = (page - 1) * limit;

    const query: any = {};
    // Handle isActive query param: true, false, or all (undefined)
    if (req.query.isActive === 'true') {
      query.isActive = true;
    } else if (req.query.isActive === 'false') {
      query.isActive = false;
    } // If undefined, no isActive filter is applied (fetches both active and inactive)

    if (req.query.category) {
      // Assuming req.query.category is an ID. If it's a slug, you'd need to fetch Category by slug first.
      // e.g., const categoryDoc = await Category.findOne({ slug: req.query.category }).select('_id');
      // if (categoryDoc) query.category = categoryDoc._id;
      query.category = req.query.category; 
    }

    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'name _id slug') // Populate category
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Product.countDocuments(query),
    ]);

    sendPaginatedSuccess(res, products, page, limit, total);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestError('Invalid product ID format');
    }
    
    const product = await Product.findByIdAndUpdate(
      id,
      { isActive: false }, // Soft delete
      { new: true }
    );

    if (!product) {
      throw new NotFoundError('Product not found');
    }
    // No need to send the product back, just a success message for delete
    sendSuccess(res, { message: 'Product soft deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Re-use listProducts logic for consistency
    // This forwards the request to the more advanced listProducts handler
    return listProducts(req, res, next);
  } catch (error) {
    next(error);
  }
}; 