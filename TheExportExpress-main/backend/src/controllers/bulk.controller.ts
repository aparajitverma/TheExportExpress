import { Request, Response, NextFunction } from 'express';
import { Category, ICategory } from '../models/Category';
import { Product, IProduct } from '../models/Product';
import { BadRequestError } from '../utils/ApiError';
import { sendSuccess } from '../utils/response';
import { IUserDocument } from '../models/User';
import slugify from 'slugify';
import csv from 'csv-parser';
import * as fs from 'fs';
import { Readable } from 'stream';
import { Types, Document } from 'mongoose';

interface CsvRow {
  [key: string]: string;
}

// Extend the IUserDocument to include _id
interface IUserDocumentWithId extends IUserDocument {
  _id: Types.ObjectId;
}

interface ImportResult<T> {
  message: string;
  summary: {
    total: number;
    success: number;
    errors: number;
  };
  results: T[];
  errors: Array<{ row: CsvRow; error: string }>;
}

// Process CSV file and return parsed rows
const parseCSV = async (filePath: string): Promise<CsvRow[]> => {
  return new Promise((resolve, reject) => {
    const rows: CsvRow[] = [];
    const stream = fs.createReadStream(filePath);
    
    stream
      .pipe(csv())
      .on('data', (row: CsvRow) => rows.push(row))
      .on('end', () => resolve(rows))
      .on('error', (error) => reject(error));
  });
};

// Bulk import categories from CSV
export const bulkImportCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.file) {
    throw new BadRequestError('CSV file is required');
  }

  if (!req.file.mimetype.includes('csv') && !req.file.originalname.endsWith('.csv')) {
    throw new BadRequestError('File must be a CSV');
  }

  const user = req.user as IUserDocumentWithId;
  const results: ICategory[] = [];
  const errors: Array<{ row: CsvRow; error: string }> = [];
  let successCount = 0;
  let errorCount = 0;

  try {
    // Parse CSV file
    const rows = await parseCSV(req.file.path);
    
    // Process each row sequentially
    for (const row of rows) {
      try {
        const { name, description, parentCategory } = row;
        
        if (!name?.trim()) {
          errors.push({ row, error: 'Category name is required' });
          errorCount++;
          continue;
        }

        const slug = slugify(name, { lower: true, strict: true });
        
        // Check if category already exists
        const existingCategory = await Category.findOne({ slug });
        if (existingCategory) {
          errors.push({ row, error: 'Category with this name already exists' });
          errorCount++;
          continue;
        }

        // Create base category data
        const baseCategoryData = {
          name: name.trim(),
          description: description?.trim() || '',
          slug,
          createdBy: user._id,
          isActive: true
        };

        // Handle parent category if provided
        if (parentCategory?.trim()) {
          const parent = await Category.findOne({ 
            $or: [
              { name: parentCategory.trim() },
              { slug: slugify(parentCategory.trim(), { lower: true, strict: true }) }
            ]
          });
          
          if (parent) {
            // Create category with parent
            const category = await Category.create({
              ...baseCategoryData,
              parentCategory: parent._id
            });
            results.push(category);
          } else {
            errors.push({ row, error: `Parent category "${parentCategory}" not found` });
            errorCount++;
            continue;
          }
        } else {
          // Create category without parent
          const category = await Category.create(baseCategoryData);
          results.push(category);
        }
        successCount++;

      } catch (error) {
        errors.push({ 
          row, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
        errorCount++;
      }
    }

    const result: ImportResult<ICategory> = {
      message: 'Bulk import completed',
      summary: {
        total: successCount + errorCount,
        success: successCount,
        errors: errorCount
      },
      results,
      errors
    };

    sendSuccess(res, result);

  } catch (error) {
    next(error);
  } finally {
    // Clean up uploaded file
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
  }
};

// Bulk import products from CSV
export const bulkImportProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.file) {
    throw new BadRequestError('CSV file is required');
  }

  if (!req.file.mimetype.includes('csv') && !req.file.originalname.endsWith('.csv')) {
    throw new BadRequestError('File must be a CSV');
  }

  const results: IProduct[] = [];
  const errors: Array<{ row: CsvRow; error: string }> = [];
  let successCount = 0;
  let errorCount = 0;

  try {
    // Parse CSV file
    const rows = await parseCSV(req.file.path);
    
    // Process each row sequentially
    for (const row of rows) {
      try {
        const { 
          name, 
          description, 
          shortDescription, 
          category, 
          origin, 
          specifications,
          certifications,
          packagingOptions 
        } = row;
        
        // Validate required fields
        if (!name?.trim()) {
          errors.push({ row, error: 'Product name is required' });
          errorCount++;
          continue;
        }

        if (!description?.trim()) {
          errors.push({ row, error: 'Product description is required' });
          errorCount++;
          continue;
        }

        if (!category?.trim()) {
          errors.push({ row, error: 'Category is required' });
          errorCount++;
          continue;
        }

        // Find category by name or slug
        const categoryDoc = await Category.findOne({
          $or: [
            { name: category.trim() },
            { slug: slugify(category.trim(), { lower: true, strict: true }) }
          ],
          isActive: true
        });

        if (!categoryDoc) {
          errors.push({ row, error: `Category "${category}" not found` });
          errorCount++;
          continue;
        }

        // Parse specifications into a plain object
        let parsedSpecifications: Record<string, string> = {};
        if (specifications) {
          try {
            const specs = JSON.parse(specifications);
            if (typeof specs === 'object' && specs !== null) {
              Object.entries(specs).forEach(([key, value]) => {
                if (typeof value === 'string') {
                  parsedSpecifications[key] = value;
                }
              });
            }
          } catch (error) {
            errors.push({ row, error: 'Invalid specifications format. Must be valid JSON.' });
            errorCount++;
            continue;
          }
        }

        // Parse certifications and packaging options
        const parsedCertifications = certifications
          ? certifications.split(',').map(cert => cert.trim()).filter(Boolean)
          : [];
        
        const parsedPackagingOptions = packagingOptions
          ? packagingOptions.split(',').map(opt => opt.trim()).filter(Boolean)
          : [];

        // Create product with proper typing according to IProduct interface
        const productData = {
          name: name.trim(),
          description: description.trim(),
          shortDescription: shortDescription?.trim() || description.trim().substring(0, 100),
          category: categoryDoc._id,
          origin: origin?.trim() || 'India',
          specifications: parsedSpecifications,
          certifications: parsedCertifications,
          packagingOptions: parsedPackagingOptions,
          images: [],
          isActive: true
        };

        const product = await Product.create(productData);
        const populatedProduct = await Product.findById(product._id)
          .populate('category', 'name _id slug')
          .lean();
          
        if (populatedProduct) {
          results.push(populatedProduct);
          successCount++;
        }

      } catch (error) {
        errors.push({ 
          row, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
        errorCount++;
      }
    }

    const result: ImportResult<IProduct> = {
      message: 'Bulk import completed',
      summary: {
        total: successCount + errorCount,
        success: successCount,
        errors: errorCount
      },
      results,
      errors
    };

    sendSuccess(res, result);

  } catch (error) {
    next(error);
  } finally {
    // Clean up uploaded file
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
  }
};

// Get CSV template for categories
export const getCategoryTemplate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const template = [
      {
        name: 'Spices',
        description: 'Aromatic spices from around the world',
        parentCategory: ''
      },
      {
        name: 'Textiles',
        description: 'High-quality fabrics and textiles',
        parentCategory: ''
      },
      {
        name: 'Handicrafts',
        description: 'Hand-made decorative items',
        parentCategory: ''
      }
    ];

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="categories_template.csv"');
    
    // Create CSV header
    const csvHeader = 'name,description,parentCategory\n';
    const csvData = template.map(row => 
      `"${row.name}","${row.description}","${row.parentCategory}"`
    ).join('\n');
    
    res.send(csvHeader + csvData);

  } catch (error) {
    next(error);
  }
};

