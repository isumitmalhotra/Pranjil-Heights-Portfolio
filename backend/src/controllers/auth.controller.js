/* global process */
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/database.js';
import { ApiError } from '../middleware/error.middleware.js';
import { sendPasswordReset, sendPasswordResetSuccess } from '../config/email.js';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// Generate Refresh Token
const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d'
  });
};

const getFrontendBaseUrl = () => {
  const configured = process.env.FRONTEND_URL?.split(',')?.[0]?.trim();
  return configured || 'http://localhost:5173';
};

const generatePasswordResetToken = (user) => {
  const secret = `${process.env.JWT_SECRET}${user.password}`;
  return jwt.sign(
    { id: user.id, email: user.email, type: 'password_reset' },
    secret,
    { expiresIn: '1h' }
  );
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res) => {
  const { email, password } = req.body;

  // Find user
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() }
  });

  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  // Check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }

  // Check if user is active
  if (!user.isActive) {
    throw new ApiError(401, 'Your account has been deactivated');
  }

  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() }
  });

  // Generate tokens
  const accessToken = generateToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  // Set cookies
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  });

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      accessToken
    }
  });
};

/**
 * @desc    Register new admin user (Super Admin only)
 * @route   POST /api/auth/register
 * @access  Private/Super Admin
 */
export const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() }
  });

  if (existingUser) {
    throw new ApiError(409, 'User with this email already exists');
  }

  // Hash password
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || 'ADMIN'
    }
  });

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    }
  });
};

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Public
 */
export const logout = async (req, res) => {
  res.cookie('accessToken', '', {
    httpOnly: true,
    expires: new Date(0)
  });
  res.cookie('refreshToken', '', {
    httpOnly: true,
    expires: new Date(0)
  });

  res.json({
    success: true,
    message: 'Logged out successfully'
  });
};

/**
 * @desc    Get current user
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res) => {
  res.json({
    success: true,
    data: {
      user: req.user
    }
  });
};

/**
 * @desc    Change password
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Get user with password
  const user = await prisma.user.findUnique({
    where: { id: req.user.id }
  });

  // Check current password
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    throw new ApiError(401, 'Current password is incorrect');
  }

  // Hash new password
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  // Update password
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword }
  });

  res.json({
    success: true,
    message: 'Password changed successfully'
  });
};

/**
 * @desc    Forgot password
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() }
  });

  // Don't reveal if user exists or not
  if (!user) {
    return res.json({
      success: true,
      message: 'If an account exists with this email, you will receive a password reset link'
    });
  }

  const resetToken = generatePasswordResetToken(user);
  const resetLink = `${getFrontendBaseUrl()}/admin/reset-password?token=${encodeURIComponent(resetToken)}`;

  await sendPasswordReset({
    name: user.name,
    email: user.email,
    resetLink,
    expiresIn: '1 hour',
  });

  res.json({
    success: true,
    message: 'If an account exists with this email, you will receive a password reset link'
  });
};

/**
 * @desc    Reset password
 * @route   POST /api/auth/reset-password/:token
 * @access  Public
 */
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const decoded = jwt.decode(token);
  if (!decoded?.id || decoded?.type !== 'password_reset') {
    throw new ApiError(400, 'Invalid or expired reset link');
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.id }
  });

  if (!user || user.email !== decoded.email) {
    throw new ApiError(400, 'Invalid or expired reset link');
  }

  try {
    jwt.verify(token, `${process.env.JWT_SECRET}${user.password}`);
  } catch {
    throw new ApiError(400, 'Invalid or expired reset link');
  }

  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword }
  });

  await sendPasswordResetSuccess({
    name: user.name,
    email: user.email,
    ipAddress: req.ip,
    resetTime: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
  });

  res.json({
    success: true,
    message: 'Password has been reset successfully'
  });
};

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export const updateProfile = async (req, res) => {
  const { name, email } = req.body;
  const userId = req.user.id;

  // Check if email is already taken by another user
  if (email && email.toLowerCase() !== req.user.email) {
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      throw new ApiError(409, 'Email is already in use by another account');
    }
  }

  // Update user
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(name && { name }),
      ...(email && { email: email.toLowerCase() })
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      lastLogin: true
    }
  });

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user: updatedUser
    }
  });
};
