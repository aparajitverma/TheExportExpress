import { body } from 'express-validator';
import { UserRole } from '../types/user';

export const registerValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/\d/)
    .withMessage('Password must contain at least one number')
    .matches(/[a-zA-Z]/)
    .withMessage('Password must contain at least one letter'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required'),
  body('role')
    .isIn(Object.values(UserRole))
    .withMessage('Invalid role'),
];

export const loginValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Valid email is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
]; 