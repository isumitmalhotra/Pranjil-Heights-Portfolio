import express from 'express';
import { protect, restrictTo } from '../middleware/auth.middleware.js';
import { validateContact, validateId, validatePagination } from '../middleware/validators.js';
import { validate } from '../middleware/validate.middleware.js';
import { asyncHandler } from '../middleware/error.middleware.js';
import {
  submitContact,
  getContacts,
  getContact,
  updateContactStatus,
  deleteContact,
  exportContacts
} from '../controllers/contact.controller.js';

const router = express.Router();

// Public route - Submit contact form
router.post('/', validateContact, validate, asyncHandler(submitContact));

// Admin routes
router.use(protect);
router.use(restrictTo('ADMIN', 'SUPER_ADMIN'));

router.get('/export', asyncHandler(exportContacts));
router.get('/', validatePagination, validate, asyncHandler(getContacts));
router.get('/:id', validateId, validate, asyncHandler(getContact));
router.put('/:id/status', validateId, validate, asyncHandler(updateContactStatus));
router.delete('/:id', validateId, validate, asyncHandler(deleteContact));

export default router;
