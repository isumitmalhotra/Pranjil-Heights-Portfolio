import prisma from '../config/database.js';
import { ApiError } from '../middleware/error.middleware.js';
import { sendNewsletterWelcome, sendNewsletterUnsubscribe } from '../config/email.js';

/**
 * @desc    Subscribe to newsletter
 * @route   POST /api/newsletter/subscribe
 * @access  Public
 */
export const subscribe = async (req, res) => {
  const { email, name, source } = req.body;

  // Check if already subscribed
  const existing = await prisma.newsletter.findUnique({
    where: { email: email.toLowerCase() }
  });

  if (existing) {
    if (existing.isActive) {
      return res.json({
        success: true,
        message: 'You are already subscribed to our newsletter!'
      });
    } else {
      // Reactivate subscription
      await prisma.newsletter.update({
        where: { id: existing.id },
        data: {
          isActive: true,
          resubscribedAt: new Date()
        }
      });

      return res.json({
        success: true,
        message: 'Your subscription has been reactivated!'
      });
    }
  }

  // Create new subscription
  const subscriber = await prisma.newsletter.create({
    data: {
      email: email.toLowerCase(),
      name,
      source: source || 'website',
      ipAddress: req.ip
    }
  });

  // Send welcome email
  try {
    await sendNewsletterWelcome(email, name);
  } catch (error) {
    console.error('Failed to send newsletter welcome email:', error);
  }

  res.status(201).json({
    success: true,
    message: 'Thank you for subscribing to our newsletter!',
    data: {
      subscribedAt: subscriber.createdAt
    }
  });
};

/**
 * @desc    Unsubscribe from newsletter
 * @route   POST /api/newsletter/unsubscribe
 * @access  Public
 */
export const unsubscribe = async (req, res) => {
  const { email, token: _token } = req.body;

  const subscriber = await prisma.newsletter.findUnique({
    where: { email: email.toLowerCase() }
  });

  if (!subscriber) {
    // Don't reveal if email exists or not
    return res.json({
      success: true,
      message: 'You have been unsubscribed successfully'
    });
  }

  if (!subscriber.isActive) {
    return res.json({
      success: true,
      message: 'You are already unsubscribed'
    });
  }

  await prisma.newsletter.update({
    where: { id: subscriber.id },
    data: {
      isActive: false,
      unsubscribedAt: new Date()
    }
  });

  // Send unsubscribe confirmation email
  try {
    await sendNewsletterUnsubscribe(email.toLowerCase());
  } catch (error) {
    console.error('Failed to send newsletter unsubscribe email:', error);
  }

  res.json({
    success: true,
    message: 'You have been unsubscribed successfully. We\'re sorry to see you go!'
  });
};

/**
 * @desc    Get all subscribers
 * @route   GET /api/newsletter/subscribers
 * @access  Private/Admin
 */
export const getSubscribers = async (req, res) => {
  const {
    page = 1,
    limit = 50,
    isActive,
    search,
    sortBy = 'createdAt',
    order = 'desc'
  } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const where = {};

  if (isActive !== undefined) {
    where.isActive = isActive === 'true';
  }

  if (search) {
    where.OR = [
      { email: { contains: search, mode: 'insensitive' } },
      { name: { contains: search, mode: 'insensitive' } }
    ];
  }

  const orderBy = {};
  orderBy[sortBy] = order;

  const [subscribers, total] = await Promise.all([
    prisma.newsletter.findMany({
      where,
      orderBy,
      skip,
      take: parseInt(limit)
    }),
    prisma.newsletter.count({ where })
  ]);

  res.json({
    success: true,
    data: {
      subscribers,
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
 * @desc    Get newsletter statistics
 * @route   GET /api/newsletter/stats
 * @access  Private/Admin
 */
export const getStats = async (req, res) => {
  const [total, active, unsubscribed] = await Promise.all([
    prisma.newsletter.count(),
    prisma.newsletter.count({ where: { isActive: true } }),
    prisma.newsletter.count({ where: { isActive: false } })
  ]);

  // Get subscribers by source
  const bySource = await prisma.newsletter.groupBy({
    by: ['source'],
    where: { isActive: true },
    _count: true
  });

  // Get recent subscribers (last 30 days)
  const monthAgo = new Date();
  monthAgo.setDate(monthAgo.getDate() - 30);

  const recentSubscribers = await prisma.newsletter.count({
    where: {
      createdAt: { gte: monthAgo },
      isActive: true
    }
  });

  // Get weekly growth
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const weeklyNew = await prisma.newsletter.count({
    where: {
      createdAt: { gte: weekAgo }
    }
  });

  const weeklyUnsubscribed = await prisma.newsletter.count({
    where: {
      unsubscribedAt: { gte: weekAgo }
    }
  });

  res.json({
    success: true,
    data: {
      stats: {
        total,
        active,
        unsubscribed,
        recentSubscribers,
        weeklyGrowth: weeklyNew - weeklyUnsubscribed,
        retentionRate: total > 0 ? ((active / total) * 100).toFixed(1) : 100
      },
      bySource
    }
  });
};

/**
 * @desc    Export subscribers (CSV)
 * @route   GET /api/newsletter/export
 * @access  Private/Admin
 */
export const exportSubscribers = async (req, res) => {
  const { isActive } = req.query;

  const where = {};
  if (isActive !== undefined) {
    where.isActive = isActive === 'true';
  }

  const subscribers = await prisma.newsletter.findMany({
    where,
    select: {
      email: true,
      name: true,
      source: true,
      isActive: true,
      createdAt: true
    },
    orderBy: { createdAt: 'desc' }
  });

  // Generate CSV
  const headers = ['Email', 'Name', 'Source', 'Status', 'Subscribed Date'];
  const rows = subscribers.map(sub => [
    sub.email,
    sub.name || '',
    sub.source || 'website',
    sub.isActive ? 'Active' : 'Unsubscribed',
    sub.createdAt.toISOString().split('T')[0]
  ]);

  const csv = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=newsletter-subscribers.csv');
  res.send(csv);
};

/**
 * @desc    Delete subscriber
 * @route   DELETE /api/newsletter/:id
 * @access  Private/Admin
 */
export const deleteSubscriber = async (req, res) => {
  const { id } = req.params;

  const subscriber = await prisma.newsletter.findUnique({
    where: { id: parseInt(id) }
  });

  if (!subscriber) {
    throw new ApiError(404, 'Subscriber not found');
  }

  await prisma.newsletter.delete({
    where: { id: parseInt(id) }
  });

  res.json({
    success: true,
    message: 'Subscriber deleted successfully'
  });
};
