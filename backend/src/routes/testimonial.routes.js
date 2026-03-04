import express from 'express';
import { protect, restrictTo } from '../middleware/auth.middleware.js';
import { validateTestimonial, validateId } from '../middleware/validators.js';
import { validate } from '../middleware/validate.middleware.js';
import { asyncHandler } from '../middleware/error.middleware.js';
import {
  getActiveTestimonials,
  getAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial
} from '../controllers/testimonial.controller.js';

const router = express.Router();

// Public route - Get active testimonials
router.get('/', asyncHandler(getActiveTestimonials));

// Admin routes
router.use(protect);
router.use(restrictTo('ADMIN', 'SUPER_ADMIN'));

router.get('/all', asyncHandler(getAllTestimonials));
router.post('/', validateTestimonial, validate, asyncHandler(createTestimonial));
router.put('/:id', validateId, validateTestimonial, validate, asyncHandler(updateTestimonial));
router.delete('/:id', validateId, validate, asyncHandler(deleteTestimonial));

export default router;
