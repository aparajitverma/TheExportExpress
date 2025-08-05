import { Response } from 'express';

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: PaginationMeta;
}

export const sendSuccess = <T>(res: Response, data: T, statusCode = 200): void => {
  res.status(statusCode).json({
    success: true,
    data,
  });
};

export const sendError = (res: Response, error: string, statusCode = 400): void => {
  res.status(statusCode).json({
    success: false,
    error,
  });
};

export const sendPaginatedSuccess = <T>(
  res: Response,
  data: T,
  page: number,
  limit: number,
  total: number,
  statusCode = 200
): void => {
  const totalPages = Math.ceil(total / limit);
  res.status(statusCode).json({
    success: true,
    data,
    meta: {
      page,
      limit,
      total,
      totalPages,
    },
  });
}; 