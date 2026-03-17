import express from 'express';
import { protect, restrictTo } from '../middleware/auth.middleware.js';
import { asyncHandler } from '../middleware/error.middleware.js';
import {
  // Public
  getCatalogues,
  getCatalogueBySlug,
  downloadCatalogue,
  quickDownload,
  // Admin
  getAllCataloguesAdmin,
  getCatalogueById,
  createCatalogue,
  updateCatalogue,
  deleteCatalogue,
  getDownloadStats,
  getDownloadHistory,
  exportDownloads
} from '../controllers/catalogue.controller.js';

const router = express.Router();

// ==========================================
// ADMIN ROUTES
// ==========================================

// Get all catalogues (admin view with pagination)
router.get('/admin/all', protect, restrictTo('ADMIN', 'SUPER_ADMIN'), asyncHandler(getAllCataloguesAdmin));

// Get download statistics
router.get('/admin/stats', protect, restrictTo('ADMIN', 'SUPER_ADMIN'), asyncHandler(getDownloadStats));

// Get download history
router.get('/admin/downloads', protect, restrictTo('ADMIN', 'SUPER_ADMIN'), asyncHandler(getDownloadHistory));

// Export downloads to CSV
router.get('/admin/downloads/export', protect, restrictTo('ADMIN', 'SUPER_ADMIN'), asyncHandler(exportDownloads));

// Get catalogue by ID (admin)
router.get('/admin/:id', protect, restrictTo('ADMIN', 'SUPER_ADMIN'), asyncHandler(getCatalogueById));

// Create new catalogue
router.post('/admin', protect, restrictTo('ADMIN', 'SUPER_ADMIN'), asyncHandler(createCatalogue));

// Update catalogue
router.put('/admin/:id', protect, restrictTo('ADMIN', 'SUPER_ADMIN'), asyncHandler(updateCatalogue));

// Delete catalogue
router.delete('/admin/:id', protect, restrictTo('ADMIN', 'SUPER_ADMIN'), asyncHandler(deleteCatalogue));

// ==========================================
// PUBLIC ROUTES
// ==========================================

// Get all active catalogues
router.get('/', asyncHandler(getCatalogues));

// Track download with user info (POST - for forms)
router.post('/:slug/download', asyncHandler(downloadCatalogue));

// Quick download without user info (GET - for direct links)
router.get('/:slug/download', asyncHandler(quickDownload));

// Get catalogue by slug
router.get('/:slug', asyncHandler(getCatalogueBySlug));

export default router;
