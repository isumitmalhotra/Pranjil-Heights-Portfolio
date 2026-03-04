import express from 'express';
import rateLimit from 'express-rate-limit';
import { protect, restrictTo } from '../middleware/auth.middleware.js';
import { validateLogin, validateRegister } from '../middleware/validators.js';
import { validate } from '../middleware/validate.middleware.js';
import { asyncHandler } from '../middleware/error.middleware.js';
import {
  login,
  logout,
  forgotPassword,
  resetPassword,
  getMe,
  changePassword,
  register,
  updateProfile
} from '../controllers/auth.controller.js';

const router = express.Router();

// Strict rate limiter for auth endpoints (brute-force protection)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per window
  message: {
    success: false,
    message: 'Too many login attempts, please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Public routes
router.post('/login', authLimiter, validateLogin, validate, asyncHandler(login));
router.post('/logout', asyncHandler(logout));
router.post('/forgot-password', authLimiter, asyncHandler(forgotPassword));
router.post('/reset-password/:token', authLimiter, asyncHandler(resetPassword));

// Protected routes
router.use(protect); // All routes below this require authentication

router.get('/me', asyncHandler(getMe));
router.put('/profile', asyncHandler(updateProfile));
router.put('/change-password', asyncHandler(changePassword));

// Admin only routes
router.post('/register', restrictTo('SUPER_ADMIN'), validateRegister, validate, asyncHandler(register));

export default router;
