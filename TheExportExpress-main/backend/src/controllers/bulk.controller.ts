import { Request, Response, NextFunction } from 'express';
import { Category } from '../models/Category';
import { Product } from '../models/Product';
import { BadRequestError, NotFoundError } from '../utils/ApiError';
import { sendSuccess } from '../utils/response';
import { IUserDocument } from '../models/User';
import slugify from 'slugify';
import { Types } from 'mongoose';
import * as csv from 'csv-parser';
import * as fs from 'fs';

// Bulk import categories from CSV
export const bulkImportCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user as IUserDocument;
    
    if (!req.file) {
      throw new BadRequestError('CSV file is required');
    }

    if (!req.file.mimetype.includes('csv') && !req.file.originalname.endsWith('.csv')) {
      throw new BadRequestError('File must be a CSV');
    }

    const results: any[] = [];
    const errors: any[] = [];
    let successCount = 0;
    let errorCount = 0;

    // Read CSV file
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', async (data) => {
        try {
          const { name, description, parentCategory } = data;
          
          if (!name || name.trim() === '') {
            errors.push({ row: data, error: 'Category name is required' });
            errorCount++;
            return;
          }

          const slug = slugify(name, { lower: true, strict: true });
          
          // Check if category already exists
          const existingCategory = await Category.findOne({ slug });
          if (existingCategory) {
            errors.push({ row: data, error: 'Category with this name already exists' });
            errorCount++;
            return;
          }

          const categoryData: any = {
            name: name.trim(),
            description: description ? description.trim() : '',
            slug,
            createdBy: user._id,
            isActive: true
          };

          // Handle parent category if provided
          if (parentCategory && parentCategory.trim() !== '') {
            const parent = await Category.findOne({ 
              $or: [
                { name: parentCategory.trim() },
                { slug: slugify(parentCategory.trim(), { lower: true, strict: true }) }
              ]
            });
            
            if (parent) {
              categoryData.parentCategory = parent._id;
            } else {
              errors.push({ row: data, error: `Parent category "${parentCategory}" not found` });
              errorCount++;
              return;
            }
          }

          const category = await Category.create(categoryData);
          results.push(category);
          successCount++;

        } catch (error) {
          errors.push({ row: data, error: error.message });
          errorCount++;
        }
      })
      .on('end', () => {
        // Clean up uploaded file
        fs.unlinkSync(req.file.path);
        
        sendSuccess(res, {
          message: 'Bulk import completed',
          summary: {
            total: successCount + errorCount,
            success: successCount,
            errors: errorCount
          },
          results,
          errors
        });
      })
      .on('error', (error) => {
        // Clean up uploaded file
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        next(new BadRequestError(`Error processing CSV: ${error.message}`));
      });

  } catch (error) {
    next(error);
  }
};

// Bulk import products from CSV
export const bulkImportProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user as IUserDocument;
    
    if (!req.file) {
      throw new BadRequestError('CSV file is required');
    }

    if (!req.file.mimetype.includes('csv') && !req.file.originalname.endsWith('.csv')) {
      throw new BadRequestError('File must be a CSV');
    }

    const results: any[] = [];
    const errors: any[] = [];
    let successCount = 0;
    let errorCount = 0;

    // Read CSV file
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', async (data) => {
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
          } = data;
          
          if (!name || name.trim() === '') {
            errors.push({ row: data, error: 'Product name is required' });
            errorCount++;
            return;
          }

          if (!description || description.trim() === '') {
            errors.push({ row: data, error: 'Product description is required' });
            errorCount++;
            return;
          }

          if (!category || category.trim() === '') {
            errors.push({ row: data, error: 'Category is required' });
            errorCount++;
            return;
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
            errors.push({ row: data, error: `Category "${category}" not found` });
            errorCount++;
            return;
          }

          // Parse specifications if provided
          let parsedSpecifications = {};
          if (specifications && specifications.trim() !== '') {
            try {
              parsedSpecifications = JSON.parse(specifications);
            } catch (parseError) {
              errors.push({ row: data, error: 'Invalid specifications JSON format' });
              errorCount++;
              return;
            }
          }

          // Parse certifications and packaging options
          const parsedCertifications = certifications ? 
            certifications.split(',').map((cert: string) => cert.trim()).filter(Boolean) : [];
          
          const parsedPackagingOptions = packagingOptions ? 
            packagingOptions.split(',').map((option: string) => option.trim()).filter(Boolean) : [];

          const productData = {
            name: name.trim(),
            description: description.trim(),
            shortDescription: shortDescription ? shortDescription.trim() : description.trim().substring(0, 100),
            category: categoryDoc._id,
            origin: origin ? origin.trim() : 'India',
            specifications: parsedSpecifications,
            certifications: parsedCertifications,
            packagingOptions: parsedPackagingOptions,
            images: [],
            isActive: true
          };

          const product = await Product.create(productData);
          const populatedProduct = await Product.findById(product._id).populate('category', 'name _id slug');
          results.push(populatedProduct);
          successCount++;

        } catch (error) {
          errors.push({ row: data, error: error.message });
          errorCount++;
        }
      })
      .on('end', () => {
        // Clean up uploaded file
        fs.unlinkSync(req.file.path);
        
        sendSuccess(res, {
          message: 'Bulk import completed',
          summary: {
            total: successCount + errorCount,
            success: successCount,
            errors: errorCount
          },
          results,
          errors
        });
      })
      .on('error', (error) => {
        // Clean up uploaded file
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        next(new BadRequestError(`Error processing CSV: ${error.message}`));
      });

  } catch (error) {
    next(error);
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