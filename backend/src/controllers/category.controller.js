import prisma from '../config/database.js';
import { ApiError } from '../middleware/error.middleware.js';

/**
 * @desc    Get all categories
 * @route   GET /api/categories
 * @access  Public
 */
export const getCategories = async (req, res) => {
  const { includeProducts = false, isActive } = req.query;

  const where = {};
  
  // Only show active categories for public requests
  if (!req.user || !['ADMIN', 'SUPER_ADMIN'].includes(req.user.role)) {
    where.isActive = true;
  } else if (isActive !== undefined) {
    where.isActive = isActive === 'true';
  }

  const categories = await prisma.category.findMany({
    where,
    include: {
      _count: {
        select: { products: true }
      },
      products: includeProducts === 'true' ? {
        where: { isActive: true },
        take: 4,
        include: {
          images: {
            take: 1,
            orderBy: { order: 'asc' }
          }
        }
      } : false
    },
    orderBy: { order: 'asc' }
  });

  res.json({
    success: true,
    data: { categories }
  });
};

/**
 * @desc    Get single category by slug
 * @route   GET /api/categories/:slug
 * @access  Public
 */
export const getCategoryBySlug = async (req, res) => {
  const { slug } = req.params;

  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      _count: {
        select: { products: true }
      }
    }
  });

  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  if (!category.isActive && (!req.user || !['ADMIN', 'SUPER_ADMIN'].includes(req.user.role))) {
    throw new ApiError(404, 'Category not found');
  }

  res.json({
    success: true,
    data: { category }
  });
};

/**
 * @desc    Create category
 * @route   POST /api/categories
 * @access  Private/Admin
 */
export const createCategory = async (req, res) => {
  const { name, description, image, catalogueUrl, order, isActive, metaTitle, metaDescription } = req.body;

  // Generate slug
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  // Check if slug exists
  const existingCategory = await prisma.category.findUnique({
    where: { slug }
  });

  if (existingCategory) {
    throw new ApiError(409, 'Category with this name already exists');
  }

  // Get max order if not provided
  let categoryOrder = order;
  if (categoryOrder === undefined) {
    const maxOrder = await prisma.category.aggregate({
      _max: { order: true }
    });
    categoryOrder = (maxOrder._max.order || 0) + 1;
  }

  const category = await prisma.category.create({
    data: {
      name,
      slug,
      description,
      image,
      catalogueUrl,
      order: categoryOrder,
      isActive: isActive !== false,
      metaTitle: metaTitle || name,
      metaDescription: metaDescription || description
    }
  });

  res.status(201).json({
    success: true,
    message: 'Category created successfully',
    data: { category }
  });
};

/**
 * @desc    Update category
 * @route   PUT /api/categories/:id
 * @access  Private/Admin
 */
export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const existingCategory = await prisma.category.findUnique({
    where: { id: parseInt(id) }
  });

  if (!existingCategory) {
    throw new ApiError(404, 'Category not found');
  }

  // Only allow safe fields
  const allowedFields = ['name', 'description', 'image', 'isActive', 'order', 'slug'];
  const safeData = {};
  for (const field of allowedFields) {
    if (updateData[field] !== undefined) {
      safeData[field] = updateData[field];
    }
  }

  // If name is being updated, check for slug conflicts
  if (safeData.name && safeData.name !== existingCategory.name) {
    const newSlug = safeData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    const slugExists = await prisma.category.findFirst({
      where: {
        slug: newSlug,
        id: { not: parseInt(id) }
      }
    });

    if (slugExists) {
      throw new ApiError(409, 'Category with this name already exists');
    }

    safeData.slug = newSlug;
  }

  const category = await prisma.category.update({
    where: { id: parseInt(id) },
    data: safeData
  });

  res.json({
    success: true,
    message: 'Category updated successfully',
    data: { category }
  });
};

/**
 * @desc    Delete category
 * @route   DELETE /api/categories/:id
 * @access  Private/Admin
 */
export const deleteCategory = async (req, res) => {
  const { id } = req.params;

  const category = await prisma.category.findUnique({
    where: { id: parseInt(id) },
    include: {
      _count: {
        select: { products: true }
      }
    }
  });

  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  // Check if category has products
  if (category._count.products > 0) {
    throw new ApiError(400, `Cannot delete category with ${category._count.products} products. Please reassign or delete products first.`);
  }

  await prisma.category.delete({
    where: { id: parseInt(id) }
  });

  res.json({
    success: true,
    message: 'Category deleted successfully'
  });
};

/**
 * @desc    Reorder categories
 * @route   PUT /api/categories/reorder
 * @access  Private/Admin
 */
export const reorderCategories = async (req, res) => {
  const { categories } = req.body; // Array of { id, order }

  const updates = categories.map(({ id, order }) =>
    prisma.category.update({
      where: { id: parseInt(id) },
      data: { order }
    })
  );

  await prisma.$transaction(updates);

  res.json({
    success: true,
    message: 'Categories reordered successfully'
  });
};
