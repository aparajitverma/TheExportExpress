import { Request, Response, NextFunction } from 'express';
import { Category, ICategory } from '../models/Category';
import { NotFoundError, BadRequestError } from '../utils/ApiError';
import { sendSuccess, sendPaginatedSuccess } from '../utils/response';
import { IUserDocument } from '../models/User'; // Assuming req.user is of this type
const slugify = require('slugify'); // Changed to require
import { Types } from 'mongoose'; // Import Types

// Create a new category
export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  console.log('[createCategory] Received request body:', req.body); // Added: Log incoming request body
  console.log('[createCategory] Authenticated user (req.user):', req.user);
  try {
    const { name, description, parentCategory } = req.body;
    const user = req.user as IUserDocument;

    if (!user || !user._id) {
      console.error('[createCategory] Error: User not found on request object or user._id is missing.');
      return next(new BadRequestError('User authentication data is missing. Cannot set createdBy.'));
    }

    if (!name || name.trim() === '') { // Added trim() for robustness
      console.error('[createCategory] Error: Category name is empty or missing.');
      return next(new BadRequestError('Category name is required and cannot be empty')); // Updated error message
    }

    const slug = slugify(name, { lower: true, strict: true });
    console.log(`[createCategory] Generated slug for "${name}": "${slug}"`); // Added: Log generated slug

    if (!slug) { // Check if slug generation resulted in an empty string
        console.error(`[createCategory] Error: Slug generation for name "${name}" resulted in an empty slug.`);
        return next(new BadRequestError('Failed to generate a valid slug from the category name. Name might contain only special characters not allowed in slug.'));
    }

    // Check if slug already exists
    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      console.warn(`[createCategory] Warning: Category with slug "${slug}" already exists (ID: ${existingCategory._id}).`);
      return next(new BadRequestError('Category with this name (slug) already exists'));
    }

    const categoryData: Partial<ICategory> = {
      name,
      description,
      slug,
      createdBy: user._id as Types.ObjectId, 
    };

    if (parentCategory) {
      const parent = await Category.findById(parentCategory);
      if (!parent || !parent.isActive) {
        throw new BadRequestError('Parent category not found or is inactive');
      }
      categoryData.parentCategory = parent._id as Types.ObjectId; // Explicitly cast
    }

    const category = await Category.create(categoryData);
    sendSuccess(res, category, 201);
  } catch (error) {
    next(error);
  }
};

// Get all categories (active by default)
export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 10, parentId, includeInactive = 'false' } = req.query;
    const query: any = {};

    if (includeInactive !== 'true') {
      query.isActive = true;
    }

    if (parentId) {
      query.parentCategory = parentId as string; // Assuming parentId from query is string
    } else {
      // Optionally, to fetch only top-level categories if no parentId is specified:
      // query.parentCategory = null;
    }

    const categories = await Category.find(query)
      .populate('parentCategory', 'name slug') // Populate parent category details
      .populate('createdBy', 'name email') // Populate creator details
      .sort({ name: 1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));
      
    const total = await Category.countDocuments(query);

    sendPaginatedSuccess(res, categories, Number(page), Number(limit), total);
  } catch (error) {
    next(error);
  }
};

// Get a single category by ID or slug
export const getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, slug } = req.params;
    let category;

    if (id) {
      category = await Category.findById(id).populate('createdBy', 'name email');
    } else if (slug) {
      category = await Category.findOne({ slug }).populate('createdBy', 'name email');
    } else {
      throw new BadRequestError('Category ID or slug is required');
    }

    if (!category) {
      throw new NotFoundError('Category not found');
    }
    sendSuccess(res, category);
  } catch (error) {
    next(error);
  }
};

// Update a category
export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, description, parentCategory, isActive } = req.body;
    const user = req.user as IUserDocument; // For tracking who updated, if needed

    const categoryToUpdate = await Category.findById(id);
    if (!categoryToUpdate) {
      throw new NotFoundError('Category not found');
    }

    const updateData: any = {}; // Use any for flexibility, or a more specific Partial<ICategory>

    if (name && name !== categoryToUpdate.name) {
      updateData.name = name;
      updateData.slug = slugify(name, { lower: true, strict: true });
      if (updateData.slug !== categoryToUpdate.slug) {
        const existingCategory = await Category.findOne({ slug: updateData.slug, _id: { $ne: id } });
        if (existingCategory) {
          throw new BadRequestError('Another category with this name (slug) already exists');
        }
      }
    }
    if (description !== undefined) updateData.description = description;
    if (isActive !== undefined) updateData.isActive = isActive;

    if (parentCategory !== undefined) {
      if (parentCategory === null || parentCategory === '') {
        updateData.parentCategory = null;
      } else {
        if (parentCategory.toString() === id) {
          throw new BadRequestError('Category cannot be its own parent.');
        }
        const parent = await Category.findById(parentCategory);
        if (!parent || !parent.isActive) {
          throw new BadRequestError('Parent category not found or is inactive');
        }
        updateData.parentCategory = parent._id as Types.ObjectId; // Explicitly cast
      }
    }

    // Add updatedBy field if you have one in your schema
    // updateData.updatedBy = user._id;

    const updatedCategory = await Category.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true })
                                  .populate('parentCategory', 'name slug')
                                  .populate('createdBy', 'name email');

    sendSuccess(res, updatedCategory);
  } catch (error) {
    next(error);
  }
};

// Delete a category (soft delete)
export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    // Ensure it's a valid ObjectId before attempting to update
    if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestError('Invalid category ID format');
    }
    const category = await Category.findByIdAndUpdate(id, { isActive: false }, { new: true });

    if (!category) {
      throw new NotFoundError('Category not found');
    }
    // Consider implications: what happens to products using this category? Deactivate them? Reassign?
    // For now, just soft delete the category.
    sendSuccess(res, { message: 'Category deactivated successfully' });
  } catch (error) {
    next(error);
  }
}; 