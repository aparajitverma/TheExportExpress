import express from 'express';
import {
  createInquiry,
  getAllInquiries,
  getInquiryById,
  updateInquiry,
  deleteInquiry,
} from '../controllers/inquiry.controller';
import { auth } from '../middleware/auth';
import { checkRole } from '../middleware/roleCheck';
import { UserRole } from '../types/user';

const router = express.Router();

// Public route
router.post('/', createInquiry); // Anyone can submit an inquiry

// Admin routes - Protect all subsequent routes in this router with auth and role check
router.use(auth);
router.use(checkRole([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CONTENT_EDITOR])); // Or specific roles like a 'SUPPORT_AGENT' if you add it

router.get('/', getAllInquiries);
router.get('/:id', getInquiryById);
router.patch('/:id', updateInquiry); // For updating status, notes etc.
router.delete('/:id', deleteInquiry);

export default router; 