import { Request, Response, NextFunction } from 'express';
import { Inquiry, IInquiry, InquiryStatus } from '../models/Inquiry';
import { Product } from '../models/Product';
import { NotFoundError, BadRequestError } from '../utils/ApiError';
import { sendSuccess, sendPaginatedSuccess } from '../utils/response';
import { Types } from 'mongoose';
import mongoose from 'mongoose';

// Create a new inquiry (Public)
export const createInquiry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { product, name, email, phone, companyName, message } = req.body;

    if (!product || !name || !email || !message) {
      return next(new BadRequestError('Product, Name, Email, and Message are required fields for an inquiry.'));
    }

    if (!Types.ObjectId.isValid(product)) {
        return next(new BadRequestError('Invalid Product ID format.'));
    }

    const productExists = await Product.findById(product);
    if (!productExists || !productExists.isActive) {
        return next(new NotFoundError('Product not found or is not active.'));
    }

    const inquiryData: Partial<IInquiry> = {
      product,
      name,
      email,
      phone,
      companyName,
      message,
      status: InquiryStatus.PENDING, // Default status
    };

    const newInquiry = await Inquiry.create(inquiryData);
    // TODO: Consider sending an email notification to admin and/or confirmation to user here
    sendSuccess(res, { data: newInquiry, message: 'Inquiry submitted successfully.' }, 201);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Validation Error: ' + error.message));
    }
    next(error);
  }
};

// Get all inquiries (Admin)
export const getAllInquiries = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 10, status, productId, sort = '-createdAt' } = req.query;
    const query: any = {};

    if (status) query.status = status as string;
    if (productId) query.product = new Types.ObjectId(productId as string);

    const inquiries = await Inquiry.find(query)
      .populate('product', 'name _id') // Populate product name
      .sort(sort as string)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));
      
    const total = await Inquiry.countDocuments(query);

    sendPaginatedSuccess(res, inquiries, Number(page), Number(limit), total);
  } catch (error) {
    next(error);
  }
};

// Get a single inquiry by ID (Admin)
export const getInquiryById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
        return next(new BadRequestError('Invalid Inquiry ID format.'));
    }
    const inquiry = await Inquiry.findById(id).populate('product', 'name _id sku'); // sku if you add it

    if (!inquiry) {
      return next(new NotFoundError('Inquiry not found'));
    }
    sendSuccess(res, inquiry);
  } catch (error) {
    next(error);
  }
};

// Update an inquiry (Admin - e.g., status, notes)
export const updateInquiry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (!Types.ObjectId.isValid(id)) {
        return next(new BadRequestError('Invalid Inquiry ID format.'));
    }

    const inquiryToUpdate = await Inquiry.findById(id);
    if (!inquiryToUpdate) {
      return next(new NotFoundError('Inquiry not found'));
    }

    if (status && !Object.values(InquiryStatus).includes(status as InquiryStatus)) {
        return next(new BadRequestError('Invalid status value.'));
    }

    const updateData: { status?: InquiryStatus; notes?: string } = {};
    if (status) updateData.status = status as InquiryStatus;
    if (notes !== undefined) updateData.notes = notes;

    if (Object.keys(updateData).length === 0) {
        return next(new BadRequestError('No update data provided (status or notes).'));
    }

    const updatedInquiry = await Inquiry.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true })
                                .populate('product', 'name _id');

    sendSuccess(res, { data: updatedInquiry, message: 'Inquiry updated successfully.' }, 200);
  } catch (error) {
     if (error instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Validation Error: ' + error.message));
    }
    next(error);
  }
};

// Delete an inquiry (Admin)
export const deleteInquiry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
        return next(new BadRequestError('Invalid Inquiry ID format.'));
    }

    const inquiry = await Inquiry.findByIdAndDelete(id);

    if (!inquiry) {
      return next(new NotFoundError('Inquiry not found'));
    }
    sendSuccess(res, { message: 'Inquiry deleted successfully' }); // Status code 200 is default
  } catch (error) {
    next(error);
  }
}; 