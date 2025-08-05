import express from 'express';
import { auth } from '../middleware/auth';
import { checkRole } from '../middleware/roleCheck';
import { UserRole } from '../types/user';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
  getAllVendors,
  getVendorById,
  createVendor,
  updateVendor,
  deleteVendor,
  updateVendorStatus,
  verifyVendor,
  updateVendorMetrics,
  getVendorStats,
  bulkImportVendors,
  getVendorTemplate
} from '../controllers/vendor.controller';

// Create CSV upload middleware for vendors
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

// Apply authentication middleware to all routes
router.use(auth);

// Apply role check middleware - only admins can access vendor operations
router.use(checkRole([UserRole.SUPER_ADMIN, UserRole.ADMIN]));

// Get all vendors with filtering and pagination
router.get('/', getAllVendors);

// Get vendor statistics
router.get('/stats', getVendorStats);

// Get vendor by ID
router.get('/:id', getVendorById);

// Create new vendor
router.post('/', createVendor);

// Update vendor
router.put('/:id', updateVendor);

// Delete vendor
router.delete('/:id', deleteVendor);

// Update vendor status
router.patch('/:id/status', updateVendorStatus);

// Verify/unverify vendor
router.patch('/:id/verify', verifyVendor);

// Update vendor performance metrics
router.patch('/:id/metrics', updateVendorMetrics);

// Bulk import vendors from CSV
router.post('/bulk/import', uploadCSV, bulkImportVendors);

// Get vendor template for CSV download
router.get('/bulk/template', getVendorTemplate);

export default router; 