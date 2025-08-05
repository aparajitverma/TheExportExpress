// ProductCategory enum is removed as categories are now dynamic and referenced by ObjectId (string)
/*
export enum ProductCategory {
  SPICES = 'Spices',
  GEMS = 'Gems',
  AGRICULTURE = 'Agriculture',
  AYURVEDIC_PRODUCTS = 'Ayurvedic Products',
  TEXTILES = 'Textiles',
  HANDICRAFTS = 'Handicrafts',
  JEWELRY = 'Jewelry',
  LEATHER = 'Leather'
}
*/

import { Types } from 'mongoose'; // For ObjectId type if needed, but string is generally used for API contracts

export interface IProduct {
  _id: string | Types.ObjectId; // Allowing string for API, Types.ObjectId for Mongoose internal
  name: string;
  category: string | Types.ObjectId; // Category is now an ObjectId string from API, or ObjectId internally
  description: string;
  shortDescription: string;
  specifications: {
    [key: string]: string;
  };
  images: string[];
  certifications: string[];
  packagingOptions: string[];
  origin: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProductCreate {
  name: string;
  description: string;
  shortDescription: string;
  category: string; // Expecting category ObjectId as string from request body
  specifications: Record<string, string>; // Ensure this is Record for consistency
  images?: string[]; // Optional as images come from req.files
  certifications?: string[];
  packagingOptions?: string[];
  origin: string;
}

export interface IProductUpdate extends Partial<Omit<IProductCreate, 'images'>> { // Omit images as they are handled separately
  isActive?: boolean;
  images?: string[]; // Allow images to be updated
} 