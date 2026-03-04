import express from 'express';
import { protect, restrictTo } from '../middleware/auth.middleware.js';
import { validateCategory, validateId } from '../middleware/validators.js';
import { validate } from '../middleware/validate.middleware.js';
import { asyncHandler } from '../middleware/error.middleware.js';
import {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/category.controller.js';

const router = express.Router();

// Public routes
router.get('/', asyncHandler(getCategories));
router.get('/:slug', asyncHandler(getCategoryBySlug));

// Admin routes
router.use(protect);
router.use(restrictTo('ADMIN', 'SUPER_ADMIN'));

router.post('/', validateCategory, validate, asyncHandler(createCategory));
router.put('/:id', validateId, validateCategory, validate, asyncHandler(updateCategory));
router.delete('/:id', validateId, validate, asyncHandler(deleteCategory));

export default router;
