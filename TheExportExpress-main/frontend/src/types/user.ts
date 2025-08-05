export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  CONTENT_EDITOR = 'content_editor',
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user'
}

export interface User {
  _id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  avatar?: string;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    user: User;
  };
}

export interface PasswordReset {
  email: string;
  token: string;
  newPassword: string;
}

export interface ChangePassword {
  currentPassword: string;
  newPassword: string;
} 