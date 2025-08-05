import { Request, Response, NextFunction } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { User, IUserDocument } from '../models/User';
import { Product } from '../models/Product';
import { UserRole, IUserCreate } from '../types/user';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../utils/ApiError';
import { sendSuccess } from '../utils/response';
import bcrypt from 'bcryptjs';

// Get dashboard statistics
export const getDashboardStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalAdmins = await User.countDocuments({ 
      role: { $in: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CONTENT_EDITOR] } 
    });
    const recentProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name category createdAt');

    sendSuccess(res, {
      totalProducts,
      totalAdmins,
      recentProducts
    });
  } catch (error) {
    next(error);
  }
};

// Get admin profile
export const getAdminProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Not authenticated');
    }
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    sendSuccess(res, user);
  } catch (error) {
    next(error);
  }
};

// Update admin profile
export const updateAdminProfile = async (
  req: Request<{}, {}, { name: string; email: string; avatar?: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Not authenticated');
    }
    const updates = {
      name: req.body.name,
      email: req.body.email,
      avatar: req.body.avatar
    };

    const user = await User.findById(req.user._id);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Check if email is being changed and if it's already in use
    if (updates.email && updates.email !== user.email) {
      const existingUser = await User.findOne({ email: updates.email });
      if (existingUser) {
        throw new BadRequestError('Email already in use');
      }
    }

    Object.assign(user, updates);
    await user.save();

    sendSuccess(res, user);
  } catch (error) {
    next(error);
  }
};

// Get all admin users (Super Admin only)
export const getAllAdmins = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const admins = await User.find({
      role: { $in: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CONTENT_EDITOR] }
    }).select('-password');

    sendSuccess(res, admins);
  } catch (error) {
    next(error);
  }
};

// Create new admin user (Super Admin only)
export const createAdmin = async (
  req: Request<{}, {}, IUserCreate>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, name, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError('Email already registered');
    }

    // Validate role
    if (![UserRole.ADMIN, UserRole.CONTENT_EDITOR].includes(role)) {
      throw new BadRequestError('Invalid role specified');
    }

    const user = await User.create({
      email,
      password,
      name,
      role,
      isActive: true
    });

    sendSuccess(res, user, 201);
  } catch (error) {
    next(error);
  }
};

// Update admin user (Super Admin only)
export const updateAdmin = async (
  req: Request<ParamsDictionary, {}, { name: string; email: string; role: UserRole; isActive: boolean }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const updates = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
      isActive: req.body.isActive
    };

    const user = await User.findById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Prevent changing super admin role
    if (user.role === UserRole.SUPER_ADMIN) {
      throw new BadRequestError('Cannot modify super admin user');
    }

    // Check if email is being changed and if it's already in use
    if (updates.email && updates.email !== user.email) {
      const existingUser = await User.findOne({ email: updates.email });
      if (existingUser) {
        throw new BadRequestError('Email already in use');
      }
    }

    // Validate role
    if (updates.role && ![UserRole.ADMIN, UserRole.CONTENT_EDITOR].includes(updates.role)) {
      throw new BadRequestError('Invalid role specified');
    }

    Object.assign(user, updates);
    await user.save();

    sendSuccess(res, user);
  } catch (error) {
    next(error);
  }
};

// Delete admin user (Super Admin only)
export const deleteAdmin = async (
  req: Request<ParamsDictionary>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Prevent deleting super admin
    if (user.role === UserRole.SUPER_ADMIN) {
      throw new BadRequestError('Cannot delete super admin user');
    }

    await user.deleteOne();
    sendSuccess(res, { message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Reset admin password (Super Admin only)
export const resetAdminPassword = async (
  req: Request<ParamsDictionary, {}, { newPassword: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    const user = await User.findById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Prevent resetting super admin password
    if (user.role === UserRole.SUPER_ADMIN) {
      throw new BadRequestError('Cannot reset super admin password');
    }

    user.password = newPassword;
    await user.save();

    sendSuccess(res, { message: 'Password reset successfully' });
  } catch (error) {
    next(error);
  }
}; 