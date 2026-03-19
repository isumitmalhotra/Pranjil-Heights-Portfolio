/* global process */
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { ApiError } from './error.middleware.js';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base upload directory (relative to project root)
const UPLOAD_BASE = process.env.UPLOAD_DIR || path.join(__dirname, '..', '..', 'uploads');

// Ensure upload directories exist
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Create all needed subdirectories
const UPLOAD_DIRS = {
  products: path.join(UPLOAD_BASE, 'products'),
  categories: path.join(UPLOAD_BASE, 'categories'),
  catalogues: path.join(UPLOAD_BASE, 'catalogues'),
  testimonials: path.join(UPLOAD_BASE, 'testimonials'),
  general: path.join(UPLOAD_BASE, 'general'),
};

// Initialize directories on module load
Object.values(UPLOAD_DIRS).forEach(ensureDir);

// Allowed MIME types
const IMAGE_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
const DOCUMENT_MIMES = ['application/pdf'];
const ALL_ALLOWED = [...IMAGE_MIMES, ...DOCUMENT_MIMES];

// File size limits
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;    // 5MB per image
const MAX_PDF_SIZE = 200 * 1024 * 1024;     // 200MB per PDF
const MAX_FILES = 10;                        // Max files per request

/**
 * Generate a unique filename with timestamp
 */
const generateFilename = (originalName) => {
  const ext = path.extname(originalName).toLowerCase();
  const baseName = path.basename(originalName, ext)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 50);
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${baseName}-${timestamp}-${random}${ext}`;
};

/**
 * Create multer storage for a specific folder
 */
const createStorage = (folder) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = UPLOAD_DIRS[folder] || UPLOAD_DIRS.general;
      ensureDir(dir);
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      cb(null, generateFilename(file.originalname));
    }
  });
};

/**
 * File filter for images only
 */
const imageFilter = (req, file, cb) => {
  if (IMAGE_MIMES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(400, `Invalid image type: ${file.mimetype}. Allowed: JPEG, PNG, WebP, GIF, SVG`), false);
  }
};

/**
 * File filter for PDFs only
 */
const pdfFilter = (req, file, cb) => {
  if (DOCUMENT_MIMES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(400, `Invalid file type: ${file.mimetype}. Only PDF files are allowed.`), false);
  }
};

/**
 * File filter for all allowed types (images + PDFs)
 */
const allFilter = (req, file, cb) => {
  if (ALL_ALLOWED.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(400, `Invalid file type: ${file.mimetype}. Allowed: JPEG, PNG, WebP, GIF, SVG, PDF`), false);
  }
};

// ==========================================
// PRE-CONFIGURED UPLOAD MIDDLEWARE
// ==========================================

/**
 * Upload single product image
 * Field name: 'image'
 */
export const uploadProductImage = multer({
  storage: createStorage('products'),
  fileFilter: imageFilter,
  limits: { fileSize: MAX_IMAGE_SIZE }
}).single('image');

/**
 * Upload multiple product images
 * Field name: 'images'
 */
export const uploadProductImages = multer({
  storage: createStorage('products'),
  fileFilter: imageFilter,
  limits: { fileSize: MAX_IMAGE_SIZE, files: MAX_FILES }
}).array('images', MAX_FILES);

/**
 * Upload single category image
 * Field name: 'image'
 */
export const uploadCategoryImage = multer({
  storage: createStorage('categories'),
  fileFilter: imageFilter,
  limits: { fileSize: MAX_IMAGE_SIZE }
}).single('image');

/**
 * Upload catalogue PDF
 * Field name: 'file'
 */
export const uploadCataloguePDF = multer({
  storage: createStorage('catalogues'),
  fileFilter: pdfFilter,
  limits: { fileSize: MAX_PDF_SIZE }
}).single('file');

/**
 * Upload catalogue with thumbnail
 * Fields: 'file' (PDF), 'thumbnail' (image)
 */
export const uploadCatalogueFiles = multer({
  storage: createStorage('catalogues'),
  fileFilter: allFilter,
  limits: { fileSize: MAX_PDF_SIZE }
}).fields([
  { name: 'file', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]);

/**
 * Upload testimonial avatar
 * Field name: 'image'
 */
export const uploadTestimonialImage = multer({
  storage: createStorage('testimonials'),
  fileFilter: imageFilter,
  limits: { fileSize: MAX_IMAGE_SIZE }
}).single('image');

/**
 * Upload general file (any allowed type)
 * Field name: 'file'
 */
export const uploadGeneral = multer({
  storage: createStorage('general'),
  fileFilter: allFilter,
  limits: { fileSize: MAX_PDF_SIZE }
}).single('file');

/**
 * Upload multiple general files
 * Field name: 'files'
 */
export const uploadMultipleGeneral = multer({
  storage: createStorage('general'),
  fileFilter: allFilter,
  limits: { fileSize: MAX_PDF_SIZE, files: MAX_FILES }
}).array('files', MAX_FILES);

// ==========================================
// HELPER FUNCTIONS
// ==========================================

/**
 * Get the public URL path for a file given its absolute path
 */
export const getFileUrl = (absolutePath) => {
  const relativePath = path.relative(UPLOAD_BASE, absolutePath).replace(/\\/g, '/');
  return `/api/uploads/${relativePath}`;
};

/**
 * Delete a file from disk given its URL path
 */
export const deleteFile = (fileUrl) => {
  if (!fileUrl || !fileUrl.startsWith('/uploads/')) return;
  
  const relativePath = fileUrl.replace('/uploads/', '');
  const absolutePath = path.join(UPLOAD_BASE, relativePath);
  
  if (fs.existsSync(absolutePath)) {
    fs.unlinkSync(absolutePath);
  }
};

/**
 * Multer error handler middleware
 * Use AFTER multer middleware to convert multer errors into API errors
 */
export const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      const maxPdfMb = Math.round(MAX_PDF_SIZE / (1024 * 1024));
      return next(new ApiError(400, `File too large. Maximum size is 5MB for images, ${maxPdfMb}MB for PDFs.`));
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return next(new ApiError(400, `Too many files. Maximum is ${MAX_FILES} files per upload.`));
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return next(new ApiError(400, `Unexpected field name: ${err.field}`));
    }
    return next(new ApiError(400, `Upload error: ${err.message}`));
  }
  next(err);
};

export { UPLOAD_BASE, UPLOAD_DIRS };
