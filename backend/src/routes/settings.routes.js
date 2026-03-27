import express from 'express';
import { protect, restrictTo } from '../middleware/auth.middleware.js';
import { asyncHandler } from '../middleware/error.middleware.js';
import {
  getAllSettings,
  getSettingsByGroup,
  getSetting,
  getPublicHomeVideos,
  getPublicHomeHero,
  upsertSetting,
  bulkUpdateSettings,
  deleteSetting,
  getNotificationPreferences,
  updateNotificationPreferences,
  getSystemInfo
} from '../controllers/settings.controller.js';

const router = express.Router();

// Public route
router.get('/public/home-videos', asyncHandler(getPublicHomeVideos));
router.get('/public/home-hero', asyncHandler(getPublicHomeHero));

// All routes require authentication
router.use(protect);

// ============================================
// NOTIFICATION PREFERENCES (User-specific)
// ============================================
router.get('/notifications/preferences', asyncHandler(getNotificationPreferences));
router.put('/notifications/preferences', asyncHandler(updateNotificationPreferences));

// ============================================
// SYSTEM INFO
// ============================================
router.get('/system/info', asyncHandler(getSystemInfo));

// ============================================
// SITE SETTINGS CRUD
// ============================================
router.get('/', asyncHandler(getAllSettings));
router.get('/group/:group', asyncHandler(getSettingsByGroup));
router.get('/key/:key', asyncHandler(getSetting));

// Admin only - modify settings
router.put('/bulk', restrictTo('SUPER_ADMIN', 'ADMIN'), asyncHandler(bulkUpdateSettings));
router.put('/:key', restrictTo('SUPER_ADMIN', 'ADMIN'), asyncHandler(upsertSetting));
router.delete('/:key', restrictTo('SUPER_ADMIN'), asyncHandler(deleteSetting));

export default router;
