import prisma from '../config/database.js';
import { ApiError } from '../middleware/error.middleware.js';
import { sendEmail, sendQuoteConfirmation, sendQuoteAdminNotification } from '../config/email.js';

/**
 * @desc    Submit quote request
 * @route   POST /api/quotes
 * @access  Public
 */
export const submitQuote = async (req, res) => {
  const {
    name,
    email,
    phone,
    company,
    projectType,
    projectDetails,
    estimatedArea,
    areaUnit,
    preferredProducts,
    budget,
    timeline,
    deliveryAddress,
    additionalNotes,
    priority = 'normal'
  } = req.body;

  // Generate quote reference number
  const quoteRef = `QR-${Date.now().toString(36).toUpperCase()}`;

  const quote = await prisma.quoteRequest.create({
    data: {
      referenceNumber: quoteRef,
      name,
      email: email.toLowerCase(),
      phone,
      company,
      projectType,
      projectDetails,
      estimatedArea: estimatedArea ? parseFloat(estimatedArea) : null,
      areaUnit: areaUnit || 'sq ft',
      preferredProducts: preferredProducts ? JSON.stringify(preferredProducts) : null,
      budget,
      timeline,
      deliveryAddress,
      additionalNotes,
      ipAddress: req.ip
    }
  });

  // Parse preferred products for email
  let productsArray = [];
  try {
    productsArray = typeof preferredProducts === 'string' 
      ? JSON.parse(preferredProducts) 
      : (Array.isArray(preferredProducts) ? preferredProducts : []);
  } catch {
    productsArray = [];
  }

  const emailData = {
    name,
    email: email.toLowerCase(),
    phone,
    company,
    projectType,
    projectDetails,
    estimatedArea,
    areaUnit: areaUnit || 'sq ft',
    products: productsArray,
    budget,
    timeline,
    deliveryAddress,
    additionalNotes,
    referenceNumber: quoteRef,
    priority,
    submittedAt: quote.createdAt,
  };

  // Send confirmation email to user
  try {
    await sendQuoteConfirmation(emailData);
  } catch (error) {
    console.error('Failed to send quote confirmation email:', error);
  }

  // Send notification to admin
  try {
    await sendQuoteAdminNotification(emailData);
  } catch (error) {
    console.error('Failed to send admin notification:', error);
  }

  res.status(201).json({
    success: true,
    message: 'Your quote request has been submitted successfully!',
    data: {
      referenceNumber: quoteRef,
      submittedAt: quote.createdAt
    }
  });
};

/**
 * @desc    Get all quote requests
 * @route   GET /api/quotes
 * @access  Private/Admin
 */
