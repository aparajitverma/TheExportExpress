import { body, param, query } from 'express-validator';
import { InquiryStatus } from '../types/inquiry';

export const createInquiryValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('company').trim().notEmpty().withMessage('Company is required'),
  body('country').trim().notEmpty().withMessage('Country is required'),
  body('message').trim().notEmpty().withMessage('Message is required'),
  body('productId').optional().isMongoId().withMessage('Invalid product ID'),
];

export const updateInquiryValidation = [
  param('id').isMongoId().withMessage('Invalid inquiry ID'),
  body('status')
    .optional()
    .isIn(Object.values(InquiryStatus))
    .withMessage('Invalid status'),
  body('notes').optional().trim().isString().withMessage('Notes must be a string'),
];

export const getInquiryValidation = [
  param('id').isMongoId().withMessage('Invalid inquiry ID'),
];

export const listInquiriesValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('status')
    .optional()
    .isIn(Object.values(InquiryStatus))
    .withMessage('Invalid status'),
  query('productId').optional().isMongoId().withMessage('Invalid product ID'),
]; 