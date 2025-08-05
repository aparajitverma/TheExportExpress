import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUserDocument } from '../models/User';
import { IUserCreate, IUserLogin, UserRole } from '../types/user';
import { BadRequestError, UnauthorizedError } from '../utils/ApiError';
import { sendSuccess } from '../utils/response';
import { JWT_SECRET_KEY } from '../server';
import { Types } from 'mongoose';

const generateToken = (userId: Types.ObjectId | string): string => {
  return jwt.sign({ _id: userId.toString() }, JWT_SECRET_KEY, {
    expiresIn: '7d',
  });
};

export const register = async (
  req: Request<{}, {}, IUserCreate>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError('Email already registered');
    }

    // Create new user
    const user: IUserDocument = await User.create(req.body);
    const token = generateToken(user._id!.toString());

    sendSuccess(res, { token, user }, 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request<{}, {}, IUserLogin>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user: IUserDocument | null = await User.findOne({ email });
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id!.toString());
    
    // Send response with token and user data
    sendSuccess(res, { token, user });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('User not found');
    }
    sendSuccess(res, req.user);
  } catch (error) {
    next(error);
  }
}; 