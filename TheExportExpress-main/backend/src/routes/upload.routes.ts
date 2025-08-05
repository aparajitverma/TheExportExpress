import express from 'express';
import { uploadImage, deleteImage } from '../controllers/upload.controller';
import { upload } from '../utils/upload';
import { auth } from '../middleware/auth';
import { checkRole } from '../middleware/roleCheck';
import { UserRole } from '../types/user';

const router = express.Router();


router.post(
  '/',
  auth,
  checkRole([UserRole.ADMIN, UserRole.MANAGER]),
  upload.single('image'),
  uploadImage
);

router.delete(
  '/:filename',
  auth,
  checkRole([UserRole.ADMIN, UserRole.MANAGER]),
  deleteImage
);

export default router; 