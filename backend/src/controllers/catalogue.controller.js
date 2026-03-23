import prisma from '../config/database.js';
import { ApiError } from '../middleware/error.middleware.js';
import { sendCatalogueLeadAdminNotification } from '../config/email.js';

/**
 * Generate unique slug from name
 */
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// ==========================================
// PUBLIC ENDPOINTS
// ==========================================

/**
 * @desc    Get all active catalogues
 * @route   GET /api/catalogues
 * @access  Public
 */
export const getCatalogues = async (req, res) => {
  const { category } = req.query;

  const where = { isActive: true };
  
  if (category) {
    where.category = category;
  }

  const catalogues = await prisma.catalogue.findMany({
    where,
    orderBy: [
      { order: 'asc' },
      { createdAt: 'desc' }
    ],
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      fileUrl: true,
      fileSize: true,
      thumbnail: true,
      category: true,
      version: true,
      _count: {
        select: { downloads: true }
      }
    }
  });

  res.json({
    success: true,
    data: catalogues.map(cat => ({
      ...cat,
      downloadCount: cat._count.downloads,
      _count: undefined
    }))
  });
};

/**
 * @desc    Get single catalogue by slug
 * @route   GET /api/catalogues/:slug
 * @access  Public
 */
export const getCatalogueBySlug = async (req, res) => {
  const { slug } = req.params;

  const catalogue = await prisma.catalogue.findUnique({
    where: { slug },
    include: {
      _count: {
        select: { downloads: true }
      }
    }
  });

  if (!catalogue || !catalogue.isActive) {
    throw new ApiError(404, 'Catalogue not found');
  }

  res.json({
    success: true,
    data: {
      ...catalogue,
      downloadCount: catalogue._count.downloads,
      _count: undefined
    }
  });
};

/**
 * @desc    Download catalogue (track and redirect)
 * @route   POST /api/catalogues/:slug/download
 * @access  Public
 */
export const downloadCatalogue = async (req, res) => {
  const { slug } = req.params;
  const { name, email, phone, company, source } = req.body;

  const catalogue = await prisma.catalogue.findUnique({
    where: { slug }
  });

  if (!catalogue || !catalogue.isActive) {
    throw new ApiError(404, 'Catalogue not found');
  }

  // Track the download
  await prisma.catalogueDownload.create({
    data: {
      catalogueId: catalogue.id,
      name,
      email: email?.toLowerCase(),
      phone,
      company,
      source: source || 'website',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      referrer: req.headers['referer'] || req.headers['referrer']
    }
  });

  // Notify admin only for lead form submissions (not anonymous quick downloads)
  if (name || email || phone || company) {
    try {
      await sendCatalogueLeadAdminNotification({
        catalogueName: catalogue.name,
        name,
        email: email?.toLowerCase(),
        phone,
        company,
        source: source || 'website',
      });
    } catch (error) {
      console.error('Failed to send catalogue lead admin notification email:', error);
    }
  }

  res.json({
    success: true,
    message: 'Download tracked successfully',
    data: {
      fileUrl: catalogue.fileUrl,
      fileName: catalogue.name,
      fileSize: catalogue.fileSize
    }
  });
};

/**
 * @desc    Quick download without user info (just track)
 * @route   GET /api/catalogues/:slug/download
 * @access  Public
 */
export const quickDownload = async (req, res) => {
  const { slug } = req.params;
  const { source } = req.query;

  const catalogue = await prisma.catalogue.findUnique({
    where: { slug }
  });

  if (!catalogue || !catalogue.isActive) {
    throw new ApiError(404, 'Catalogue not found');
  }

  // Track the download (anonymous)
  await prisma.catalogueDownload.create({
    data: {
      catalogueId: catalogue.id,
      source: source || 'direct',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      referrer: req.headers['referer'] || req.headers['referrer']
    }
  });

  // Redirect to file URL
  res.redirect(catalogue.fileUrl);
};

// ==========================================
// ADMIN ENDPOINTS
// ==========================================

/**
 * @desc    Get all catalogues (admin)
 * @route   GET /api/catalogues/admin/all
 * @access  Private/Admin
 */
