import prisma from '../config/database.js';
import { ApiError } from '../middleware/error.middleware.js';

/**
 * @desc    Get all products
 * @route   GET /api/products
 * @access  Public
 */
export const getProducts = async (req, res) => {
  const {
    page = 1,
    limit = 12,
    category,
    search,
    sortBy = 'createdAt',
    order = 'desc',
    minPrice,
    maxPrice,
    isActive
  } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Build where clause
  const where = {};

  // Only show active products for public requests
  if (!req.user || !['ADMIN', 'SUPER_ADMIN'].includes(req.user.role)) {
    where.isActive = true;
  } else if (isActive !== undefined) {
    where.isActive = isActive === 'true';
  }

  if (category) {
    where.category = {
      slug: category
    };
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { sku: { contains: search, mode: 'insensitive' } }
    ];
  }

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = parseFloat(minPrice);
    if (maxPrice) where.price.lte = parseFloat(maxPrice);
  }

  // Build orderBy
  const orderBy = {};
  orderBy[sortBy] = order;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: {
          select: { id: true, name: true, slug: true }
        },
        images: {
          orderBy: { order: 'asc' }
        }
      },
      orderBy,
      skip,
      take: parseInt(limit)
    }),
    prisma.product.count({ where })
  ]);

  res.json({
    success: true,
    data: {
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }
  });
};

/**
 * @desc    Get featured products
 * @route   GET /api/products/featured
 * @access  Public
 */
export const getFeaturedProducts = async (req, res) => {
  const { limit = 8 } = req.query;

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      isFeatured: true
    },
    include: {
      category: {
        select: { id: true, name: true, slug: true }
      },
      images: {
        orderBy: { order: 'asc' },
        take: 1
      }
    },
    orderBy: { createdAt: 'desc' },
    take: parseInt(limit)
  });

  res.json({
    success: true,
    data: { products }
  });
};

/**
 * @desc    Search products
 * @route   GET /api/products/search
 * @access  Public
 */
export const searchProducts = async (req, res) => {
  const { q, limit = 10 } = req.query;

  if (!q || q.trim().length < 2) {
    return res.json({
      success: true,
      data: { products: [] }
    });
  }

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      OR: [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { sku: { contains: q, mode: 'insensitive' } },
        { category: { name: { contains: q, mode: 'insensitive' } } }
      ]
    },
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      images: {
        take: 1,
        orderBy: { order: 'asc' }
      },
      category: {
        select: { name: true, slug: true }
      }
    },
    take: parseInt(limit)
  });

  res.json({
    success: true,
    data: { products }
  });
};

/**
 * @desc    Get products by category
 * @route   GET /api/products/category/:slug
 * @access  Public
 */
export const getProductsByCategory = async (req, res) => {
  const { slug } = req.params;
  const { page = 1, limit = 12 } = req.query;

  const category = await prisma.category.findUnique({
    where: { slug }
  });

  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where: {
        categoryId: category.id,
        isActive: true
      },
      include: {
        category: {
          select: { id: true, name: true, slug: true }
        },
        images: {
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: parseInt(limit)
    }),
    prisma.product.count({
      where: {
        categoryId: category.id,
        isActive: true
      }
    })
  ]);

  res.json({
    success: true,
    data: {
      category,
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }
  });
};

/**
 * @desc    Get single product
 * @route   GET /api/products/:id
 * @access  Public
 */
export const getProduct = async (req, res) => {
  const { id } = req.params;

  // Try to find by ID or slug
  const product = await prisma.product.findFirst({
    where: {
      OR: [
        { id: isNaN(parseInt(id)) ? undefined : parseInt(id) },
        { slug: id }
      ],
      isActive: true
    },
    include: {
      category: {
        select: { id: true, name: true, slug: true, catalogueUrl: true }
      },
      images: {
        orderBy: { order: 'asc' }
      },
      specifications: true
    }
  });

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  // Get related products
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      isActive: true
    },
    include: {
      images: {
        take: 1,
        orderBy: { order: 'asc' }
      }
    },
    take: 4
  });

  res.json({
    success: true,
    data: {
      product,
      relatedProducts
    }
  });
};

/**
 * @desc    Create product
 * @route   POST /api/products
 * @access  Private/Admin
 */
