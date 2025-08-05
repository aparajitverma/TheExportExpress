import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser, UserRole } from '../types/user';

export interface IUserDocument extends IUser, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
  incrementLoginAttempts(): Promise<void>;
  resetLoginAttempts(): Promise<void>;
}

export interface IUserModel extends mongoose.Model<IUserDocument> {
  findByCredentials(email: string, password: string): Promise<IUserDocument>;
}

const userSchema = new Schema<IUserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
    },
    permissions: [{
      type: String,
    }],
    avatar: {
      type: String,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
    }
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  const user = this;
  // Only hash the password if it has been modified (or is new) AND is not already hashed
  if (user.isModified('password')) {
    // Basic check to prevent re-hashing
    if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$') || user.password.startsWith('$2y$')) {
        return next();
    }
    user.password = await bcrypt.hash(user.password, 10);
  }
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (
  this: IUserDocument,
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Increment login attempts
userSchema.methods.incrementLoginAttempts = async function(
  this: IUserDocument
): Promise<void> {
  // If lock has expired, reset attempts and remove lock
  if (this.lockUntil && new Date(this.lockUntil) < new Date()) {
    await this.resetLoginAttempts();
    return;
  }
  
  // Otherwise increment
  const attempts = (this.loginAttempts || 0) + 1;
  
  // Lock the account if we've reached max attempts and haven't locked it yet
  if (attempts >= 5 && !this.lockUntil) {
    this.lockUntil = new Date(Date.now() + 2 * 60 * 60 * 1000); // Lock for 2 hours
  }
  
  this.loginAttempts = attempts;
  await this.save();
};

// Reset login attempts
userSchema.methods.resetLoginAttempts = async function(
  this: IUserDocument
): Promise<void> {
  this.loginAttempts = 0;
  this.lockUntil = undefined;
  await this.save();
};

// Remove sensitive data when converting to JSON
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.resetPasswordToken;
  delete user.resetPasswordExpires;
  delete user.loginAttempts;
  delete user.lockUntil;
  return user;
};

export const User = mongoose.model<IUserDocument, IUserModel>('User', userSchema); 