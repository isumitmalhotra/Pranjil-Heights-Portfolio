import { body, param, query } from 'express-validator';

/**
 * Common Validators
 */

// MongoDB/UUID ID validator
export const validateId = [
  param('id')
    .notEmpty()
    .withMessage('ID is required')
];

// Pagination validators
export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
];

/**
 * Auth Validators
 */
export const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

export const validateRegister = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
];

/**
 * Contact Validators
 */
export const validateContact = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('phone')
    .optional()
    .matches(/^[+]?[\d\s-]{10,15}$/)
    .withMessage('Please provide a valid phone number'),
  body('company')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Company name cannot exceed 200 characters'),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Message must be between 10 and 2000 characters'),
  body('subject')
    .trim()
    .notEmpty()
    .withMessage('Subject is required')
    .isLength({ max: 200 })
    .withMessage('Subject cannot exceed 200 characters')
];

/**
 * Quote Request Validators
 */
export const validateQuoteRequest = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('phone')
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^[+]?[\d\s-]{10,15}$/)
    .withMessage('Please provide a valid phone number'),
  body('company')
    .optional()
    .trim(),
  body('products')
    .optional()
    .isArray()
    .withMessage('Products must be an array'),
  body('quantity')
    .optional()
    .trim(),
  body('requirements')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Requirements cannot exceed 2000 characters'),
  body('projectType')
    .trim()
    .notEmpty()
    .withMessage('Project type is required')
    .isLength({ max: 100 })
    .withMessage('Project type cannot exceed 100 characters')
];

/**
 * Dealer Application Validators
 */
export const validateDealerApplication = [
  body('companyName')
    .trim()
    .notEmpty()
    .withMessage('Company name is required'),
  body('contactPerson')
    .trim()
    .notEmpty()
    .withMessage('Contact person name is required'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('phone')
    .notEmpty()
    .withMessage('Phone number is required'),
  body('address')
    .trim()
    .notEmpty()
    .withMessage('Address is required'),
  body('city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  body('state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),
  body('pincode')
    .optional()
    .matches(/^\d{6}$/)
    .withMessage('Please provide a valid 6-digit pincode'),
  body('businessType')
    .optional()
    .trim(),
  body('experience')
    .optional()
    .trim()
];

/**
 * Newsletter Validators
 */
export const validateNewsletter = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail()
];

/**
 * Product Validators
 */
export const validateProduct = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required'),
  body('description')
    .optional()
    .trim(),
  body('categoryId')
    .notEmpty()
    .withMessage('Category is required'),
  body('specifications')
    .optional(),
  body('colors')
    .optional()
    .isArray()
    .withMessage('Colors must be an array'),
  body('images')
    .optional()
    .isArray()
    .withMessage('Images must be an array')
];

/**
 * Category Validators
 */
export const validateCategory = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Category name is required'),
  body('slug')
    .optional()
    .trim()
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Slug can only contain lowercase letters, numbers, and hyphens'),
  body('description')
    .optional()
    .trim()
];

/**
 * Testimonial Validators
 */
export const validateTestimonial = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required'),
  body('company')
    .optional()
    .trim(),
  body('role')
    .optional()
    .trim(),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Testimonial content is required'),
  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5')
];