export const getAllCataloguesAdmin = async (req, res) => {
  const {
    page = 1,
    limit = 20,
    category,
    isActive,
    search,
    sortBy = 'createdAt',
    order = 'desc'
  } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const where = {};

  if (category) {
    where.category = category;
  }

  if (isActive !== undefined) {
    where.isActive = isActive === 'true';
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ];
  }

  const orderBy = {};
  orderBy[sortBy] = order;

  const [catalogues, total] = await Promise.all([
    prisma.catalogue.findMany({
      where,
      orderBy,
      skip,
      take: parseInt(limit),
      include: {
        _count: {
          select: { downloads: true }
        }
      }
    }),
    prisma.catalogue.count({ where })
  ]);

  res.json({
    success: true,
    data: catalogues.map(cat => ({
      ...cat,
      downloadCount: cat._count.downloads,
      _count: undefined
    })),
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  });
};

/**
 * @desc    Get catalogue by ID (admin)
 * @route   GET /api/catalogues/admin/:id
 * @access  Private/Admin
 */
export const getCatalogueById = async (req, res) => {
  const { id } = req.params;

  const catalogue = await prisma.catalogue.findUnique({
    where: { id: parseInt(id) },
    include: {
      _count: {
        select: { downloads: true }
      },
      downloads: {
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          company: true,
          source: true,
          createdAt: true
        }
      }
    }
  });

  if (!catalogue) {
    throw new ApiError(404, 'Catalogue not found');
  }

  res.json({
    success: true,
    data: {
      ...catalogue,
      downloadCount: catalogue._count.downloads,
      _count: undefined
    }
  });
};

/**
 * @desc    Create new catalogue
 * @route   POST /api/catalogues/admin
 * @access  Private/Admin
 */
export const createCatalogue = async (req, res) => {
  const {
    name,
    description,
    fileUrl,
    fileSize,
    thumbnail,
    category,
    version,
    isActive = true,
    order = 0
  } = req.body;

  // Generate slug
  let slug = generateSlug(name);
  
  // Check for existing slug
  const existing = await prisma.catalogue.findUnique({
    where: { slug }
  });
  
  if (existing) {
    slug = `${slug}-${Date.now()}`;
  }

  const catalogue = await prisma.catalogue.create({
    data: {
      name,
      slug,
      description,
      fileUrl,
      fileSize: fileSize ? parseInt(fileSize) : null,
      thumbnail,
      category,
      version,
      isActive,
      order: parseInt(order)
    }
  });

  res.status(201).json({
    success: true,
    message: 'Catalogue created successfully',
    data: catalogue
  });
};

/**
 * @desc    Update catalogue
 * @route   PUT /api/catalogues/admin/:id
 * @access  Private/Admin
 */
export const updateCatalogue = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    description,
    fileUrl,
    fileSize,
    thumbnail,
    category,
    version,
    isActive,
    order
  } = req.body;

  const existing = await prisma.catalogue.findUnique({
    where: { id: parseInt(id) }
  });

  if (!existing) {
    throw new ApiError(404, 'Catalogue not found');
  }

  const updateData = {};

  if (name !== undefined) {
    updateData.name = name;
    // Update slug if name changed
    if (name !== existing.name) {
      let newSlug = generateSlug(name);
      const slugExists = await prisma.catalogue.findFirst({
        where: { 
          slug: newSlug,
          id: { not: parseInt(id) }
        }
      });
      if (slugExists) {
        newSlug = `${newSlug}-${Date.now()}`;
      }
      updateData.slug = newSlug;
    }
  }

  if (description !== undefined) updateData.description = description;
  if (fileUrl !== undefined) updateData.fileUrl = fileUrl;
  if (fileSize !== undefined) updateData.fileSize = fileSize ? parseInt(fileSize) : null;
  if (thumbnail !== undefined) updateData.thumbnail = thumbnail;
  if (category !== undefined) updateData.category = category;
  if (version !== undefined) updateData.version = version;
  if (isActive !== undefined) updateData.isActive = isActive;
  if (order !== undefined) updateData.order = parseInt(order);

  const catalogue = await prisma.catalogue.update({
    where: { id: parseInt(id) },
    data: updateData
  });

  res.json({
    success: true,
    message: 'Catalogue updated successfully',
    data: catalogue
  });
};

/**
 * @desc    Delete catalogue
 * @route   DELETE /api/catalogues/admin/:id
 * @access  Private/Admin
 */
