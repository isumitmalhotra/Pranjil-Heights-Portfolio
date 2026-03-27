/* global process */
import prisma from '../config/database.js';
import { ApiError } from '../middleware/error.middleware.js';

const DEFAULT_HOME_HERO_CONTENT = {
  badgeText: "India's Leading PVC Panel Manufacturer",
  titleLine1: "India's No.1 Manufacturer of PVC Wall Panels,",
  titleLine2: 'Fluted Panels & ACP/HPL Sheets',
  subtitle: 'Delivering timeless designs, unmatched durability and premium wall solutions trusted by dealers across India.',
  featurePills: ['Termite & Water Resistant', 'Fire Retardant', 'Easy Installation'],
  cta: {
    primaryText: 'Explore Product Range',
    secondaryText: 'Download Catalogue',
    tertiaryText: 'Become a Dealer',
  },
  trustBadges: [
    { label: 'Manufacturing', value: 'Since 2017' },
    { label: 'Across India', value: '5000+' },
    { label: 'Projects', value: '10,000+' },
    { label: 'Certified', value: 'ISO 9001' },
  ],
  visualStack: {
    label: 'Product Visual Stack',
    title: 'Explore Core Panel Categories',
    description: 'Premium finishes crafted for dealer display, residential interiors, and commercial projects.',
  },
  swatches: [
    {
      id: 'pvc-wall-panel',
      title: 'PVC Wall Panel',
      subtitle: 'Matte Grain',
      imageUrl: '/hero-panels/pvc-wall-panel.jpg',
    },
    {
      id: 'fluted-panel',
      title: 'Fluted Panel',
      subtitle: 'Vertical Groove',
      imageUrl: '/hero-panels/fluted-panel.webp',
    },
    {
      id: 'acp-hpl-sheet',
      title: 'ACP/HPL Sheet',
      subtitle: 'Metallic Finish',
      imageUrl: '/hero-panels/acp-hpl-sheet.webp',
    },
    {
      id: 'uv-marble-sheet',
      title: 'UV Marble Sheet',
      subtitle: 'High Gloss',
      imageUrl: '/hero-panels/uv-marble-sheet.jpg',
    },
  ],
};

const normalizeHomeHeroContent = (rawValue) => {
  const parsed = rawValue && typeof rawValue === 'object' ? rawValue : {};

  const featurePills = Array.isArray(parsed.featurePills)
    ? parsed.featurePills.filter(Boolean).slice(0, 3)
    : DEFAULT_HOME_HERO_CONTENT.featurePills;

  const trustBadges = Array.isArray(parsed.trustBadges)
    ? parsed.trustBadges
        .filter((item) => item && typeof item === 'object')
        .slice(0, 4)
        .map((item, index) => ({
          label: item.label || DEFAULT_HOME_HERO_CONTENT.trustBadges[index]?.label || `Label ${index + 1}`,
          value: item.value || DEFAULT_HOME_HERO_CONTENT.trustBadges[index]?.value || '-',
        }))
    : DEFAULT_HOME_HERO_CONTENT.trustBadges;

  const swatches = Array.isArray(parsed.swatches)
    ? parsed.swatches
        .filter((item) => item && typeof item === 'object')
        .slice(0, 4)
        .map((item, index) => ({
          id: item.id || DEFAULT_HOME_HERO_CONTENT.swatches[index]?.id || `swatch-${index + 1}`,
          title: item.title || DEFAULT_HOME_HERO_CONTENT.swatches[index]?.title || `Panel ${index + 1}`,
          subtitle: item.subtitle || DEFAULT_HOME_HERO_CONTENT.swatches[index]?.subtitle || 'Finish',
          imageUrl: item.imageUrl || DEFAULT_HOME_HERO_CONTENT.swatches[index]?.imageUrl || '',
        }))
    : DEFAULT_HOME_HERO_CONTENT.swatches;

  return {
    badgeText: parsed.badgeText || DEFAULT_HOME_HERO_CONTENT.badgeText,
    titleLine1: parsed.titleLine1 || DEFAULT_HOME_HERO_CONTENT.titleLine1,
    titleLine2: parsed.titleLine2 || DEFAULT_HOME_HERO_CONTENT.titleLine2,
    subtitle: parsed.subtitle || DEFAULT_HOME_HERO_CONTENT.subtitle,
    featurePills,
    cta: {
      primaryText: parsed?.cta?.primaryText || DEFAULT_HOME_HERO_CONTENT.cta.primaryText,
      secondaryText: parsed?.cta?.secondaryText || DEFAULT_HOME_HERO_CONTENT.cta.secondaryText,
      tertiaryText: parsed?.cta?.tertiaryText || DEFAULT_HOME_HERO_CONTENT.cta.tertiaryText,
    },
    trustBadges,
    visualStack: {
      label: parsed?.visualStack?.label || DEFAULT_HOME_HERO_CONTENT.visualStack.label,
      title: parsed?.visualStack?.title || DEFAULT_HOME_HERO_CONTENT.visualStack.title,
      description: parsed?.visualStack?.description || DEFAULT_HOME_HERO_CONTENT.visualStack.description,
    },
    swatches,
  };
};

