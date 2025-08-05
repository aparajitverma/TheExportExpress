import mongoose from 'mongoose'; // Import mongoose for Types.ObjectId

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  CONTENT_EDITOR = 'content_editor',
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user'
}

export interface IUser {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  verified?: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  permissions?: string[];
  avatar?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  loginAttempts?: number;
  lockUntil?: Date;
}

export interface IUserCreate extends Omit<IUser, 'createdAt' | 'updatedAt' | 'lastLogin' | 'loginAttempts' | 'lockUntil'> {}

export interface IUserLogin {
  email: string;
  password: string;
}

export interface IAuthResponse {
  token: string;
  user: Omit<IUser, 'password' | 'resetPasswordToken' | 'resetPasswordExpires' | 'loginAttempts' | 'lockUntil'>;
}

export interface IPasswordReset {
  email: string;
  token: string;
  newPassword: string;
}

export interface IChangePassword {
  currentPassword: string;
  newPassword: string;
}