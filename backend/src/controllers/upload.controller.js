/* global process */
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import prisma from '../config/database.js';
import { ApiError } from '../middleware/error.middleware.js';
import { getFileUrl, deleteFile, UPLOAD_BASE, UPLOAD_DIRS } from '../middleware/upload.middleware.js';

// ==========================================
// UPLOAD SINGLE FILE
// ==========================================

/**
 * @desc    Upload a single file (image or document)
 * @route   POST /api/upload
 * @access  Private/Admin
 */
export const uploadFile = async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'No file uploaded');
  }

  const file = req.file;
  const fileUrl = getFileUrl(file.path);

  // Save to Media table for tracking
  const media = await prisma.media.create({
    data: {
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      url: fileUrl,
      alt: req.body.alt || file.originalname,
      folder: req.body.folder || 'general',
    }
  });

  res.status(201).json({
    success: true,
    message: 'File uploaded successfully',
    data: {
      id: media.id,
      url: fileUrl,
      filename: media.filename,
      originalName: media.originalName,
      mimeType: media.mimeType,
      size: media.size,
      alt: media.alt,
    }
  });
};

// ==========================================
// UPLOAD MULTIPLE FILES
// ==========================================

/**
 * @desc    Upload multiple files
 * @route   POST /api/upload/multiple
 * @access  Private/Admin
 */
export const uploadMultipleFiles = async (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw new ApiError(400, 'No files uploaded');
  }

  const folder = req.body.folder || 'general';
  const results = [];

  for (const file of req.files) {
    const fileUrl = getFileUrl(file.path);

    const media = await prisma.media.create({
      data: {
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        url: fileUrl,
        alt: file.originalname,
        folder,
      }
    });

    results.push({
      id: media.id,
      url: fileUrl,
      filename: media.filename,
      originalName: media.originalName,
      mimeType: media.mimeType,
      size: media.size,
    });
  }

  res.status(201).json({
    success: true,
    message: `${results.length} file(s) uploaded successfully`,
    data: results,
  });
};

// ==========================================
// UPLOAD PRODUCT IMAGE (with thumbnail generation)
// ==========================================

/**
 * @desc    Upload product image with auto-generated thumbnail
 * @route   POST /api/upload/product-image
 * @access  Private/Admin
 */
export const uploadProductImage = async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'No image uploaded');
  }

  const file = req.file;
  const fileUrl = getFileUrl(file.path);

  // Generate thumbnail for non-SVG images
  let thumbnailUrl = null;
  if (file.mimetype !== 'image/svg+xml') {
    try {
      const thumbFilename = `thumb-${file.filename}`;
      const thumbPath = path.join(path.dirname(file.path), thumbFilename);
      
      await sharp(file.path)
        .resize(300, 300, { fit: 'cover', withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toFile(thumbPath);

      thumbnailUrl = getFileUrl(thumbPath);
    } catch {
      // Thumbnail generation failed, continue without it
    }
  }

  // Save to Media table
  const media = await prisma.media.create({
    data: {
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      url: fileUrl,
      alt: req.body.alt || file.originalname,
      folder: 'products',
    }
  });

  res.status(201).json({
    success: true,
    message: 'Product image uploaded successfully',
    data: {
      id: media.id,
      url: fileUrl,
      thumbnailUrl,
      filename: media.filename,
      originalName: media.originalName,
      mimeType: media.mimeType,
      size: media.size,
      alt: media.alt,
    }
  });
};

// ==========================================
// UPLOAD CATEGORY IMAGE
// ==========================================

/**
 * @desc    Upload category image
 * @route   POST /api/upload/category-image
 * @access  Private/Admin
 */
export const uploadCategoryImage = async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'No image uploaded');
  }

  const file = req.file;
  const fileUrl = getFileUrl(file.path);

  const media = await prisma.media.create({
    data: {
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      url: fileUrl,
      alt: req.body.alt || file.originalname,
      folder: 'categories',
    }
  });

  res.status(201).json({
    success: true,
    message: 'Category image uploaded successfully',
    data: {
      id: media.id,
      url: fileUrl,
      filename: media.filename,
      originalName: media.originalName,
      size: media.size,
      alt: media.alt,
    }
  });
};

// ==========================================
// UPLOAD CATALOGUE (PDF + optional thumbnail)
// ==========================================

