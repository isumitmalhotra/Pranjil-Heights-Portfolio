import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...\n');

  // Create admin user - use env var or fallback for development only
  const adminPwd = process.env.ADMIN_DEFAULT_PASSWORD || 'admin123';
  if (!process.env.ADMIN_DEFAULT_PASSWORD) {
    console.warn('⚠️  WARNING: ADMIN_DEFAULT_PASSWORD not set. Using default "admin123". Change this in production!');
  }
  const adminPassword = await bcrypt.hash(adminPwd, 12);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@pranjilheights.com' },
    update: {},
    create: {
      email: 'admin@pranjilheights.com',
      password: adminPassword,
      name: 'Super Admin',
      role: 'SUPER_ADMIN'
    }
  });
  console.log('✅ Admin user created:', admin.email);

  // Create categories
  const categories = [
    {
      name: 'PVC Wall Panels',
      slug: 'pvc-wall-panels',
      description: 'Premium quality PVC wall panels for interior decoration',
      order: 1
    },
    {
      name: 'PVC Ceiling Panels',
      slug: 'pvc-ceiling-panels',
      description: 'Durable and elegant PVC ceiling solutions',
      order: 2
    },
    {
      name: 'WPC Panels',
      slug: 'wpc-panels',
      description: 'Wood-Plastic Composite panels for premium interiors',
      order: 3
    },
    {
      name: 'Marble Finish Panels',
      slug: 'marble-finish-panels',
      description: 'Luxurious marble look panels at affordable prices',
      order: 4
    },
    {
      name: 'Charcoal Panels',
      slug: 'charcoal-panels',
      description: 'Elegant charcoal finish panels for modern spaces',
      order: 5
    },
    {
      name: '3D Wall Panels',
      slug: '3d-wall-panels',
      description: 'Contemporary 3D textured wall panels',
      order: 6
    }
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat
    });
  }
  console.log(`✅ ${categories.length} categories created`);

  // Get category IDs for products
  const wallPanelCategory = await prisma.category.findUnique({ where: { slug: 'pvc-wall-panels' } });
  const ceilingCategory = await prisma.category.findUnique({ where: { slug: 'pvc-ceiling-panels' } });
  const marbleCategory = await prisma.category.findUnique({ where: { slug: 'marble-finish-panels' } });

  // Create sample products (arrays stored as JSON strings for SQLite compatibility)
  const products = [
    {
      name: 'Classic White PVC Wall Panel',
      slug: 'classic-white-pvc-wall-panel',
      description: 'Premium quality white PVC wall panel perfect for modern interiors. Features excellent durability, water resistance, and easy installation.',
      shortDescription: 'Premium white PVC wall panel for modern interiors',
      price: 85,
      unit: 'sq ft',
      sku: 'PHI-WP-001',
      categoryId: wallPanelCategory?.id,
      features: JSON.stringify(['Water Resistant', 'Easy Installation', 'Low Maintenance', 'Fire Retardant']),
      applications: JSON.stringify(['Living Room', 'Bedroom', 'Office', 'Hotel']),
      isFeatured: true
    },
    {
      name: 'Wooden Texture PVC Panel',
      slug: 'wooden-texture-pvc-panel',
      description: 'Natural wood look PVC panel with realistic grain texture. Perfect for creating warm and inviting spaces.',
      shortDescription: 'Natural wood look PVC panel',
      price: 95,
      unit: 'sq ft',
      sku: 'PHI-WP-002',
      categoryId: wallPanelCategory?.id,
      features: JSON.stringify(['Realistic Wood Texture', 'Termite Proof', 'UV Resistant', 'Eco-Friendly']),
      applications: JSON.stringify(['Living Room', 'Bedroom', 'Reception', 'Restaurant']),
      isFeatured: true
    },
    {
      name: 'Glossy White Ceiling Panel',
      slug: 'glossy-white-ceiling-panel',
      description: 'High-gloss white PVC ceiling panel that adds elegance to any room. Reflects light beautifully.',
      shortDescription: 'High-gloss white ceiling panel',
      price: 75,
      unit: 'sq ft',
      sku: 'PHI-CP-001',
      categoryId: ceilingCategory?.id,
      features: JSON.stringify(['High Gloss Finish', 'Light Reflective', 'Anti-Bacterial', 'Easy to Clean']),
      applications: JSON.stringify(['Kitchen', 'Bathroom', 'Office', 'Hospital']),
      isFeatured: true
    },
    {
      name: 'Italian Marble PVC Panel',
      slug: 'italian-marble-pvc-panel',
      description: 'Luxurious Italian marble finish PVC panel. Offers the elegance of marble without the cost.',
      shortDescription: 'Italian marble finish PVC panel',
      price: 120,
      unit: 'sq ft',
      sku: 'PHI-MP-001',
      categoryId: marbleCategory?.id,
      features: JSON.stringify(['Authentic Marble Look', 'Lightweight', 'Cost-Effective', 'Scratch Resistant']),
      applications: JSON.stringify(['Living Room', 'Lobby', 'Showroom', 'Hotel']),
      isFeatured: true
    }
  ];

  for (const product of products) {
    if (product.categoryId) {
      await prisma.product.upsert({
        where: { slug: product.slug },
        update: {},
        create: product
      });
    }
  }
  console.log(`✅ ${products.length} products created`);

  // Create sample testimonials
  const testimonials = [
    {
      name: 'Rajesh Kumar',
      designation: 'Managing Director',
      company: 'Kumar Interiors Pvt Ltd',
      location: 'Mumbai, Maharashtra',
      content: 'We have been using Pranjil Heights panels for our commercial projects. The quality and finish are exceptional. Our clients love the results!',
      rating: 5,
      projectType: 'Commercial',
      isFeatured: true
    },
    {
      name: 'Anita Sharma',
      designation: 'Interior Designer',
      company: 'Design Studio',
      location: 'Delhi NCR',
      content: 'The marble finish panels from Pranjil Heights give a premium look at a fraction of the cost. Highly recommended for budget-conscious projects.',
      rating: 5,
      projectType: 'Residential',
      isFeatured: true
    },
    {
      name: 'Mohammed Ali',
      designation: 'Project Manager',
      company: 'Al Faisal Constructions',
      location: 'Hyderabad, Telangana',
      content: 'Quick delivery, easy installation, and excellent after-sales support. Pranjil Heights is now our preferred PVC panel supplier.',
      rating: 5,
      projectType: 'Commercial',
      isFeatured: true
    }
  ];

  for (let i = 0; i < testimonials.length; i++) {
    await prisma.testimonial.upsert({
      where: { id: i + 1 },
      update: {},
      create: { ...testimonials[i], order: i + 1 }
    });
  }
  console.log(`✅ ${testimonials.length} testimonials created`);

  // Create FAQs
  const faqs = [
    {
      question: 'What is the lifespan of PVC panels?',
      answer: 'Our PVC panels are designed to last 15-20 years with proper maintenance. They are resistant to moisture, termites, and UV rays.',
      category: 'Product',
      order: 1
    },
    {
      question: 'Are PVC panels waterproof?',
      answer: 'Yes, our PVC panels are 100% waterproof and ideal for bathrooms, kitchens, and areas with high humidity.',
      category: 'Product',
      order: 2
    },
    {
      question: 'How do I install PVC panels?',
      answer: 'Our panels come with a simple click-lock system that makes installation easy. We also provide installation guides and video tutorials.',
      category: 'Installation',
      order: 3
    },
    {
      question: 'What is the minimum order quantity?',
      answer: 'For B2B customers, we have a minimum order of 500 sq ft per design. For dealers, please contact our sales team for bulk pricing.',
      category: 'Orders',
      order: 4
    },
    {
      question: 'Do you offer dealer partnerships?',
      answer: 'Yes, we have an extensive dealer network across India. Fill out our dealer application form to become a partner.',
      category: 'Partnership',
      order: 5
    }
  ];

  for (const faq of faqs) {
    await prisma.fAQ.create({ data: faq });
  }
  console.log(`✅ ${faqs.length} FAQs created`);

  // Create site settings
  const settings = [
    { key: 'company_name', value: 'Pranjil Heights India', group: 'general' },
    { key: 'company_email', value: 'info@pranjilheights.com', group: 'contact' },
    { key: 'company_phone', value: '+91 98765 43210', group: 'contact' },
    { key: 'company_address', value: 'Industrial Area, Phase 2, New Delhi - 110020', group: 'contact' },
    { key: 'meta_title', value: 'Pranjil Heights - Premium PVC Panel Manufacturer in India', group: 'seo' },
    { key: 'meta_description', value: 'Leading manufacturer of premium quality PVC wall panels, ceiling panels, and WPC panels. Best quality at competitive prices.', group: 'seo' }
  ];

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting
    });
  }
  console.log(`✅ ${settings.length} site settings created`);

  // Create catalogues
  const catalogues = [
    {
      name: 'Product Catalogue 2024',
      slug: 'product-catalogue-2024',
      description: 'Complete product range with specifications and applications',
      fileUrl: '/catalogues/pranjil-heights-catalogue-2024.pdf',
      fileSize: 15728640, // ~15MB
      thumbnail: '/images/catalogue-cover-2024.jpg',
      category: 'product',
      version: '2024',
      order: 1
    },
    {
      name: 'Wood Series Collection',
      slug: 'wood-series-collection',
      description: 'Premium wood finish panels with natural textures',
      fileUrl: '/catalogues/wood-series-catalogue.pdf',
      fileSize: 8388608, // ~8MB
      thumbnail: '/images/wood-series-cover.jpg',
      category: 'product',
      version: '2024',
      order: 2
    },
    {
      name: 'Stone & Marble Series',
      slug: 'stone-marble-series',
      description: 'Elegant stone and marble finish panels',
      fileUrl: '/catalogues/stone-marble-catalogue.pdf',
      fileSize: 10485760, // ~10MB
      thumbnail: '/images/stone-marble-cover.jpg',
      category: 'product',
      version: '2024',
      order: 3
    },
    {
      name: 'Technical Specifications',
      slug: 'technical-specifications',
      description: 'Detailed technical data and installation guidelines',
      fileUrl: '/catalogues/technical-specs.pdf',
      fileSize: 3145728, // ~3MB
      thumbnail: '/images/tech-specs-cover.jpg',
      category: 'technical',
      version: '2024',
      order: 1
    },
    {
      name: 'Installation Guide',
      slug: 'installation-guide',
      description: 'Step-by-step installation instructions with diagrams',
      fileUrl: '/catalogues/installation-guide.pdf',
      fileSize: 5242880, // ~5MB
      thumbnail: '/images/installation-cover.jpg',
      category: 'technical',
      version: '2024',
      order: 2
    },
    {
      name: 'Dealer Partnership Brochure',
      slug: 'dealer-partnership-brochure',
      description: 'Information about becoming a dealer partner',
      fileUrl: '/catalogues/dealer-brochure.pdf',
      fileSize: 2097152, // ~2MB
      thumbnail: '/images/dealer-brochure-cover.jpg',
      category: 'marketing',
      version: '2024',
      order: 1
    }
  ];

  for (const catalogue of catalogues) {
    await prisma.catalogue.upsert({
      where: { slug: catalogue.slug },
      update: {},
      create: catalogue
    });
  }
  console.log(`✅ ${catalogues.length} catalogues created`);

  console.log('\n🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    // eslint-disable-next-line no-undef
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
