import express from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  listProducts,
} from '../controllers/product.controller';
import { auth } from '../middleware/auth';
import { checkRole } from '../middleware/roleCheck';
import { UserRole } from '../types/user';
import { uploadProductImages } from '../middleware/upload.middleware';

const router = express.Router();

// Public routes
router.get('/search', listProducts);
router.get('/', getProducts);
router.get('/:id', getProduct);

// Protected routes (admin only)
router.post('/', auth, checkRole([UserRole.SUPER_ADMIN, UserRole.ADMIN]), uploadProductImages, createProduct);
router.patch('/:id', auth, checkRole([UserRole.SUPER_ADMIN, UserRole.ADMIN]), uploadProductImages, updateProduct);
router.delete('/:id', auth, checkRole([UserRole.SUPER_ADMIN, UserRole.ADMIN]), deleteProduct);

export default router; 