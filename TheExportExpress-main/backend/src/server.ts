import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { NotFoundError, ApiError } from './utils/ApiError';
import { sendError } from './utils/response';

import productRoutes from './routes/product.routes';
import inquiryRoutes from './routes/inquiry.routes';
import authRoutes from './routes/auth.routes';
import uploadRoutes from './routes/upload.routes';
import adminRoutes from './routes/admin.routes';
import categoryRoutes from './routes/category.routes';
import bulkRoutes from './routes/bulk.routes';
import vendorRoutes from './routes/vendor.routes';
import { errorHandler } from './middleware/error';
import { auth } from './middleware/auth';

dotenv.config();

// --- Hardcoded Configuration ---
const MONGODB_URI = "mongodb://admin:password@localhost:27017/TheExportExpress?authSource=admin";
const PORTS = [3000, 3001, 3002, 3003]; // Multiple port options
const JWT_SECRET_KEY = "your-super-secret-and-long-jwt-key";
// --- End Hardcoded Configuration ---

const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check route
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'UP', message: 'API is healthy' });
});

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/inquiries', auth, inquiryRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/bulk', bulkRoutes);
app.use('/api/vendors', vendorRoutes);

// 404 Not Found Handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError());
});

// Global Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('[Global Error Handler]:', err);
  if (err instanceof ApiError) {
    sendError(res, err.message, err.statusCode);
  } else {
    sendError(res, 'An unexpected error occurred', 500);
  }
});

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI); // Use hardcoded MONGODB_URI
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Start server
const startServer = async (portIndex = 0) => {
  if (portIndex >= PORTS.length) {
    console.error('No available ports found');
    process.exit(1);
  }

  const currentPort = PORTS[portIndex];
  try {
    await new Promise((resolve, reject) => {
      const server = app.listen(currentPort, '127.0.0.1', () => {
        console.log(`Server is running on http://127.0.0.1:${currentPort}`);
        resolve(server);
      }).on('error', (err: NodeJS.ErrnoException) => {
        if (err.code === 'EADDRINUSE' || err.code === 'EACCES') {
          console.log(`Port ${currentPort} is busy or permission denied, trying next port...`);
          startServer(portIndex + 1);
        } else {
          reject(err);
        }
      });
    });
  } catch (error) {
    console.error('Server error:', error);
    process.exit(1);
  }
};

// Connect to DB and start server
connectDB().then(() => {
  startServer();
});

// Export constants for other modules if needed (alternative to process.env)
export { MONGODB_URI, PORTS, JWT_SECRET_KEY }; 