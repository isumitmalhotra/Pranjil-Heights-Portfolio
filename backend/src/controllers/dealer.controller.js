import prisma from '../config/database.js';
import { ApiError } from '../middleware/error.middleware.js';
import { sendDealerConfirmation, sendDealerAdminNotification, sendDealerStatusUpdate } from '../config/email.js';

/**
 * @desc    Submit dealer application
 * @route   POST /api/dealers/apply
 * @access  Public
 */
export const submitDealerApplication = async (req, res) => {
  const {
    // Business Information
    companyName,
    businessType,
    gstNumber,
    panNumber,
    establishedYear,
    annualTurnover,
    
    // Contact Information
    contactPerson,
    designation,
    email,
    phone,
    alternatePhone,
    
    // Address
    address,
    city,
    state,
    pincode,
    
    // Business Details
    currentProducts,
    warehouseArea,
    showroomArea,
    salesTeamSize,
    deliveryVehicles,
    
    // Experience
    yearsInBusiness,
    existingBrands,
    monthlyTargetValue,
    
    // Additional
    coverageAreas,
    referenceSource,
    additionalNotes
  } = req.body;

  // Check if email already exists
  const existingApplication = await prisma.dealerApplication.findFirst({
    where: {
      email: email.toLowerCase(),
      status: { not: 'REJECTED' }
    }
  });

  if (existingApplication) {
    throw new ApiError(409, 'An application with this email already exists');
  }

  // Generate application reference
  const applicationRef = `DA-${Date.now().toString(36).toUpperCase()}`;

  const application = await prisma.dealerApplication.create({
    data: {
      referenceNumber: applicationRef,
      companyName,
      businessType,
      gstNumber,
      panNumber,
      establishedYear: establishedYear ? parseInt(establishedYear) : null,
      annualTurnover,
      contactPerson,
      designation,
      email: email.toLowerCase(),
      phone,
      alternatePhone,
      address,
      city,
      state,
      pincode: pincode || '',
      currentProducts: currentProducts ? JSON.stringify(currentProducts) : null,
      warehouseArea: warehouseArea ? parseInt(warehouseArea) : null,
      showroomArea: showroomArea ? parseInt(showroomArea) : null,
      salesTeamSize: salesTeamSize ? parseInt(salesTeamSize) : null,
      deliveryVehicles: deliveryVehicles ? parseInt(deliveryVehicles) : null,
      yearsInBusiness: yearsInBusiness ? parseInt(yearsInBusiness) : null,
      existingBrands: existingBrands ? JSON.stringify(existingBrands) : null,
      monthlyTargetValue: monthlyTargetValue ? parseFloat(monthlyTargetValue) : null,
      coverageAreas: coverageAreas ? JSON.stringify(coverageAreas) : null,
      referenceSource,
      additionalNotes,
      ipAddress: req.ip
    }
  });

  const emailData = {
    companyName,
    contactPerson,
    email: email.toLowerCase(),
    phone,
    city,
    state,
    businessType,
    applicationId: applicationRef,
    submittedAt: application.createdAt,
  };

  // Send confirmation email
  try {
    await sendDealerConfirmation(emailData);
  } catch (error) {
    console.error('Failed to send dealer application confirmation:', error);
  }

  // Notify admin
  try {
    await sendDealerAdminNotification(emailData);
  } catch (error) {
    console.error('Failed to send admin notification:', error);
  }

  res.status(201).json({
    success: true,
    message: 'Your dealer application has been submitted successfully!',
    data: {
      referenceNumber: applicationRef,
      submittedAt: application.createdAt
    }
  });
};

/**
 * @desc    Get all dealer applications
 * @route   GET /api/dealers
 * @access  Private/Admin
 */
