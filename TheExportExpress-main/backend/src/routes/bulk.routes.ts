import express from 'express';
import { auth } from '../middleware/auth';
import { checkRole } from '../middleware/roleCheck';
import { UserRole } from '../types/user';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
  bulkImportCategories,
  bulkImportProducts,
  getCategoryTemplate,
  getProductTemplate
} from '../controllers/bulk.controller';

// Create CSV upload middleware
const csvUploadDir = path.join(__dirname, '../../uploads/csv');
if (!fs.existsSync(csvUploadDir)) {
  fs.mkdirSync(csvUploadDir, { recursive: true });
}

const csvStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, csvUploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const csvFileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
    return cb(null, true);
  }
  cb(new Error('Only CSV files are allowed'));
};

const uploadCSV = multer({
  storage: csvStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: csvFileFilter,
}).single('file');

const router = express.Router();

// Debug middleware to log authentication status
router.use((req, res, next) => {
  console.log(`[Bulk Routes] ${req.method} ${req.path} - Auth header: ${req.headers.authorization ? 'Present' : 'Missing'}`);
  next();
});

// Apply authentication middleware to all routes
router.use(auth);

// Debug middleware after auth
router.use((req, res, next) => {
  console.log(`[Bulk Routes] User authenticated: ${req.user ? 'Yes' : 'No'}`);
  if (req.user) {
    console.log(`[Bulk Routes] User role: ${req.user.role}`);
  }
  next();
});

// Apply role check middleware - only admins can access bulk operations
router.use(checkRole([UserRole.SUPER_ADMIN, UserRole.ADMIN]));

// Debug middleware after role check
router.use((req, res, next) => {
  console.log(`[Bulk Routes] Role check passed for ${req.path}`);
  next();
});

// Bulk import categories from CSV
router.post('/categories', uploadCSV, bulkImportCategories);

// Bulk import products from CSV
router.post('/products', uploadCSV, bulkImportProducts);

// Get CSV template for categories
router.get('/categories/template', getCategoryTemplate);

// Get CSV template for products
router.get('/products/template', getProductTemplate);

export default router; 