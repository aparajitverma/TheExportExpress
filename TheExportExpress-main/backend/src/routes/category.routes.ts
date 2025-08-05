import express from 'express';
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from '../controllers/category.controller';
import { auth } from '../middleware/auth';
import { checkRole } from '../middleware/roleCheck';
import { UserRole } from '../types/user';

const router = express.Router();

// Public routes (or minimally protected, depending on your app's needs)
// For now, let's assume getting categories and a single category can be public or require just auth.
router.get('/', getCategories);
router.get('/id/:id', getCategoryById); // Fetch by ID
router.get('/slug/:slug', getCategoryById); // Fetch by slug

// Admin/Protected routes
const adminRoles = [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CONTENT_EDITOR];

router.post('/', auth, checkRole(adminRoles), createCategory);
router.patch('/:id', auth, checkRole(adminRoles), updateCategory);
router.delete('/:id', auth, checkRole(adminRoles), deleteCategory);

export default router; 