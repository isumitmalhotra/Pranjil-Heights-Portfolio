import prisma from '../config/database.js';

// Get dashboard statistics
export const getStats = async (req, res) => {
  try {
    // Get counts
    const [
      productsCount,
      categoriesCount,
      contactsCount,
      quotesCount,
      dealersCount,
      testimonialsCount,
      newsletterCount
    ] = await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.contact.count(),
      prisma.quoteRequest.count(),
      prisma.dealerApplication.count(),
      prisma.testimonial.count(),
      prisma.newsletter.count({ where: { isActive: true } })
    ]);

    // Get recent contacts (last 5)
    const recentContacts = await prisma.contact.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        subject: true,
        status: true,
        createdAt: true
      }
    });

    // Get recent quotes (last 5)
    const recentQuotes = await prisma.quoteRequest.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        projectType: true,
        status: true,
        createdAt: true
      }
    });

    // Get recent dealer applications (last 5)
    const recentDealers = await prisma.dealerApplication.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        companyName: true,
        city: true,
        status: true,
        createdAt: true
      }
    });

    // Get pending counts
    const [pendingContacts, pendingQuotes, pendingDealers] = await Promise.all([
      prisma.contact.count({ where: { status: 'PENDING' } }),
      prisma.quoteRequest.count({ where: { status: 'PENDING' } }),
      prisma.dealerApplication.count({ where: { status: 'PENDING' } })
    ]);

    res.json({
      success: true,
      data: {
        products: productsCount,
        categories: categoriesCount,
        contacts: contactsCount,
        quotes: quotesCount,
        dealers: dealersCount,
        testimonials: testimonialsCount,
        newsletterSubscribers: newsletterCount,
        pending: {
          contacts: pendingContacts,
          quotes: pendingQuotes,
          dealers: pendingDealers
        },
        recentContacts,
        recentQuotes,
        recentDealers
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch dashboard statistics'
    });
  }
};

/**
 * @desc    Get recent activity feed
 * @route   GET /api/dashboard/activity
 * @access  Private/Admin
 */
export const getRecentActivity = async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    const take = parseInt(limit);

    // Fetch recent items from all sources
    const [contacts, quotes, dealers, testimonials] = await Promise.all([
      prisma.contact.findMany({
        take,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          subject: true,
          status: true,
          createdAt: true
        }
      }),
      prisma.quoteRequest.findMany({
        take,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          projectType: true,
          status: true,
          createdAt: true
        }
      }),
      prisma.dealerApplication.findMany({
        take,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          companyName: true,
          contactPerson: true,
          city: true,
          state: true,
          status: true,
          createdAt: true
        }
      }),
      prisma.testimonial.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          company: true,
          createdAt: true
        }
      })
    ]);

    // Transform and combine activities
    const activities = [
      ...contacts.map(c => ({
        id: `contact-${c.id}`,
        type: 'contact',
        title: `New contact from ${c.name}`,
        description: c.subject || 'Contact inquiry submitted',
        status: c.status,
        email: c.email,
        createdAt: c.createdAt,
        link: `/admin/contacts?id=${c.id}`
      })),
      ...quotes.map(q => ({
        id: `quote-${q.id}`,
        type: 'quote',
        title: `Quote request from ${q.name}`,
        description: q.projectType ? `Project: ${q.projectType}` : 'Quote request submitted',
        status: q.status,
        email: q.email,
        createdAt: q.createdAt,
        link: `/admin/quotes?id=${q.id}`
      })),
      ...dealers.map(d => ({
        id: `dealer-${d.id}`,
        type: 'dealer',
        title: `Dealer application from ${d.companyName}`,
        description: `${d.city}, ${d.state}`,
        status: d.status,
        contactPerson: d.contactPerson,
        createdAt: d.createdAt,
        link: `/admin/dealers?id=${d.id}`
      })),
      ...testimonials.map(t => ({
        id: `testimonial-${t.id}`,
        type: 'testimonial',
        title: `New testimonial from ${t.name}`,
        description: t.company || 'Customer testimonial',
        createdAt: t.createdAt,
        link: `/admin/testimonials?id=${t.id}`
      }))
    ];

    // Sort by createdAt descending and limit
    activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const limitedActivities = activities.slice(0, take);

    res.json({
      success: true,
      data: {
        activities: limitedActivities,
        total: limitedActivities.length
      }
    });
  } catch (error) {
    console.error('Recent activity error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch recent activity'
    });
  }
};
