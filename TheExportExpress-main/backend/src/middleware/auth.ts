/// <reference path="../types/express/index.d.ts" />
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUserDocument } from '../models/User';
import { UnauthorizedError } from '../utils/ApiError';
import { JWT_SECRET_KEY } from '../server';

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new UnauthorizedError('Authentication required');
    }

    const decoded = jwt.verify(token, JWT_SECRET_KEY) as { _id: string };
    const user = await User.findOne({ _id: decoded._id, isActive: true });

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    next(new UnauthorizedError('Invalid token'));
  }
}; 