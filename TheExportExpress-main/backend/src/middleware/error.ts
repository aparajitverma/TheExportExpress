import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { sendError } from '../utils/response';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApiError) {
    return sendError(res, err.message, err.statusCode);
  }

  // Handle mongoose validation errors
  if (err.name === 'ValidationError') {
    return sendError(res, 'Validation Error', 400);
  }

  // Handle mongoose cast errors
  if (err.name === 'CastError') {
    return sendError(res, 'Invalid ID format', 400);
  }

  // Handle mongoose duplicate key errors
  if (err.name === 'MongoError' && (err as any).code === 11000) {
    return sendError(res, 'Duplicate key error', 400);
  }

  // Log unexpected errors
  console.error('Unexpected error:', err);

  // Send generic error response for unexpected errors
  return sendError(
    res,
    'An unexpected error occurred',
    process.env.NODE_ENV === 'development' ? 500 : 500
  );
}; 