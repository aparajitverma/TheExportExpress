import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { NextFunction, Request, Response } from 'express';
import { BadRequestError } from '../utils/ApiError';

const sanitizeFilename = (filename: string): string => {
  return filename.replace(/[^a-zA-Z0-9_\-\.]/g, '_'); // Allow alphanumeric, underscore, hyphen, dot
};

// Helper to ensure directory exists
const ensureDirExists = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// --- Product Image Upload Configuration ---
const productUploadDir = path.join(__dirname, '../../uploads/products');
ensureDirExists(productUploadDir);

const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, productUploadDir);
  },
  filename: (req, file, cb) => {
    const sanitizedOriginalName = sanitizeFilename(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + sanitizedOriginalName);
  },
});

const productFileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const mimetype = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new BadRequestError('File type not allowed. Only images (JPEG, PNG, GIF, WEBP) are accepted.'));
};

export const uploadProductImages = multer({
  storage: productStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: productFileFilter,
}).array('images', 10); // 'images' is the field name, max 10 files


// --- General Media Upload Configuration --- (REVERTED)
// const generalMediaUploadDir = path.join(__dirname, '../../../uploads/media');
// ensureDirExists(generalMediaUploadDir);

// const generalMediaStore = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, generalMediaUploadDir);
//   },
//   filename: (req, file, cb) => {
//     const sanitizedOriginalName = sanitizeFilename(file.originalname);
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + '-' + sanitizedOriginalName);
//   },
// });

// const generalMediaFileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
//   // Allow common image types, PDFs, and potentially others later
//   const allowedTypes = /jpeg|jpg|png|gif|webp|pdf/;
//   const mimetype = allowedTypes.test(file.mimetype);
//   const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

//   if (mimetype && extname) {
//     return cb(null, true);
//   }
//   cb(new BadRequestError('File type not allowed. Accepted types: Images (JPEG, PNG, GIF, WEBP), PDF.'));
// };

// export const uploadGeneralMedia = multer({
//   storage: generalMediaStore,
//   limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit for general media (can be adjusted)
//   fileFilter: generalMediaFileFilter,
// }).single('mediaFile'); // 'mediaFile' is the field name for single file upload


// Middleware to handle multer errors gracefully
export const handleUploadError = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return next(new BadRequestError('File is too large.'));
    }
    return next(new BadRequestError(`File upload error: ${err.message}`));
  }
  if (err) {
    return next(new BadRequestError(`Upload error: ${err.message || 'Could not process file.'}`));
  }
  next();
};

// Example for a single file upload (e.g., avatar) (REVERTED - this was example code)
// const avatarStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadPath = path.join(__dirname, '../../uploads/avatars');
//     if (!fs.existsSync(uploadPath)) {
//       fs.mkdirSync(uploadPath, { recursive: true });
//     }
//     cb(null, uploadPath);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
//   }
// });

// export const uploadAvatar = multer({
//   storage: avatarStorage,
//   fileFilter: productFileFilter, // Corrected to productFileFilter if it was intended for images
//   limits: { fileSize: 1024 * 1024 * 2 } // 2MB limit
// }).single('avatar'); 