import { body, param, query } from 'express-validator';

export const createProductValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('shortDescription').trim().notEmpty().withMessage('Short description is required'),
  body('specifications').optional().isObject().withMessage('Specifications must be an object'),
  body('images').isArray({ min: 1 }).withMessage('At least one image is required'),
  body('images.*').isURL().withMessage('Invalid image URL'),
  body('certifications').optional().isArray().withMessage('Certifications must be an array'),
  body('packagingOptions').optional().isArray().withMessage('Packaging options must be an array'),
  body('origin').trim().notEmpty().withMessage('Origin is required'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
];

export const updateProductValidation = [
  param('id').isMongoId().withMessage('Invalid product ID'),
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('category').optional().trim().notEmpty().withMessage('Category cannot be empty'),
  body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
  body('shortDescription').optional().trim().notEmpty().withMessage('Short description cannot be empty'),
  body('specifications').optional().isObject().withMessage('Specifications must be an object'),
  body('images').optional().isArray({ min: 1 }).withMessage('At least one image is required'),
  body('images.*').optional().isURL().withMessage('Invalid image URL'),
  body('certifications').optional().isArray().withMessage('Certifications must be an array'),
  body('packagingOptions').optional().isArray().withMessage('Packaging options must be an array'),
  body('origin').optional().trim().notEmpty().withMessage('Origin cannot be empty'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
];

export const getProductValidation = [
  param('id').isMongoId().withMessage('Invalid product ID'),
];

export const listProductsValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('category').optional().trim().isString().withMessage('Category must be a string'),
  query('search').optional().trim().isString().withMessage('Search query must be a string'),
]; 