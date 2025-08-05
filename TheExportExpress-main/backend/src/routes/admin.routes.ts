import express from 'express';
import { auth } from '../middleware/auth';
import { checkRole } from '../middleware/roleCheck';
import { UserRole } from '../types/user';
import {
  getAdminProfile,
  updateAdminProfile,
  getAllAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  resetAdminPassword,
  getDashboardStats
} from '../controllers/admin.controller';

const router = express.Router();

// Dashboard
router.get('/dashboard/stats', auth, checkRole([UserRole.SUPER_ADMIN, UserRole.ADMIN]), getDashboardStats);

// Admin Profile Management
router.get('/profile', auth, checkRole([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CONTENT_EDITOR]), getAdminProfile);
router.put('/profile', auth, checkRole([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CONTENT_EDITOR]), updateAdminProfile);

// Admin User Management (Super Admin Only)
router.get('/users', auth, checkRole([UserRole.SUPER_ADMIN]), getAllAdmins);
router.post('/users', auth, checkRole([UserRole.SUPER_ADMIN]), createAdmin);
router.put('/users/:id', auth, checkRole([UserRole.SUPER_ADMIN]), updateAdmin);
router.delete('/users/:id', auth, checkRole([UserRole.SUPER_ADMIN]), deleteAdmin);
router.post('/users/:id/reset-password', auth, checkRole([UserRole.SUPER_ADMIN]), resetAdminPassword);

export default router; 