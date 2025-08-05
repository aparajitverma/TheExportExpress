import multer from 'multer';
import path from 'path';
import fs from 'fs';
import type { Request } from 'express';
import { BadRequestError } from './ApiError';

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  
  if (!allowedTypes.includes(file.mimetype)) {
    cb(new BadRequestError('File type not allowed. Only JPEG, PNG and WebP are allowed.'));
    return;
  }

  cb(null, true);
};

// Create multer instance
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// Helper function to delete file
export const deleteFile = async (filename: string): Promise<void> => {
  const filepath = path.join(uploadDir, filename);
  if (fs.existsSync(filepath)) {
    await fs.promises.unlink(filepath);
  }
};

// Helper function to get file URL
export const getFileUrl = (req: Request, filename: string): string => {
  if (!req.protocol || !req.get('host')) {
    throw new Error('Invalid request object');
  }
  return `${req.protocol}://${req.get('host')}/uploads/${filename}`;
}; 