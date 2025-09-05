// The ProductCategory enum is being replaced by dynamic categories from the database.
// If this enum is used for other purposes, it might need to be kept or refactored.
// For now, it's removed as product categories are dynamic.
/*
export enum ProductCategory {
  SPICES = 'Spices',
  TEA_COFFEE = 'Tea & Coffee',
  GRAINS_PULSES = 'Grains & Pulses',
  FRUITS_VEGETABLES = 'Fruits & Vegetables',
  TEXTILES_APPAREL = 'Textiles & Apparel',
  HANDICRAFTS_ART = 'Handicrafts & Art',
  HERBAL_AYURVEDIC = 'Herbal & Ayurvedic Products',
  MACHINERY_EQUIPMENT = 'Machinery & Equipment',
  OTHER = 'Other',
}
*/

// Interface for how a category might be populated (e.g., when fetching a product)
export interface PopulatedCategory {
  _id: string; 
  name: string;
  slug?: string;
  // other category fields if needed
}

export interface Product {
  _id?: string; 
  name: string;
  description: string;
  shortDescription: string;
  productCode?: string;
  // Category will now store the ID of the category document or the populated category object.
  // When sending data to backend for create/update, this should be the category ID (string).
  // When fetching data from backend, this might be a PopulatedCategory object.
  category: string | PopulatedCategory; 
  origin: string;
  images: string[];
  price?: number | string;
  unit?: string;
  specifications: Record<string, string>; 
  certifications: string[];
  packagingOptions: string[];
  isActive?: boolean;
  createdBy?: string; 
  createdAt?: Date;
  updatedAt?: Date;
} 