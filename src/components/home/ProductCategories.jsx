import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { ChevronRight, Check, Loader2 } from 'lucide-react';
import { H2 } from '../ui/Typography';
import { Button } from '../ui/Button';
import { Link } from 'react-router-dom';
import { useCategories } from '../../hooks/useApi';

// Category Card Component
const CategoryCard = ({ image, title, features, slug, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    className="group relative"
  >
    <div className="glass-card overflow-hidden hover:border-gold/30 transition-all duration-500">
      {/* Image */}
      <div className="relative aspect-4/3 overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-linear-to-t from-charcoal via-charcoal/50 to-transparent" />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 text-xs font-medium bg-gold/90 text-charcoal rounded-full">
            Premium Range
          </span>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-gold transition-colors">
          {title}
        </h3>
        
        {/* Features List */}
        <ul className="space-y-2 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 text-gray-600 text-sm">
              <Check className="w-4 h-4 text-gold shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        
        {/* CTA */}
        <Link to={`/products?category=${slug}`}>
          <Button variant="outline" size="sm" icon={ChevronRight} className="w-full">
            Explore Range
          </Button>
        </Link>
      </div>
    </div>
  </motion.div>
);

export const ProductCategories = () => {
  // Fetch categories from API
  const { data: apiResponse } = useCategories();
  
  // Static fallback categories with images
  const fallbackCategories = [
    {
      title: "Wall Panels",
      slug: "wall-panels",
      image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=2070&auto=format&fit=crop",
      features: [
        "Wood grain & marble textures",
        "100% waterproof & termite resistant",
        "Easy click-lock installation",
        "10-year warranty included"
      ]
    },
    {
      title: "Ceiling Panels",
      slug: "ceiling-panels",
      image: "https://images.unsplash.com/photo-1615873968403-89e068629265?q=80&w=2070&auto=format&fit=crop",
      features: [
        "Lightweight & durable construction",
        "Thermal & acoustic insulation",
        "False ceiling compatible",
        "Multiple finish options"
      ]
    },
    {
      title: "3D Panels",
      slug: "3d-panels",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2032&auto=format&fit=crop",
      features: [
        "Modern geometric patterns",
        "Adds depth & visual interest",
        "Perfect for accent walls",
        "Premium designer collection"
      ]
    },
    {
      title: "Exterior Cladding",
      slug: "exterior",
      image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2070&auto=format&fit=crop",
      features: [
        "Weather resistant formulation",
        "UV protected surface",
        "Low maintenance exterior",
        "25-year outdoor warranty"
      ]
    },
    {
      title: "Wood Series",
      slug: "wood-series",
      image: "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?q=80&w=2070&auto=format&fit=crop",
      features: [
        "Natural wood appearance",
        "Oak, walnut & teak finishes",
        "Eco-friendly alternative",
        "Authentic texture & grain"
      ]
    },
    {
      title: "Marble Series",
      slug: "marble-series",
      image: "https://images.unsplash.com/photo-1600607687644-c7171b42498f?q=80&w=2070&auto=format&fit=crop",
      features: [
        "Luxury marble aesthetics",
        "Carrara & Statuario designs",
        "Fraction of natural stone cost",
        "Seamless large panels"
      ]
    }
  ];

  // Default images for categories without images
  const defaultImages = [
    "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1615873968403-89e068629265?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2032&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600607687644-c7171b42498f?q=80&w=2070&auto=format&fit=crop"
  ];

  // Transform API categories
  const transformCategory = (cat, index) => ({
    title: cat.name,
    slug: cat.slug,
    image: cat.image || defaultImages[index % defaultImages.length],
    features: [
      cat.description?.slice(0, 40) + '...' || 'Premium quality',
      `${cat._count?.products || 0} products available`,
      '100% Waterproof',
      'Easy Installation'
    ]
  });

  // Use API categories or fallback
  const categories = apiResponse?.data?.categories 
    ? apiResponse.data.categories.slice(0, 6).map(transformCategory)
    : fallbackCategories;

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gray-50" />
      <div className="absolute inset-0 mesh-gradient opacity-10" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 mb-6">
            <span className="text-gold text-sm font-medium">Our Product Range</span>
          </div>
          
          <H2 className="mb-6">
            Complete Solutions for{' '}
            <span className="gradient-text">Every Space</span>
          </H2>
          
          <p className="text-gray-600 text-lg">
            From modern offices to luxury homes, our comprehensive range of PVC panels 
            offers the perfect solution for walls, ceilings, and exterior applications.
          </p>
        </motion.div>
        
        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <CategoryCard key={category.slug} {...category} delay={index * 0.1} />
          ))}
        </div>
        
        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link to="/products">
            <Button variant="primary" size="lg" icon={ChevronRight}>
              View All Products
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

