import express from 'express';
import { protect, restrictTo } from '../middleware/auth.middleware.js';
import { validateDealerApplication, validateId, validatePagination } from '../middleware/validators.js';
import { validate } from '../middleware/validate.middleware.js';
import { asyncHandler } from '../middleware/error.middleware.js';
import {
  submitDealerApplication,
  getDealerApplications,
  getDealerApplication,
  updateDealerStatus,
  deleteDealerApplication,
  exportDealers
} from '../controllers/dealer.controller.js';

const router = express.Router();

// Public route - Submit dealer application
router.post('/apply', validateDealerApplication, validate, asyncHandler(submitDealerApplication));

// Admin routes
router.use(protect);
router.use(restrictTo('ADMIN', 'SUPER_ADMIN'));

router.get('/export', asyncHandler(exportDealers));
router.get('/', validatePagination, validate, asyncHandler(getDealerApplications));
router.get('/:id', validateId, validate, asyncHandler(getDealerApplication));
router.put('/:id/status', validateId, validate, asyncHandler(updateDealerStatus));
router.patch('/:id/status', validateId, validate, asyncHandler(updateDealerStatus));
router.delete('/:id', validateId, validate, asyncHandler(deleteDealerApplication));

export default router;