// ============================================
// SITE SETTINGS CRUD
// ============================================

/**
 * @desc    Get all site settings
 * @route   GET /api/settings
 * @access  Private/Admin
 */
export const getAllSettings = async (req, res) => {
  const { group } = req.query;

  const where = group ? { group } : {};

  const settings = await prisma.siteSetting.findMany({
    where,
    orderBy: [{ group: 'asc' }, { key: 'asc' }]
  });

  // Transform to key-value object grouped by category
  const groupedSettings = settings.reduce((acc, setting) => {
    if (!acc[setting.group]) {
      acc[setting.group] = {};
    }
    // Parse value based on type
    let value = setting.value;
    if (setting.type === 'boolean') {
      value = setting.value === 'true';
    } else if (setting.type === 'number') {
      value = Number(setting.value);
    } else if (setting.type === 'json') {
      try {
        value = JSON.parse(setting.value);
      } catch {
        value = setting.value;
      }
    }
    acc[setting.group][setting.key] = value;
    return acc;
  }, {});

  res.json({
    success: true,
    data: {
      settings: groupedSettings,
      raw: settings
    }
  });
};

/**
 * @desc    Get settings by group
 * @route   GET /api/settings/:group
 * @access  Private/Admin
 */
export const getSettingsByGroup = async (req, res) => {
  const { group } = req.params;

  const settings = await prisma.siteSetting.findMany({
    where: { group },
    orderBy: { key: 'asc' }
  });

  // Transform to key-value object
  const settingsObj = settings.reduce((acc, setting) => {
    let value = setting.value;
    if (setting.type === 'boolean') {
      value = setting.value === 'true';
    } else if (setting.type === 'number') {
      value = Number(setting.value);
    } else if (setting.type === 'json') {
      try {
        value = JSON.parse(setting.value);
      } catch {
        value = setting.value;
      }
    }
    acc[setting.key] = value;
    return acc;
  }, {});

  res.json({
    success: true,
    data: settingsObj
  });
};

/**
 * @desc    Get a single setting
 * @route   GET /api/settings/key/:key
 * @access  Private/Admin
 */
export const getSetting = async (req, res) => {
  const { key } = req.params;

  const setting = await prisma.siteSetting.findUnique({
    where: { key }
  });

  if (!setting) {
    throw new ApiError(404, 'Setting not found');
  }

  res.json({
    success: true,
    data: setting
  });
};

/**
 * @desc    Get public home page videos
 * @route   GET /api/settings/public/home-videos
 * @access  Public
 */
export const getPublicHomeVideos = async (req, res) => {
  const setting = await prisma.siteSetting.findUnique({
    where: { key: 'home_latest_videos' }
  });

  let videos = [];
  if (setting?.value) {
    try {
      const parsed = JSON.parse(setting.value);
      if (Array.isArray(parsed)) {
        videos = parsed;
      }
    } catch {
      videos = [];
    }
  }

  const normalized = videos
    .filter((item) => item && typeof item === 'object')
    .map((item, index) => ({
      id: item.id || `video-${index + 1}`,
      title: item.title || `Video ${index + 1}`,
      videoUrl: item.videoUrl || '',
      thumbnailUrl: item.thumbnailUrl || '',
      isActive: item.isActive !== false,
      order: Number.isFinite(Number(item.order)) ? Number(item.order) : index,
    }))
    .filter((item) => item.isActive && item.videoUrl)
    .sort((a, b) => a.order - b.order);

  res.json({
    success: true,
    data: normalized,
  });
};

/**
 * @desc    Get public home hero content
 * @route   GET /api/settings/public/home-hero
 * @access  Public
 */
export const getPublicHomeHero = async (req, res) => {
  const setting = await prisma.siteSetting.findUnique({
    where: { key: 'home_hero_content' },
  });

  let parsed = null;
  if (setting?.value) {
    try {
      parsed = JSON.parse(setting.value);
    } catch {
      parsed = null;
    }
  }

  const normalized = normalizeHomeHeroContent(parsed);

  res.json({
    success: true,
    data: normalized,
  });
};

/**
 * @desc    Update or create a setting
 * @route   PUT /api/settings/:key
 * @access  Private/Admin
 */
export const upsertSetting = async (req, res) => {
  const { key } = req.params;
  const { value, type, group } = req.body;

  // Convert value to string for storage
  const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);

  const setting = await prisma.siteSetting.upsert({
    where: { key },
    update: {
      value: stringValue,
      ...(type && { type }),
      ...(group && { group })
    },
    create: {
      key,
      value: stringValue,
      type: type || 'text',
      group: group || 'general'
    }
  });

  res.json({
    success: true,
    message: 'Setting updated successfully',
    data: setting
  });
};

