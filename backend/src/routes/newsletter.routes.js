import express from 'express';
import { protect, restrictTo } from '../middleware/auth.middleware.js';
import { validateNewsletter, validatePagination, validateId } from '../middleware/validators.js';
import { validate } from '../middleware/validate.middleware.js';
import { asyncHandler } from '../middleware/error.middleware.js';
import {
  subscribe,
  unsubscribe,
  getSubscribers,
  getStats,
  deleteSubscriber
} from '../controllers/newsletter.controller.js';

const router = express.Router();

// Public routes
router.post('/subscribe', validateNewsletter, validate, asyncHandler(subscribe));
router.post('/unsubscribe', validateNewsletter, validate, asyncHandler(unsubscribe));

// Admin routes
router.use(protect);
router.use(restrictTo('ADMIN', 'SUPER_ADMIN'));

router.get('/subscribers', validatePagination, validate, asyncHandler(getSubscribers));
router.get('/stats', asyncHandler(getStats));
router.delete('/:id', validateId, validate, asyncHandler(deleteSubscriber));

export default router;
