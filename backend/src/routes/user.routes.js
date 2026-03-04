import express from 'express';
import { protect, restrictTo } from '../middleware/auth.middleware.js';
import { asyncHandler } from '../middleware/error.middleware.js';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleUserStatus,
  resetUserPassword,
  getUserStats
} from '../controllers/user.controller.js';

const router = express.Router();

// All routes require authentication and Super Admin role
router.use(protect);
router.use(restrictTo('SUPER_ADMIN'));

// User statistics
router.get('/stats', asyncHandler(getUserStats));

// CRUD operations
router.get('/', asyncHandler(getAllUsers));
router.get('/:id', asyncHandler(getUserById));
router.put('/:id', asyncHandler(updateUser));
router.delete('/:id', asyncHandler(deleteUser));

// Special operations
router.patch('/:id/status', asyncHandler(toggleUserStatus));
router.post('/:id/reset-password', asyncHandler(resetUserPassword));

export default router;
