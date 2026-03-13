import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Eye, Sparkles, FileText, Phone, Droplets, Shield, Flame, Loader2 } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { H2, Body, SectionBadge, Divider } from '../ui/Typography';
import { Link } from 'react-router-dom';
import { useFeaturedProducts } from '../../hooks/useApi';

// Fallback static products (used when API fails or during loading)
const fallbackProducts = [
  {
    id: 1,
    name: "Royal Oak Wood",
    category: "Wood Series",
    features: ["Natural grain", "8mm thick"],
    gradient: "from-amber-900 via-amber-800 to-amber-950",
    accentColor: "#d97706",
    badge: "Popular",
    finishes: 4
  },
  {
    id: 2,
    name: "Italian Marble",
    category: "Stone Series",
    features: ["High-gloss", "12mm thick"],
    gradient: "from-slate-200 via-gray-300 to-slate-400",
    accentColor: "#94a3b8",
    badge: "New",
    finishes: 5
  },
  {
    id: 3,
    name: "Geometric Teal",
    category: "Modern Series",
    features: ["3D texture", "6mm thick"],
    gradient: "from-teal-700 via-cyan-600 to-teal-800",
    accentColor: "#0891b2",
    badge: null,
    finishes: 3
  },
  {
    id: 4,
    name: "Classic Walnut",
    category: "Wood Series",
    features: ["Matte finish", "10mm thick"],
    gradient: "from-amber-800 via-yellow-900 to-amber-950",
    accentColor: "#92400e",
    badge: "Best Seller",
    finishes: 4
  },
  {
    id: 5,
    name: "Concrete Grey",
    category: "Industrial Series",
    features: ["Industrial look", "8mm thick"],
    gradient: "from-slate-600 via-gray-500 to-slate-700",
    accentColor: "#64748b",
    badge: null,
    finishes: 3
  },
  {
    id: 6,
    name: "Pearl White",
    category: "Solid Series",
    features: ["Clean finish", "6mm thick"],
    gradient: "from-gray-100 via-white to-gray-200",
    accentColor: "#e5e7eb",
    badge: null,
    finishes: 2
  }
];

// Product Card with 3D Tilt Effect
const ProductCard = ({ product, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 20;
    const y = (e.clientY - rect.top - rect.height / 2) / 20;
    setMousePosition({ x, y });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="group relative perspective-1000"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePosition({ x: 0, y: 0 });
      }}
      onMouseMove={handleMouseMove}
    >
      <Link to={`/products/${product.id}`}>
        <motion.div
          animate={{
            rotateX: -mousePosition.y,
            rotateY: mousePosition.x,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative h-full"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Card Container */}
          <div className="relative overflow-hidden rounded-2xl bg-white border border-black/5 transition-all duration-500 group-hover:border-yellow-600/20 group-hover:shadow-2xl group-hover:shadow-yellow-600/10">
            
            {/* Badge */}
            {product.badge && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute top-4 right-4 z-20"
              >
                <span className={`
                  px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide
                  ${product.badge === 'Popular' ? 'bg-linear-to-r from-yellow-500 to-orange-500 text-white' : ''}
                  ${product.badge === 'New' ? 'bg-linear-to-r from-teal to-cyan-400 text-white' : ''}
                  ${product.badge === 'Best Value' ? 'bg-linear-to-r from-emerald-500 to-green-400 text-white' : ''}
                  shadow-lg
                `}>
                  {product.badge}
                </span>
              </motion.div>
            )}

            {/* Image Area with Gradient */}
            <div className={`relative h-64 bg-linear-to-br ${product.gradient} overflow-hidden`}>
              {/* Animated Pattern Overlay */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `repeating-linear-gradient(
                    45deg,
                    transparent,
                    transparent 10px,
                    rgba(255,255,255,0.1) 10px,
                    rgba(255,255,255,0.1) 20px
                  )`,
                }}
              />
              
              {/* Wood grain / texture simulation */}
              <div className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence baseFrequency='0.8'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
                }}
              />
              
              {/* Shine Effect */}
              <motion.div
                initial={{ x: '-100%', opacity: 0 }}
                animate={isHovered ? { x: '200%', opacity: 0.3 } : { x: '-100%', opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute inset-0 bg-linear-to-r from-transparent via-white to-transparent skew-x-12"
              />

              {/* Center Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={isHovered ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
                  className="w-24 h-24 rounded-2xl bg-white/30 backdrop-blur-sm border border-white/40 flex items-center justify-center"
                >
                  <Sparkles className="w-10 h-10 text-white/80" />
                </motion.div>
              </div>
              
              {/* Quick Actions (visible on hover) */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="absolute bottom-4 left-4 right-4 flex justify-center gap-2"
                  >
                    <button className="p-3 rounded-full bg-white/30 backdrop-blur-md border border-white/40 text-white hover:bg-blue-300/25 transition-colors">
                      <Eye className="w-5 h-5" />
                    </button>
                    <button className="p-3 rounded-full bg-white/30 backdrop-blur-md border border-white/40 text-white hover:bg-blue-300/25 transition-colors">
                      <FileText className="w-5 h-5" />
                    </button>
                    <button className="p-3 rounded-full bg-teal/80 backdrop-blur-md text-white hover:bg-teal transition-colors">
                      <Phone className="w-5 h-5" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-yellow-600 text-sm font-medium mb-1">{product.category}</p>
                  <h3 className="text-xl font-bold text-white group-hover:text-yellow-600 transition-colors">
                    {product.name}
                  </h3>
                </div>
                {product.badge === 'Best Seller' && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 rounded-full">
                    <Sparkles className="w-3 h-3 text-yellow-400" />
                    <span className="text-xs text-yellow-400 font-medium">Top Rated</span>
                  </div>
                )}
              </div>

              {/* Product Features */}
              <div className="flex flex-wrap gap-2">
                {product.features.map((feature, i) => (
                  <span key={i} className="text-xs text-slate-200 bg-blue-300/16 border border-blue-200/25 px-2 py-1 rounded-full">
                    {feature}
                  </span>
                ))}
              </div>

              {/* Product Properties */}
              <div className="flex items-center gap-4 text-xs text-slate-300">
                <span className="flex items-center gap-1">
                  <Droplets className="w-3 h-3" /> Water Resistant
                </span>
                <span className="flex items-center gap-1">
                  <Shield className="w-3 h-3" /> 10 Yr Warranty
                </span>
                <span className="flex items-center gap-1">
                  <Flame className="w-3 h-3" /> Fire Retardant
                </span>
              </div>

              {/* View Details */}
              <div className="pt-4 border-t border-blue-200/25 flex items-center justify-between">
                <span className="text-sm text-slate-300">{product.finishes} Finishes Available</span>
                <motion.span
                  className="flex items-center gap-1 text-yellow-600 text-sm font-medium"
                  animate={isHovered ? { x: 5 } : { x: 0 }}
                >
                  View Details <ArrowRight className="w-4 h-4" />
                </motion.span>
              </div>
            </div>
          </div>

          {/* 3D Shadow */}
          <div 
            className="absolute -bottom-4 left-4 right-4 h-8 rounded-2xl blur-xl transition-all duration-500"
            style={{
              background: `linear-gradient(to right, ${product.accentColor}20, transparent)`,
              opacity: isHovered ? 0.5 : 0.2,
            }}
          />
        </motion.div>
      </Link>
    </motion.div>
  );
};

