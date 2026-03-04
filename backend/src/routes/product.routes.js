import express from 'express';
import { protect, restrictTo } from '../middleware/auth.middleware.js';
import { validateProduct, validateId, validatePagination } from '../middleware/validators.js';
import { validate } from '../middleware/validate.middleware.js';
import { asyncHandler } from '../middleware/error.middleware.js';
import {
  getProducts,
  getFeaturedProducts,
  searchProducts,
  getProductsByCategory,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/product.controller.js';

const router = express.Router();

// Public routes
router.get('/', validatePagination, validate, asyncHandler(getProducts));
router.get('/featured', asyncHandler(getFeaturedProducts));
router.get('/search', asyncHandler(searchProducts));
router.get('/category/:slug', asyncHandler(getProductsByCategory));
router.get('/:id', validateId, validate, asyncHandler(getProduct));

// Admin routes
router.use(protect);
router.use(restrictTo('ADMIN', 'SUPER_ADMIN'));

router.post('/', validateProduct, validate, asyncHandler(createProduct));
router.put('/:id', validateId, validateProduct, validate, asyncHandler(updateProduct));
router.delete('/:id', validateId, validate, asyncHandler(deleteProduct));

export default router;
