import prisma from '../config/database.js';
import { ApiError } from '../middleware/error.middleware.js';
import { sendContactConfirmation, sendContactAdminNotification } from '../config/email.js';

/**
 * Generate unique reference number for contact inquiries
 */
const generateReferenceNumber = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `INQ-${timestamp}-${random}`;
};

/**
 * @desc    Submit contact form
 * @route   POST /api/contact
 * @access  Public
 */
export const submitContact = async (req, res) => {
  const { name, email, phone, company, subject, message } = req.body;

  const referenceNumber = generateReferenceNumber();

  const contact = await prisma.contact.create({
    data: {
      name,
      email: email.toLowerCase(),
      phone,
      company,
      subject,
      message,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    }
  });

  const emailData = {
    name,
    email: email.toLowerCase(),
    phone,
    company,
    subject,
    message,
    referenceNumber,
    submittedAt: contact.createdAt,
  };

  // Send confirmation email to user
  try {
    await sendContactConfirmation(emailData);
  } catch (error) {
    console.error('Failed to send contact confirmation email:', error);
  }

  // Send notification to admin
  try {
    await sendContactAdminNotification(emailData);
  } catch (error) {
    console.error('Failed to send admin notification:', error);
  }

  res.status(201).json({
    success: true,
    message: 'Thank you for contacting us! We will get back to you soon.',
    data: {
      id: contact.id,
      referenceNumber,
      submittedAt: contact.createdAt
    }
  });
};

/**
 * @desc    Get all contact submissions
 * @route   GET /api/contact
 * @access  Private/Admin
 */
export const getContacts = async (req, res) => {
  const {
    page = 1,
    limit = 20,
    status,
    search,
    sortBy = 'createdAt',
    order = 'desc'
  } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const where = {};

  if (status) {
    where.status = status;
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { company: { contains: search, mode: 'insensitive' } },
      { subject: { contains: search, mode: 'insensitive' } }
    ];
  }

  const orderBy = {};
  orderBy[sortBy] = order;

  const [contacts, total] = await Promise.all([
    prisma.contact.findMany({
      where,
      orderBy,
      skip,
      take: parseInt(limit)
    }),
    prisma.contact.count({ where })
  ]);

  res.json({
    success: true,
    data: {
      contacts,
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
 * @desc    Get single contact submission
 * @route   GET /api/contact/:id
 * @access  Private/Admin
 */
export const getContact = async (req, res) => {
  const { id } = req.params;

  const contact = await prisma.contact.findUnique({
    where: { id: parseInt(id) }
  });

  if (!contact) {
    throw new ApiError(404, 'Contact submission not found');
  }

  // Mark as read if not already
  if (!contact.isRead) {
    await prisma.contact.update({
      where: { id: parseInt(id) },
      data: { isRead: true }
    });
  }

  res.json({
    success: true,
    data: { contact }
  });
};

/**
 * @desc    Update contact status
 * @route   PUT /api/contact/:id/status
 * @access  Private/Admin
 */
export const updateContactStatus = async (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  const existingContact = await prisma.contact.findUnique({
    where: { id: parseInt(id) }
  });

  if (!existingContact) {
    throw new ApiError(404, 'Contact submission not found');
  }

  const contact = await prisma.contact.update({
    where: { id: parseInt(id) },
    data: {
      status,
      notes,
      respondedAt: status === 'RESPONDED' ? new Date() : undefined,
      respondedBy: req.user.id
    }
  });

  res.json({
    success: true,
    message: 'Contact status updated successfully',
    data: { contact }
  });
};

/**
 * @desc    Delete contact submission
 * @route   DELETE /api/contact/:id
 * @access  Private/Admin
 */
export const deleteContact = async (req, res) => {
  const { id } = req.params;

  const contact = await prisma.contact.findUnique({
    where: { id: parseInt(id) }
  });

  if (!contact) {
    throw new ApiError(404, 'Contact submission not found');
  }

  await prisma.contact.delete({
    where: { id: parseInt(id) }
  });

  res.json({
    success: true,
    message: 'Contact submission deleted successfully'
  });
};

/**
 * @desc    Get contact statistics
 * @route   GET /api/contact/stats
 * @access  Private/Admin
 */
export const getContactStats = async (req, res) => {
  const [total, unread, pending, responded] = await Promise.all([
    prisma.contact.count(),
    prisma.contact.count({ where: { isRead: false } }),
    prisma.contact.count({ where: { status: 'PENDING' } }),
    prisma.contact.count({ where: { status: 'RESPONDED' } })
  ]);

  // Get recent contacts (last 7 days)
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const recentCount = await prisma.contact.count({
    where: {
      createdAt: { gte: weekAgo }
    }
  });

  res.json({
    success: true,
    data: {
      stats: {
        total,
        unread,
        pending,
        responded,
        recentCount
      }
    }
  });
};

/**
 * @desc    Export contacts to CSV
 * @route   GET /api/contact/export
 * @access  Private/Admin
 */
export const exportContacts = async (req, res) => {
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

  const contacts = await prisma.contact.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      company: true,
      subject: true,
      message: true,
      status: true,
      isRead: true,
      notes: true,
      createdAt: true,
      respondedAt: true
    }
  });

  // Convert to CSV
  const headers = ['ID', 'Name', 'Email', 'Phone', 'Company', 'Subject', 'Message', 'Status', 'Read', 'Notes', 'Submitted At', 'Responded At'];
  
  const csvRows = [
    headers.join(','),
    ...contacts.map(c => [
      c.id,
      `"${(c.name || '').replace(/"/g, '""')}"`,
      `"${(c.email || '').replace(/"/g, '""')}"`,
      `"${(c.phone || '').replace(/"/g, '""')}"`,
      `"${(c.company || '').replace(/"/g, '""')}"`,
      `"${(c.subject || '').replace(/"/g, '""')}"`,
      `"${(c.message || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
      c.status,
      c.isRead ? 'Yes' : 'No',
      `"${(c.notes || '').replace(/"/g, '""')}"`,
      c.createdAt ? new Date(c.createdAt).toISOString() : '',
      c.respondedAt ? new Date(c.respondedAt).toISOString() : ''
    ].join(','))
  ];

  const csv = csvRows.join('\n');
  const filename = `contacts_export_${new Date().toISOString().split('T')[0]}.csv`;

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.send(csv);
};