export const createProduct = async (req, res) => {
  const {
    name,
    description,
    shortDescription,
    price,
    unit,
    categoryId,
    sku,
    specifications,
    features,
    applications,
    finishes,
    sortOrder,
    images,
    isFeatured,
    isActive,
    metaTitle,
    metaDescription
  } = req.body;

  // Generate slug
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  // Check if slug exists
  const existingProduct = await prisma.product.findUnique({
    where: { slug }
  });

  const finalSlug = existingProduct ? `${slug}-${Date.now()}` : slug;

  const product = await prisma.product.create({
    data: {
      name,
      slug: finalSlug,
      description,
      shortDescription,
      price: price ? parseFloat(price) : null,
      unit: unit || 'sq ft',
      categoryId: parseInt(categoryId),
      sku,
      features: features ? JSON.stringify(features) : null,
      applications: applications ? JSON.stringify(applications) : null,
      finishes: finishes ? (typeof finishes === 'string' ? finishes : JSON.stringify(finishes)) : null,
      sortOrder: sortOrder ? parseInt(sortOrder) : 0,
      isFeatured: isFeatured || false,
      isActive: isActive !== false,
      metaTitle: metaTitle || name,
      metaDescription: metaDescription || shortDescription,
      images: images ? {
        create: images.map((img, index) => ({
          url: img.url,
          alt: img.alt || name,
          order: index
        }))
      } : undefined,
      specifications: specifications ? {
        create: specifications.map(spec => ({
          name: spec.name,
          value: spec.value,
          unit: spec.unit || ''
        }))
      } : undefined
    },
    include: {
      category: true,
      images: true,
      specifications: true
    }
  });

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: { product }
  });
};

/**
 * @desc    Update product
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  // Check if product exists
  const existingProduct = await prisma.product.findUnique({
    where: { id: parseInt(id) }
  });

  if (!existingProduct) {
    throw new ApiError(404, 'Product not found');
  }

  // Handle images update
  if (updateData.images) {
    // Delete existing images
    await prisma.productImage.deleteMany({
      where: { productId: parseInt(id) }
    });
  }

  // Handle specifications update
  if (updateData.specifications) {
    await prisma.specification.deleteMany({
      where: { productId: parseInt(id) }
    });
  }

  // Build clean update data - only include fields that exist in schema
  const cleanUpdateData = {};
  
  // String fields
  if (updateData.name !== undefined) cleanUpdateData.name = updateData.name;
  if (updateData.slug !== undefined) cleanUpdateData.slug = updateData.slug;
  if (updateData.description !== undefined) cleanUpdateData.description = updateData.description;
  if (updateData.shortDescription !== undefined) cleanUpdateData.shortDescription = updateData.shortDescription;
  if (updateData.unit !== undefined) cleanUpdateData.unit = updateData.unit;
  if (updateData.sku !== undefined) cleanUpdateData.sku = updateData.sku;
  if (updateData.metaTitle !== undefined) cleanUpdateData.metaTitle = updateData.metaTitle;
  if (updateData.metaDescription !== undefined) cleanUpdateData.metaDescription = updateData.metaDescription;
  
  // Numeric fields - only set if provided and valid
  if (updateData.categoryId) cleanUpdateData.categoryId = parseInt(updateData.categoryId);
  if (updateData.price !== undefined && updateData.price !== null && updateData.price !== '') {
    cleanUpdateData.price = parseFloat(updateData.price);
  }
  if (updateData.sortOrder !== undefined) cleanUpdateData.sortOrder = parseInt(updateData.sortOrder) || 0;
  
  // Boolean fields
  if (updateData.isFeatured !== undefined) cleanUpdateData.isFeatured = updateData.isFeatured;
  if (updateData.isActive !== undefined) cleanUpdateData.isActive = updateData.isActive;
  
  // JSON fields
  if (updateData.features !== undefined) {
    cleanUpdateData.features = Array.isArray(updateData.features) 
      ? JSON.stringify(updateData.features) 
      : updateData.features;
  }
  if (updateData.applications !== undefined) {
    cleanUpdateData.applications = Array.isArray(updateData.applications) 
      ? JSON.stringify(updateData.applications) 
      : updateData.applications;
  }
  if (updateData.finishes !== undefined) {
    cleanUpdateData.finishes = typeof updateData.finishes === 'string' 
      ? updateData.finishes 
      : JSON.stringify(updateData.finishes);
  }
  
  // Nested creates
  if (updateData.images) {
    cleanUpdateData.images = {
      create: updateData.images.map((img, index) => ({
        url: img.url,
        alt: img.alt,
        order: index
      }))
    };
  }
  if (updateData.specifications) {
    cleanUpdateData.specifications = {
      create: updateData.specifications.map(spec => ({
        name: spec.name,
        value: spec.value,
        unit: spec.unit || ''
      }))
    };
  }

  const product = await prisma.product.update({
    where: { id: parseInt(id) },
    data: cleanUpdateData,
    include: {
      category: true,
      images: true,
      specifications: true
    }
  });

  res.json({
    success: true,
    message: 'Product updated successfully',
    data: { product }
  });
};

/**
 * @desc    Delete product
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  const product = await prisma.product.findUnique({
    where: { id: parseInt(id) }
  });

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  // Delete related images and specifications first
  await Promise.all([
    prisma.productImage.deleteMany({ where: { productId: parseInt(id) } }),
    prisma.specification.deleteMany({ where: { productId: parseInt(id) } })
  ]);

  await prisma.product.delete({
    where: { id: parseInt(id) }
  });

  res.json({
    success: true,
    message: 'Product deleted successfully'
  });
};