export const deleteCatalogue = async (req, res) => {
  const { id } = req.params;

  const catalogue = await prisma.catalogue.findUnique({
    where: { id: parseInt(id) }
  });

  if (!catalogue) {
    throw new ApiError(404, 'Catalogue not found');
  }

  await prisma.catalogue.delete({
    where: { id: parseInt(id) }
  });

  res.json({
    success: true,
    message: 'Catalogue deleted successfully'
  });
};

/**
 * @desc    Get download statistics
 * @route   GET /api/catalogues/admin/stats
 * @access  Private/Admin
 */
export const getDownloadStats = async (req, res) => {
  const { period = '30' } = req.query;
  
  const daysAgo = new Date();
  daysAgo.setDate(daysAgo.getDate() - parseInt(period));

  // Get total downloads
  const totalDownloads = await prisma.catalogueDownload.count();

  // Get downloads in period
  const periodDownloads = await prisma.catalogueDownload.count({
    where: {
      createdAt: { gte: daysAgo }
    }
  });

  // Get unique emails in period
  const uniqueUsers = await prisma.catalogueDownload.groupBy({
    by: ['email'],
    where: {
      email: { not: null },
      createdAt: { gte: daysAgo }
    }
  });

  // Get downloads by catalogue
  const byCatalogue = await prisma.catalogue.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      category: true,
      _count: {
        select: { downloads: true }
      }
    },
    orderBy: {
      downloads: {
        _count: 'desc'
      }
    },
    take: 10
  });

  // Get downloads by source
  const bySource = await prisma.catalogueDownload.groupBy({
    by: ['source'],
    _count: {
      id: true
    },
    where: {
      createdAt: { gte: daysAgo }
    }
  });

  // Get daily downloads for chart
  const dailyDownloads = await prisma.$queryRaw`
    SELECT 
      DATE(createdAt) as date,
      COUNT(*) as count
    FROM catalogue_downloads
    WHERE createdAt >= ${daysAgo}
    GROUP BY DATE(createdAt)
    ORDER BY date ASC
  `;

  res.json({
    success: true,
    data: {
      totalDownloads,
      periodDownloads,
      uniqueUsers: uniqueUsers.length,
      period: parseInt(period),
      topCatalogues: byCatalogue.map(cat => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        category: cat.category,
        downloads: cat._count.downloads
      })),
      bySource: bySource.map(s => ({
        source: s.source || 'unknown',
        count: s._count.id
      })),
      dailyDownloads
    }
  });
};

/**
 * @desc    Get download history
 * @route   GET /api/catalogues/admin/downloads
 * @access  Private/Admin
 */
export const getDownloadHistory = async (req, res) => {
  const {
    page = 1,
    limit = 50,
    catalogueId,
    email,
    startDate,
    endDate,
    source
  } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const where = {};

  if (catalogueId) {
    where.catalogueId = parseInt(catalogueId);
  }

  if (email) {
    where.email = { contains: email, mode: 'insensitive' };
  }

  if (source) {
    where.source = source;
  }

  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = new Date(startDate);
    if (endDate) where.createdAt.lte = new Date(endDate);
  }

  const [downloads, total] = await Promise.all([
    prisma.catalogueDownload.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: parseInt(limit),
      include: {
        catalogue: {
          select: {
            id: true,
            name: true,
            slug: true,
            category: true
          }
        }
      }
    }),
    prisma.catalogueDownload.count({ where })
  ]);

  res.json({
    success: true,
    data: downloads,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  });
};

/**
 * @desc    Export downloads to CSV
 * @route   GET /api/catalogues/admin/downloads/export
 * @access  Private/Admin
 */
export const exportDownloads = async (req, res) => {
  const { catalogueId, startDate, endDate } = req.query;

  const where = {};

  if (catalogueId) {
    where.catalogueId = parseInt(catalogueId);
  }

  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = new Date(startDate);
    if (endDate) where.createdAt.lte = new Date(endDate);
  }

  const downloads = await prisma.catalogueDownload.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      catalogue: {
        select: { name: true }
      }
    }
  });

  // Generate CSV
  const headers = ['Date', 'Catalogue', 'Name', 'Email', 'Phone', 'Company', 'Source', 'IP Address'];
  const rows = downloads.map(d => [
    new Date(d.createdAt).toISOString(),
    d.catalogue.name,
    d.name || '',
    d.email || '',
    d.phone || '',
    d.company || '',
    d.source || '',
    d.ipAddress || ''
  ]);

  const csv = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=catalogue-downloads-${Date.now()}.csv`);
  res.send(csv);
};
