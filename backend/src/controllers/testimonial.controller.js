import prisma from '../config/database.js';
import { ApiError } from '../middleware/error.middleware.js';

/**
 * @desc    Get active testimonials
 * @route   GET /api/testimonials
 * @access  Public
 */
export const getActiveTestimonials = async (req, res) => {
  const { limit = 10 } = req.query;

  const testimonials = await prisma.testimonial.findMany({
    where: { isActive: true },
    orderBy: [
      { isFeatured: 'desc' },
      { order: 'asc' },
      { createdAt: 'desc' }
    ],
    take: parseInt(limit)
  });

  res.json({
    success: true,
    data: { testimonials }
  });
};

/**
 * @desc    Get all testimonials (Admin)
 * @route   GET /api/testimonials/all
 * @access  Private/Admin
 */
export const getAllTestimonials = async (req, res) => {
  const {
    page = 1,
    limit = 20,
    isActive,
    isFeatured,
    search,
    sortBy = 'createdAt',
    order = 'desc'
  } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const where = {};

  if (isActive !== undefined) {
    where.isActive = isActive === 'true';
  }

  if (isFeatured !== undefined) {
    where.isFeatured = isFeatured === 'true';
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { company: { contains: search, mode: 'insensitive' } },
      { content: { contains: search, mode: 'insensitive' } }
    ];
  }

  const orderBy = {};
  orderBy[sortBy] = order;

  const [testimonials, total] = await Promise.all([
    prisma.testimonial.findMany({
      where,
      orderBy,
      skip,
      take: parseInt(limit)
    }),
    prisma.testimonial.count({ where })
  ]);

  res.json({
    success: true,
    data: {
      testimonials,
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
 * @desc    Get single testimonial
 * @route   GET /api/testimonials/:id
 * @access  Private/Admin
 */
export const getTestimonial = async (req, res) => {
  const { id } = req.params;

  const testimonial = await prisma.testimonial.findUnique({
    where: { id: parseInt(id) }
  });

  if (!testimonial) {
    throw new ApiError(404, 'Testimonial not found');
  }

  res.json({
    success: true,
    data: { testimonial }
  });
};

/**
 * @desc    Create testimonial
 * @route   POST /api/testimonials
 * @access  Private/Admin
 */
export const createTestimonial = async (req, res) => {
  const {
    name,
    designation,
    company,
    location,
    content,
    rating,
    image,
    projectType,
    projectImages,
    isFeatured,
    isActive,
    order
  } = req.body;

  // Get max order if not provided
  let testimonialOrder = order;
  if (testimonialOrder === undefined) {
    const maxOrder = await prisma.testimonial.aggregate({
      _max: { order: true }
    });
    testimonialOrder = (maxOrder._max.order || 0) + 1;
  }

  const testimonial = await prisma.testimonial.create({
    data: {
      name,
      designation,
      company,
      location,
      content,
      rating: rating ? parseInt(rating) : 5,
      image,
      projectType,
      projectImages: projectImages ? JSON.stringify(projectImages) : null,
      isFeatured: isFeatured || false,
      isActive: isActive !== false,
      order: testimonialOrder
    }
  });

  res.status(201).json({
    success: true,
    message: 'Testimonial created successfully',
    data: { testimonial }
  });
};

/**
 * @desc    Update testimonial
 * @route   PUT /api/testimonials/:id
 * @access  Private/Admin
 */
export const updateTestimonial = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const existingTestimonial = await prisma.testimonial.findUnique({
    where: { id: parseInt(id) }
  });

  if (!existingTestimonial) {
    throw new ApiError(404, 'Testimonial not found');
  }

  // Convert rating to integer if provided
  if (updateData.rating) {
    updateData.rating = parseInt(updateData.rating);
  }

  // Only allow safe fields to prevent mass assignment
  const allowedFields = ['name', 'company', 'position', 'content', 'rating', 'image', 'isActive', 'isFeatured', 'order'];
  const safeData = {};
  for (const field of allowedFields) {
    if (updateData[field] !== undefined) {
      safeData[field] = updateData[field];
    }
  }

  const testimonial = await prisma.testimonial.update({
    where: { id: parseInt(id) },
    data: safeData
  });

  res.json({
    success: true,
    message: 'Testimonial updated successfully',
    data: { testimonial }
  });
};

/**
 * @desc    Delete testimonial
 * @route   DELETE /api/testimonials/:id
 * @access  Private/Admin
 */
export const deleteTestimonial = async (req, res) => {
  const { id } = req.params;

  const testimonial = await prisma.testimonial.findUnique({
    where: { id: parseInt(id) }
  });

  if (!testimonial) {
    throw new ApiError(404, 'Testimonial not found');
  }

  await prisma.testimonial.delete({
    where: { id: parseInt(id) }
  });

  res.json({
    success: true,
    message: 'Testimonial deleted successfully'
  });
};

/**
 * @desc    Reorder testimonials
 * @route   PUT /api/testimonials/reorder
 * @access  Private/Admin
 */
export const reorderTestimonials = async (req, res) => {
  const { testimonials } = req.body; // Array of { id, order }

  const updates = testimonials.map(({ id, order }) =>
    prisma.testimonial.update({
      where: { id: parseInt(id) },
      data: { order }
    })
  );

  await prisma.$transaction(updates);

  res.json({
    success: true,
    message: 'Testimonials reordered successfully'
  });
};

/**
 * @desc    Toggle testimonial featured status
 * @route   PUT /api/testimonials/:id/featured
 * @access  Private/Admin
 */
export const toggleFeatured = async (req, res) => {
  const { id } = req.params;

  const testimonial = await prisma.testimonial.findUnique({
    where: { id: parseInt(id) }
  });

  if (!testimonial) {
    throw new ApiError(404, 'Testimonial not found');
  }

  const updated = await prisma.testimonial.update({
    where: { id: parseInt(id) },
    data: { isFeatured: !testimonial.isFeatured }
  });

  res.json({
    success: true,
    message: `Testimonial ${updated.isFeatured ? 'featured' : 'unfeatured'} successfully`,
    data: { testimonial: updated }
  });
};

/**
 * @desc    Toggle testimonial active status
 * @route   PUT /api/testimonials/:id/toggle-active
 * @access  Private/Admin
 */
export const toggleActive = async (req, res) => {
  const { id } = req.params;

  const testimonial = await prisma.testimonial.findUnique({
    where: { id: parseInt(id) }
  });

  if (!testimonial) {
    throw new ApiError(404, 'Testimonial not found');
  }

  const updated = await prisma.testimonial.update({
    where: { id: parseInt(id) },
    data: { isActive: !testimonial.isActive }
  });

  res.json({
    success: true,
    message: `Testimonial ${updated.isActive ? 'activated' : 'deactivated'} successfully`,
    data: { testimonial: updated }
  });
};