/**
 * @desc    Bulk update settings
 * @route   PUT /api/settings/bulk
 * @access  Private/Admin
 */
export const bulkUpdateSettings = async (req, res) => {
  const { settings } = req.body;

  if (!settings || !Array.isArray(settings)) {
    throw new ApiError(400, 'Settings array is required');
  }

  const updatedSettings = [];

  for (const setting of settings) {
    const { key, value, type, group } = setting;
    const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);

    const updated = await prisma.siteSetting.upsert({
      where: { key },
      update: {
        value: stringValue,
        ...(type && { type }),
        ...(group && { group })
      },
      create: {
        key,
        value: stringValue,
        type: type || 'text',
        group: group || 'general'
      }
    });

    updatedSettings.push(updated);
  }

  res.json({
    success: true,
    message: `${updatedSettings.length} settings updated successfully`,
    data: updatedSettings
  });
};

/**
 * @desc    Delete a setting
 * @route   DELETE /api/settings/:key
 * @access  Private/Super Admin
 */
export const deleteSetting = async (req, res) => {
  const { key } = req.params;

  const setting = await prisma.siteSetting.findUnique({
    where: { key }
  });

  if (!setting) {
    throw new ApiError(404, 'Setting not found');
  }

  await prisma.siteSetting.delete({
    where: { key }
  });

  res.json({
    success: true,
    message: 'Setting deleted successfully'
  });
};

// ============================================
// NOTIFICATION PREFERENCES
// ============================================

/**
 * @desc    Get notification preferences for current user
 * @route   GET /api/settings/notifications/preferences
 * @access  Private/Admin
 */
export const getNotificationPreferences = async (req, res) => {
  const userId = req.user.id;
  const prefKey = `user_${userId}_notifications`;

  const setting = await prisma.siteSetting.findUnique({
    where: { key: prefKey }
  });

  // Default preferences
  const defaultPrefs = {
    new_contact: true,
    new_quote: true,
    new_dealer: true,
    newsletter: true
  };

  let preferences = defaultPrefs;
  if (setting) {
    try {
      preferences = { ...defaultPrefs, ...JSON.parse(setting.value) };
    } catch {
      preferences = defaultPrefs;
    }
  }

  res.json({
    success: true,
    data: preferences
  });
};

/**
 * @desc    Update notification preferences for current user
 * @route   PUT /api/settings/notifications/preferences
 * @access  Private/Admin
 */
export const updateNotificationPreferences = async (req, res) => {
  const userId = req.user.id;
  const prefKey = `user_${userId}_notifications`;
  const { preferences } = req.body;

  if (!preferences || typeof preferences !== 'object') {
    throw new ApiError(400, 'Preferences object is required');
  }

  await prisma.siteSetting.upsert({
    where: { key: prefKey },
    update: {
      value: JSON.stringify(preferences)
    },
    create: {
      key: prefKey,
      value: JSON.stringify(preferences),
      type: 'json',
      group: 'notifications'
    }
  });

  res.json({
    success: true,
    message: 'Notification preferences updated successfully',
    data: preferences
  });
};

// ============================================
// SYSTEM INFO
// ============================================

/**
 * @desc    Get system information
 * @route   GET /api/settings/system/info
 * @access  Private/Admin
 */
export const getSystemInfo = async (req, res) => {
  // Get database stats
  const [
    userCount,
    productCount,
    categoryCount,
    contactCount,
    quoteCount,
    dealerCount,
    testimonialCount,
    newsletterCount,
    catalogueCount
  ] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.category.count(),
    prisma.contact.count(),
    prisma.quoteRequest.count(),
    prisma.dealerApplication.count(),
    prisma.testimonial.count(),
    prisma.newsletter.count(),
    prisma.catalogue.count()
  ]);

  const systemInfo = {
    application: 'Pranijheightsindia Admin',
    version: '1.0.0',
    backend: 'Node.js + Express',
    database: process.env.DATABASE_URL?.includes('postgresql') ? 'PostgreSQL + Prisma' : 'SQLite + Prisma',
    frontend: 'React + Vite',
    environment: process.env.NODE_ENV || 'development',
    stats: {
      users: userCount,
      products: productCount,
      categories: categoryCount,
      contacts: contactCount,
      quotes: quoteCount,
      dealers: dealerCount,
      testimonials: testimonialCount,
      newsletter: newsletterCount,
      catalogues: catalogueCount
    },
    health: {
      status: 'healthy',
      message: 'All services are running normally'
    }
  };

  res.json({
    success: true,
    data: systemInfo
  });
};