export const getQuotes = async (req, res) => {
  const {
    page = 1,
    limit = 20,
    status,
    projectType,
    search,
    sortBy = 'createdAt',
    order = 'desc'
  } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const where = {};

  if (status) {
    where.status = status;
  }

  if (projectType) {
    where.projectType = projectType;
  }

  if (search) {
    where.OR = [
      { referenceNumber: { contains: search, mode: 'insensitive' } },
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { company: { contains: search, mode: 'insensitive' } }
    ];
  }

  const orderBy = {};
  orderBy[sortBy] = order;

  const [quotes, total] = await Promise.all([
    prisma.quoteRequest.findMany({
      where,
      orderBy,
      skip,
      take: parseInt(limit)
    }),
    prisma.quoteRequest.count({ where })
  ]);

  res.json({
    success: true,
    data: {
      quotes,
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
 * @desc    Get single quote request
 * @route   GET /api/quotes/:id
 * @access  Private/Admin
 */
export const getQuote = async (req, res) => {
  const { id } = req.params;

  const quote = await prisma.quoteRequest.findUnique({
    where: { id: parseInt(id) }
  });

  if (!quote) {
    throw new ApiError(404, 'Quote request not found');
  }

  res.json({
    success: true,
    data: { quote }
  });
};

/**
 * @desc    Update quote status
 * @route   PUT /api/quotes/:id/status
 * @access  Private/Admin
 */
export const updateQuoteStatus = async (req, res) => {
  const { id } = req.params;
  const { status, quotedAmount, notes, validUntil } = req.body;

  const existingQuote = await prisma.quoteRequest.findUnique({
    where: { id: parseInt(id) }
  });

  if (!existingQuote) {
    throw new ApiError(404, 'Quote request not found');
  }

  const updateData = {
    status,
    notes,
    handledBy: req.user.id
  };

  if (status === 'QUOTED' && quotedAmount) {
    updateData.quotedAmount = parseFloat(quotedAmount);
    updateData.quotedAt = new Date();
    updateData.validUntil = validUntil ? new Date(validUntil) : null;
  }

  if (status === 'ACCEPTED') {
    updateData.acceptedAt = new Date();
  }

  if (status === 'REJECTED') {
    updateData.rejectedAt = new Date();
  }

  const quote = await prisma.quoteRequest.update({
    where: { id: parseInt(id) },
    data: updateData
  });

  // Send email notification to customer if quote is ready
  if (status === 'QUOTED') {
    try {
      await sendEmail({
        to: quote.email,
        subject: `Your Quote is Ready - ${quote.referenceNumber}`,
        html: `
          <h1>Your Quote is Ready!</h1>
          <p>Dear ${quote.name},</p>
          <p>We have prepared a quote for your project. Please find the details below:</p>
          <p><strong>Reference Number:</strong> ${quote.referenceNumber}</p>
          <p><strong>Quoted Amount:</strong> ₹${quotedAmount.toLocaleString()}</p>
          ${validUntil ? `<p><strong>Valid Until:</strong> ${new Date(validUntil).toLocaleDateString()}</p>` : ''}
          <p>To discuss this quote or to proceed, please contact us or reply to this email.</p>
          <p>Best regards,<br>Pranijheightsindia Team</p>
        `
      });
    } catch (error) {
      console.error('Failed to send quote email:', error);
    }
  }

  res.json({
    success: true,
    message: 'Quote status updated successfully',
    data: { quote }
  });
};

/**
 * @desc    Delete quote request
 * @route   DELETE /api/quotes/:id
 * @access  Private/Admin
 */
export const deleteQuote = async (req, res) => {
  const { id } = req.params;

  const quote = await prisma.quoteRequest.findUnique({
    where: { id: parseInt(id) }
  });

  if (!quote) {
    throw new ApiError(404, 'Quote request not found');
  }

  await prisma.quoteRequest.delete({
    where: { id: parseInt(id) }
  });

  res.json({
    success: true,
    message: 'Quote request deleted successfully'
  });
};

/**
 * @desc    Get quote statistics
 * @route   GET /api/quotes/stats
 * @access  Private/Admin
 */
export const getQuoteStats = async (req, res) => {
  const [total, pending, quoted, accepted, rejected] = await Promise.all([
    prisma.quoteRequest.count(),
    prisma.quoteRequest.count({ where: { status: 'PENDING' } }),
    prisma.quoteRequest.count({ where: { status: 'QUOTED' } }),
    prisma.quoteRequest.count({ where: { status: 'ACCEPTED' } }),
    prisma.quoteRequest.count({ where: { status: 'REJECTED' } })
  ]);

  // Get total quoted amount
  const quotedAmounts = await prisma.quoteRequest.aggregate({
    where: { status: 'ACCEPTED' },
    _sum: { quotedAmount: true }
  });

  // Get recent quotes (last 7 days)
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const recentCount = await prisma.quoteRequest.count({
    where: {
      createdAt: { gte: weekAgo }
    }
  });

  res.json({
    success: true,
    data: {
      stats: {
        total,
        pending,
        quoted,
        accepted,
        rejected,
        totalRevenue: quotedAmounts._sum.quotedAmount || 0,
        recentCount,
        conversionRate: total > 0 ? ((accepted / total) * 100).toFixed(1) : 0
      }
    }
  });
};

/**
 * @desc    Export quotes to CSV
 * @route   GET /api/quotes/export
 * @access  Private/Admin
 */
export const exportQuotes = async (req, res) => {
  const { status, startDate, endDate } = req.query;

  const where = {};

  if (status) {
    where.status = status;
  }

  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = new Date(startDate);
    if (endDate) where.createdAt.lte = new Date(endDate);
  }

  const quotes = await prisma.quoteRequest.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      referenceNumber: true,
      name: true,
      email: true,
      phone: true,
      company: true,
      projectType: true,
      projectDetails: true,
      estimatedArea: true,
      areaUnit: true,
      budget: true,
      timeline: true,
      deliveryAddress: true,
      status: true,
      quotedAmount: true,
      notes: true,
      createdAt: true,
      quotedAt: true
    }
  });

  // Convert to CSV
  const headers = ['ID', 'Reference', 'Name', 'Email', 'Phone', 'Company', 'Project Type', 'Project Details', 'Area', 'Unit', 'Budget', 'Timeline', 'Address', 'Status', 'Quoted Amount', 'Notes', 'Submitted At', 'Quoted At'];
  
  const csvRows = [
    headers.join(','),
    ...quotes.map(q => [
      q.id,
      `"${(q.referenceNumber || '').replace(/"/g, '""')}"`,
      `"${(q.name || '').replace(/"/g, '""')}"`,
      `"${(q.email || '').replace(/"/g, '""')}"`,
      `"${(q.phone || '').replace(/"/g, '""')}"`,
      `"${(q.company || '').replace(/"/g, '""')}"`,
      `"${(q.projectType || '').replace(/"/g, '""')}"`,
      `"${(q.projectDetails || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
      q.estimatedArea || '',
      q.areaUnit || '',
      `"${(q.budget || '').replace(/"/g, '""')}"`,
      `"${(q.timeline || '').replace(/"/g, '""')}"`,
      `"${(q.deliveryAddress || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
      q.status,
      q.quotedAmount || '',
      `"${(q.notes || '').replace(/"/g, '""')}"`,
      q.createdAt ? new Date(q.createdAt).toISOString() : '',
      q.quotedAt ? new Date(q.quotedAt).toISOString() : ''
    ].join(','))
  ];

  const csv = csvRows.join('\n');
  const filename = `quotes_export_${new Date().toISOString().split('T')[0]}.csv`;

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.send(csv);
};