export const FeaturedProducts = () => {
  // Fetch featured products from API
  const { data: apiResponse } = useFeaturedProducts();
  
  // Transform API data to match our card format
  const transformProduct = (product, index) => {
    const gradients = [
      "from-amber-900 via-amber-800 to-amber-950",
      "from-slate-200 via-gray-300 to-slate-400",
      "from-teal-700 via-cyan-600 to-teal-800",
      "from-amber-800 via-yellow-900 to-amber-950",
      "from-slate-600 via-gray-500 to-slate-700",
      "from-gray-100 via-white to-gray-200"
    ];
    const accentColors = ["#d97706", "#94a3b8", "#0891b2", "#92400e", "#64748b", "#e5e7eb"];
    
    // Parse features if stored as JSON string
    let features = [];
    try {
      features = typeof product.features === 'string' 
        ? JSON.parse(product.features) 
        : (product.features || []);
    } catch {
      features = [];
    }
    
    return {
      id: product.id,
      name: product.name,
      category: product.category?.name || 'PVC Panels',
      features: features.slice(0, 2),
      gradient: gradients[index % gradients.length],
      accentColor: accentColors[index % accentColors.length],
      badge: product.isFeatured ? 'Featured' : null,
      finishes: 4
    };
  };

  // Use API products or fallback to static products
  const products = apiResponse?.data?.products 
    ? apiResponse.data.products.slice(0, 6).map(transformProduct)
    : fallbackProducts;

  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 mesh-gradient opacity-30" />
      
      {/* Animated gradient orbs */}
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 20, repeat: Infinity }}
        className="absolute top-20 -left-32 w-96 h-96 rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(0,212,255,0.3) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <SectionBadge className="mb-6">
            <Sparkles className="w-4 h-4" />
            Premium Collection
          </SectionBadge>
          
          <H2 className="mb-6">
            Discover Our <span className="text-yellow-600">Featured</span> Designs
          </H2>
          
          <Body className="text-gray-400" size="lg">
            Explore our most popular PVC panel designs, meticulously crafted to transform 
            ordinary spaces into extraordinary experiences.
          </Body>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link to="/products">
            <Button variant="outline" size="lg" icon={ArrowRight}>
              Explore All Products
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