// Get CSV template for products
export const getProductTemplate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const template = [
      {
        name: 'Premium Kashmiri Saffron',
        description: 'Highest grade saffron from Kashmir valley with distinct aroma and flavor',
        shortDescription: 'Premium grade Kashmiri saffron',
        category: 'Spices',
        origin: 'Kashmir, India',
        specifications: '{"Grade": "Premium", "Color": "Deep Red", "Packaging Size": "1g, 5g, 10g"}',
        certifications: 'ISO 22000:2018, FSSAI, Organic Certified',
        packagingOptions: 'Premium Glass Bottle, Vacuum Sealed Pouch, Bulk Packaging'
      },
      {
        name: 'Handwoven Pashmina Shawl',
        description: 'Exquisitely handwoven Pashmina shawls made from the finest Cashmere wool',
        shortDescription: 'Traditional Kashmiri Pashmina shawl',
        category: 'Textiles',
        origin: 'Kashmir, India',
        specifications: '{"Material": "100% Pashmina", "Weave": "Hand Woven", "Size": "200x100 cm"}',
        certifications: 'Handmade Certified, Woolmark',
        packagingOptions: 'Premium Box, Tissue Wrapped, Gift Packaging'
      }
    ];

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="products_template.csv"');
    
    // Create CSV header
    const csvHeader = 'name,description,shortDescription,category,origin,specifications,certifications,packagingOptions\n';
    const csvData = template.map(row => 
      `"${row.name}","${row.description}","${row.shortDescription}","${row.category}","${row.origin}","${row.specifications}","${row.certifications}","${row.packagingOptions}"`
    ).join('\n');
    
    res.send(csvHeader + csvData);

  } catch (error) {
    next(error);
  }
}; 