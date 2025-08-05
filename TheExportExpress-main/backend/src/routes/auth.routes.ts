import express from 'express';
import { register, login, getProfile } from '../controllers/auth.controller';
import { registerValidation, loginValidation } from '../validations/auth.validation';
import { validate } from '../middleware/validate';
import { auth } from '../middleware/auth';

const router = express.Router();

router.post('/register', validate(registerValidation), register);
router.post('/login', validate(loginValidation), login);
router.get('/profile', auth, getProfile);
router.get('/me', auth, getProfile);

export default router; 