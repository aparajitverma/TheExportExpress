import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../utils/ApiError';
import { sendSuccess } from '../utils/response';
import { getFileUrl, deleteFile } from '../utils/upload';

export const uploadImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      throw new BadRequestError('No file uploaded');
    }

    const fileUrl = getFileUrl(req, req.file.filename);
    sendSuccess(res, { url: fileUrl }, 201);
  } catch (error) {
    next(error);
  }
};

export const deleteImage = async (
  req: Request<{ filename: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { filename } = req.params;
    await deleteFile(filename);
    sendSuccess(res, { message: 'File deleted successfully' });
  } catch (error) {
    next(error);
  }
}; 