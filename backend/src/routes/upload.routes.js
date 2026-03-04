import express from 'express';
import { protect, restrictTo } from '../middleware/auth.middleware.js';
import { asyncHandler } from '../middleware/error.middleware.js';
import {
  uploadGeneral,
  uploadMultipleGeneral,
  uploadProductImage as uploadProductImageMiddleware,
  uploadCategoryImage as uploadCategoryImageMiddleware,
  uploadCatalogueFiles,
  uploadTestimonialImage,
  handleMulterError,
} from '../middleware/upload.middleware.js';
import {
  uploadFile,
  uploadMultipleFiles,
  uploadProductImage,
  uploadCategoryImage,
  uploadCatalogue,
  getMedia,
  deleteMedia,
  getStorageStats,
} from '../controllers/upload.controller.js';

const router = express.Router();

// All upload routes require authentication + admin role
router.use(protect, restrictTo('ADMIN', 'SUPER_ADMIN'));

// ==========================================
// UPLOAD ROUTES
// ==========================================

// Upload single file (general purpose)
router.post('/',
  uploadGeneral,
  handleMulterError,
  asyncHandler(uploadFile)
);

// Upload multiple files
router.post('/multiple',
  uploadMultipleGeneral,
  handleMulterError,
  asyncHandler(uploadMultipleFiles)
);

// Upload product image (with auto thumbnail)
router.post('/product-image',
  uploadProductImageMiddleware,
  handleMulterError,
  asyncHandler(uploadProductImage)
);

// Upload category image
router.post('/category-image',
  uploadCategoryImageMiddleware,
  handleMulterError,
  asyncHandler(uploadCategoryImage)
);

// Upload catalogue (PDF + optional thumbnail)
router.post('/catalogue',
  uploadCatalogueFiles,
  handleMulterError,
  asyncHandler(uploadCatalogue)
);

// Upload testimonial avatar
router.post('/testimonial-image',
  uploadTestimonialImage,
  handleMulterError,
  asyncHandler(uploadFile) // Reuse general handler
);

// ==========================================
// MEDIA MANAGEMENT ROUTES
// ==========================================

// Get all media files (with pagination + filtering)
router.get('/media', asyncHandler(getMedia));

// Get storage statistics
router.get('/stats', asyncHandler(getStorageStats));

// Delete a media file
router.delete('/:id', asyncHandler(deleteMedia));

export default router;