/**
 * @desc    Upload catalogue PDF file
 * @route   POST /api/upload/catalogue
 * @access  Private/Admin
 */
export const uploadCatalogue = async (req, res) => {
  const files = req.files || {};
  const pdfFile = files.file?.[0];
  const thumbFile = files.thumbnail?.[0];

  if (!pdfFile) {
    throw new ApiError(400, 'No PDF file uploaded');
  }

  const pdfUrl = getFileUrl(pdfFile.path);
  const thumbnailUrl = thumbFile ? getFileUrl(thumbFile.path) : null;

  // Save PDF to media
  const media = await prisma.media.create({
    data: {
      filename: pdfFile.filename,
      originalName: pdfFile.originalname,
      mimeType: pdfFile.mimetype,
      size: pdfFile.size,
      url: pdfUrl,
      alt: req.body.alt || pdfFile.originalname,
      folder: 'catalogues',
    }
  });

  res.status(201).json({
    success: true,
    message: 'Catalogue uploaded successfully',
    data: {
      id: media.id,
      url: pdfUrl,
      thumbnailUrl,
      filename: media.filename,
      originalName: media.originalName,
      mimeType: media.mimeType,
      size: media.size,
    }
  });
};

// ==========================================
// GET ALL MEDIA FILES
// ==========================================

/**
 * @desc    Get all uploaded media with pagination and filtering
 * @route   GET /api/upload/media
 * @access  Private/Admin
 */
export const getMedia = async (req, res) => {
  const { page = 1, limit = 20, folder, mimeType, search } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const where = {};
  if (folder) where.folder = folder;
  if (mimeType) where.mimeType = { contains: mimeType };
  if (search) {
    where.OR = [
      { originalName: { contains: search } },
      { alt: { contains: search } },
    ];
  }

  const [media, total] = await Promise.all([
    prisma.media.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: parseInt(limit),
    }),
    prisma.media.count({ where }),
  ]);

  res.json({
    success: true,
    data: {
      media,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      }
    }
  });
};

// ==========================================
// DELETE MEDIA
// ==========================================

/**
 * @desc    Delete a media file (from disk and DB)
 * @route   DELETE /api/upload/:id
 * @access  Private/Admin
 */
export const deleteMedia = async (req, res) => {
  const { id } = req.params;

  const media = await prisma.media.findUnique({
    where: { id: parseInt(id) }
  });

  if (!media) {
    throw new ApiError(404, 'Media file not found');
  }

  // Delete file from disk
  deleteFile(media.url);

  // Delete thumbnail if it exists (for products)
  const thumbUrl = media.url.replace(media.filename, `thumb-${media.filename}`);
  deleteFile(thumbUrl);

  // Delete from database
  await prisma.media.delete({
    where: { id: parseInt(id) }
  });

  res.json({
    success: true,
    message: 'File deleted successfully'
  });
};

// ==========================================
// GET STORAGE STATS
// ==========================================

/**
 * @desc    Get storage usage statistics
 * @route   GET /api/upload/stats
 * @access  Private/Admin
 */
export const getStorageStats = async (req, res) => {
  // Get file counts by folder
  const folderStats = await prisma.media.groupBy({
    by: ['folder'],
    _count: { id: true },
    _sum: { size: true },
  });

  // Get total counts
  const totalFiles = await prisma.media.count();
  const totalSize = await prisma.media.aggregate({
    _sum: { size: true }
  });

  // Get disk usage of uploads directory
  let diskUsage = 0;
  const getDirSize = (dirPath) => {
    if (!fs.existsSync(dirPath)) return 0;
    let size = 0;
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isFile()) {
        size += fs.statSync(fullPath).size;
      } else if (entry.isDirectory()) {
        size += getDirSize(fullPath);
      }
    }
    return size;
  };
  diskUsage = getDirSize(UPLOAD_BASE);

  res.json({
    success: true,
    data: {
      totalFiles,
      totalSizeDB: totalSize._sum.size || 0,
      diskUsage,
      diskUsageFormatted: formatBytes(diskUsage),
      folders: folderStats.map(f => ({
        name: f.folder,
        files: f._count.id,
        size: f._sum.size || 0,
        sizeFormatted: formatBytes(f._sum.size || 0),
      })),
    }
  });
};

/**
 * Format bytes to human readable string
 */
const formatBytes = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};
