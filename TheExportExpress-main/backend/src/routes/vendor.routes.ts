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
  getVendorPerformance,
  getVendorStats,
  bulkImportVendors,
  getVendorTemplate,
  uploadVendorDocuments
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
// Alias to support AdminService (uses POST)
router.post('/:id/metrics', updateVendorMetrics);

// Get vendor performance analytics
router.get('/:id/performance', getVendorPerformance);

// Bulk import vendors from CSV
router.post('/bulk/import', uploadCSV, bulkImportVendors);

// Get vendor template for CSV download
router.get('/bulk/template', getVendorTemplate);

// ========= Vendor documents upload =========
const vendorUploadDir = path.join(__dirname, '../../uploads/vendors');
if (!fs.existsSync(vendorUploadDir)) {
  fs.mkdirSync(vendorUploadDir, { recursive: true });
}

const vendorStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, vendorUploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const vendorFileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Allow images and PDFs for brochures/catalogs/certificates
  const allowed = /jpeg|jpg|png|gif|webp|pdf/;
  const ok = allowed.test(file.mimetype) || allowed.test(path.extname(file.originalname).toLowerCase());
  if (ok) return cb(null, true);
  cb(new Error('Only images and PDFs are allowed'));
};

const uploadVendorMedia = multer({
  storage: vendorStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: vendorFileFilter,
}).fields([
  { name: 'catalogs', maxCount: 10 },
  { name: 'brochures', maxCount: 10 },
  { name: 'certificates', maxCount: 20 },
  { name: 'other', maxCount: 50 },
]);

// Upload vendor documents (catalogs, brochures, certificates)
router.patch('/:id/documents', uploadVendorMedia, uploadVendorDocuments);

export default router;