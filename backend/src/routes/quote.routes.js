import express from 'express';
import { protect, restrictTo } from '../middleware/auth.middleware.js';
import { validateQuoteRequest, validateId, validatePagination } from '../middleware/validators.js';
import { validate } from '../middleware/validate.middleware.js';
import { asyncHandler } from '../middleware/error.middleware.js';
import {
  submitQuote,
  getQuotes,
  getQuote,
  updateQuoteStatus,
  deleteQuote,
  exportQuotes
} from '../controllers/quote.controller.js';

const router = express.Router();

// Public route - Submit quote request
router.post('/', validateQuoteRequest, validate, asyncHandler(submitQuote));

// Admin routes
router.use(protect);
router.use(restrictTo('ADMIN', 'SUPER_ADMIN'));

router.get('/export', asyncHandler(exportQuotes));
router.get('/', validatePagination, validate, asyncHandler(getQuotes));
router.get('/:id', validateId, validate, asyncHandler(getQuote));
router.put('/:id/status', validateId, validate, asyncHandler(updateQuoteStatus));
router.delete('/:id', validateId, validate, asyncHandler(deleteQuote));

export default router;