export const getDealerApplications = async (req, res) => {
  const {
    page = 1,
    limit = 20,
    status,
    state,
    search,
    sortBy = 'createdAt',
    order = 'desc'
  } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const where = {};

  if (status) {
    where.status = status;
  }

  if (state) {
    where.state = state;
  }

  if (search) {
    where.OR = [
      { referenceNumber: { contains: search, mode: 'insensitive' } },
      { companyName: { contains: search, mode: 'insensitive' } },
      { contactPerson: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { city: { contains: search, mode: 'insensitive' } }
    ];
  }

  const orderBy = {};
  orderBy[sortBy] = order;

  const [applications, total] = await Promise.all([
    prisma.dealerApplication.findMany({
      where,
      orderBy,
      skip,
      take: parseInt(limit)
    }),
    prisma.dealerApplication.count({ where })
  ]);

  res.json({
    success: true,
    data: {
      applications,
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
 * @desc    Get single dealer application
 * @route   GET /api/dealers/:id
 * @access  Private/Admin
 */
export const getDealerApplication = async (req, res) => {
  const { id } = req.params;

  const application = await prisma.dealerApplication.findUnique({
    where: { id: parseInt(id) }
  });

  if (!application) {
    throw new ApiError(404, 'Dealer application not found');
  }

  res.json({
    success: true,
    data: { application }
  });
};

/**
 * @desc    Update dealer application status
 * @route   PUT /api/dealers/:id/status
 * @access  Private/Admin
 */
export const updateDealerStatus = async (req, res) => {
  const { id } = req.params;
  const { status, notes, rejectionReason } = req.body;

  const existingApplication = await prisma.dealerApplication.findUnique({
    where: { id: parseInt(id) }
  });

  if (!existingApplication) {
    throw new ApiError(404, 'Dealer application not found');
  }

  const updateData = {
    status,
    notes,
    reviewedBy: req.user.id,
    reviewedAt: new Date()
  };

  if (status === 'APPROVED') {
    updateData.approvedAt = new Date();
  }

  if (status === 'REJECTED') {
    updateData.rejectedAt = new Date();
    updateData.rejectionReason = rejectionReason;
  }

  const application = await prisma.dealerApplication.update({
    where: { id: parseInt(id) },
    data: updateData
  });

  // Send status update email
  try {
    await sendDealerStatusUpdate({
      email: application.email,
      contactPerson: application.contactPerson,
      companyName: application.companyName,
      applicationId: application.referenceNumber,
      status,
      rejectionReason,
    });
  } catch (error) {
    console.error('Failed to send status update email:', error);
  }

  res.json({
    success: true,
    message: `Dealer application ${status.toLowerCase()} successfully`,
    data: { application }
  });
};

/**
 * @desc    Delete dealer application
 * @route   DELETE /api/dealers/:id
 * @access  Private/Admin
 */
export const deleteDealerApplication = async (req, res) => {
  const { id } = req.params;

  const application = await prisma.dealerApplication.findUnique({
    where: { id: parseInt(id) }
  });

  if (!application) {
    throw new ApiError(404, 'Dealer application not found');
  }

  await prisma.dealerApplication.delete({
    where: { id: parseInt(id) }
  });

  res.json({
    success: true,
    message: 'Dealer application deleted successfully'
  });
};

/**
 * @desc    Get dealer statistics
 * @route   GET /api/dealers/stats
 * @access  Private/Admin
 */
export const getDealerStats = async (req, res) => {
  const [total, pending, underReview, approved, rejected] = await Promise.all([
    prisma.dealerApplication.count(),
    prisma.dealerApplication.count({ where: { status: 'PENDING' } }),
    prisma.dealerApplication.count({ where: { status: 'UNDER_REVIEW' } }),
    prisma.dealerApplication.count({ where: { status: 'APPROVED' } }),
    prisma.dealerApplication.count({ where: { status: 'REJECTED' } })
  ]);

  // Get applications by state
  const byState = await prisma.dealerApplication.groupBy({
    by: ['state'],
    _count: true,
    orderBy: {
      _count: {
        state: 'desc'
      }
    },
    take: 10
  });

  // Recent applications
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const recentCount = await prisma.dealerApplication.count({
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
        underReview,
        approved,
        rejected,
        recentCount,
        approvalRate: total > 0 ? ((approved / total) * 100).toFixed(1) : 0
      },
      byState
    }
  });
};

/**
 * @desc    Export dealer applications to CSV
 * @route   GET /api/dealers/export
 * @access  Private/Admin
 */
export const exportDealers = async (req, res) => {
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

  const dealers = await prisma.dealerApplication.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      referenceNumber: true,
      companyName: true,
      businessType: true,
      gstNumber: true,
      panNumber: true,
      establishedYear: true,
      annualTurnover: true,
      contactPerson: true,
      designation: true,
      email: true,
      phone: true,
      address: true,
      city: true,
      state: true,
      pincode: true,
      warehouseArea: true,
      showroomArea: true,
      salesTeamSize: true,
      yearsInBusiness: true,
      status: true,
      notes: true,
      createdAt: true,
      reviewedAt: true
    }
  });

  // Convert to CSV
  const headers = ['ID', 'Reference', 'Company Name', 'Business Type', 'GST', 'PAN', 'Est. Year', 'Turnover', 'Contact Person', 'Designation', 'Email', 'Phone', 'Address', 'City', 'State', 'Pincode', 'Warehouse Area', 'Showroom Area', 'Sales Team', 'Years in Business', 'Status', 'Notes', 'Applied At', 'Reviewed At'];
  
  const csvRows = [
    headers.join(','),
    ...dealers.map(d => [
      d.id,
      `"${(d.referenceNumber || '').replace(/"/g, '""')}"`,
      `"${(d.companyName || '').replace(/"/g, '""')}"`,
      `"${(d.businessType || '').replace(/"/g, '""')}"`,
      `"${(d.gstNumber || '').replace(/"/g, '""')}"`,
      `"${(d.panNumber || '').replace(/"/g, '""')}"`,
      d.establishedYear || '',
      `"${(d.annualTurnover || '').replace(/"/g, '""')}"`,
      `"${(d.contactPerson || '').replace(/"/g, '""')}"`,
      `"${(d.designation || '').replace(/"/g, '""')}"`,
      `"${(d.email || '').replace(/"/g, '""')}"`,
      `"${(d.phone || '').replace(/"/g, '""')}"`,
      `"${(d.address || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
      `"${(d.city || '').replace(/"/g, '""')}"`,
      `"${(d.state || '').replace(/"/g, '""')}"`,
      `"${(d.pincode || '').replace(/"/g, '""')}"`,
      d.warehouseArea || '',
      d.showroomArea || '',
      d.salesTeamSize || '',
      d.yearsInBusiness || '',
      d.status,
      `"${(d.notes || '').replace(/"/g, '""')}"`,
      d.createdAt ? new Date(d.createdAt).toISOString() : '',
      d.reviewedAt ? new Date(d.reviewedAt).toISOString() : ''
    ].join(','))
  ];

  const csv = csvRows.join('\n');
  const filename = `dealers_export_${new Date().toISOString().split('T')[0]}.csv`;

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.send(csv);
};
