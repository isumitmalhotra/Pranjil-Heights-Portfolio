import { Router } from 'express';
import { getStats, getRecentActivity } from '../controllers/dashboard.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';

const router = Router();

// Wrap async handlers
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Dashboard routes - all protected and restricted to admin roles
router.get('/stats', protect, restrictTo('ADMIN', 'SUPER_ADMIN'), asyncHandler(getStats));
router.get('/activity', protect, restrictTo('ADMIN', 'SUPER_ADMIN'), asyncHandler(getRecentActivity));

export default router;
