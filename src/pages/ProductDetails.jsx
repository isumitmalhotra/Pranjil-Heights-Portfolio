import React, { useState, useRef, useLayoutEffect, startTransition, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { 
  Check, Download, ArrowLeft, Share2, 
  Maximize, ZoomIn, ChevronLeft, ChevronRight,
  ShieldCheck, Truck, Package, Sparkles, FileText, ArrowRight,
  Droplets, Shield, Flame, Leaf, Factory, Award, Phone, Loader2
} from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { H1, H2, H3, Body, SectionBadge } from '../components/ui/Typography';
import { AnimatedBackground, SpotlightEffect } from '../components/ui/AnimatedBackground';
import { products as staticProducts } from '../data/products';
import { useProduct } from '../hooks/useApi';

const getApiOrigin = () => {
  const envApiUrl = import.meta.env.VITE_API_URL?.trim();
  if (envApiUrl) {
    try {
      return new URL(envApiUrl).origin;
    } catch {
      // Fall back to runtime origin if env url is malformed.
    }
  }
  if (typeof window !== 'undefined') return window.location.origin;
  return '';
};

const toAbsoluteMediaUrl = (url) => {
  if (!url || typeof url !== 'string') return null;
  const normalizedUrl = url.replace(/\\/g, '/');
  const apiRelativeUrl = normalizedUrl.startsWith('/uploads/')
    ? normalizedUrl.replace('/uploads/', '/api/uploads/')
    : normalizedUrl;
  if (/^https?:\/\//i.test(apiRelativeUrl)) return apiRelativeUrl;
  const origin = getApiOrigin();
  if (!origin) return apiRelativeUrl;
  return `${origin}${apiRelativeUrl.startsWith('/') ? '' : '/'}${apiRelativeUrl}`;
};

// 3D Product Viewer Component
const ProductViewer3D = ({ images, selectedColor, selectedIndex, onSelect }) => {
  const containerRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useSpring(useTransform(y, [-300, 300], [10, -10]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-300, 300], [-10, 10]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className="space-y-6">
      {/* Main Image with 3D effect */}
      <motion.div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative aspect-square rounded-3xl overflow-hidden shadow-lg border border-blue-200/25 bg-blue-300/15 cursor-grab active:cursor-grabbing"
      >
        {/* Product Image */}
        <motion.div
          key={images[selectedIndex] || selectedIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          {images[selectedIndex] ? (
            <img
              src={images[selectedIndex]}
              alt="Product view"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-linear-to-br from-amber-800 to-amber-900" />
          )}

          {/* Color Overlay */}
          <div 
            className="absolute inset-0 mix-blend-overlay transition-all duration-700"
            style={{ backgroundColor: selectedColor?.hex, opacity: 0.2 }}
          />
        </motion.div>
        
        {/* Reflection */}
        <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-white/5" />
        
        {/* Glass highlight */}
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-linear-to-b from-white/10 to-transparent" />
        
        {/* Navigation Arrows */}
        <button 
          onClick={() => onSelect(selectedIndex === 0 ? images.length - 1 : selectedIndex - 1)}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-blue-300/80 backdrop-blur-sm flex items-center justify-center text-white hover:bg-blue-300/40 transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button 
          onClick={() => onSelect(selectedIndex === images.length - 1 ? 0 : selectedIndex + 1)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-blue-300/80 backdrop-blur-sm flex items-center justify-center text-white hover:bg-blue-300/40 transition-all"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
        
        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button className="w-10 h-10 rounded-full bg-blue-300/80 backdrop-blur-sm flex items-center justify-center text-white hover:bg-blue-300/40 transition-all">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-full bg-blue-300/80 backdrop-blur-sm flex items-center justify-center text-white hover:bg-blue-300/40 transition-all">
            <Maximize className="w-5 h-5" />
          </button>
        </div>
        
        {/* Zoom indicator */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-300/80 backdrop-blur-sm text-white text-sm">
          <ZoomIn className="w-4 h-4" />
          Drag to rotate
        </div>
      </motion.div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="flex gap-3">
          {images.map((img, index) => (
            <motion.button
              key={index}
              onClick={() => onSelect(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative flex-1 aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                selectedIndex === index 
                  ? 'border-yellow-600 shadow-md' 
                  : 'border-blue-200/25 hover:border-yellow-300'
              }`}
            >
              {img ? (
                <img
                  src={img}
                  alt={`Product thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-linear-to-br from-amber-800 to-amber-900" />
              )}

              {selectedIndex === index && (
                <motion.div 
                  layoutId="activeThumb"
                  className="absolute inset-0 bg-yellow-600/10"
                />
              )}
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
};

// Color Selector Component
const ColorSelector = ({ colors, selected, onSelect }) => (
  <div className="space-y-4">
    {colors.length === 0 ? (
      <div className="rounded-xl border border-blue-200/25 bg-blue-400/10 p-4">
        <p className="text-slate-300 text-sm">No finishes have been added for this product yet.</p>
      </div>
    ) : null}

    <div className="flex items-center justify-between">
      <h3 className="text-white font-semibold">Available Finishes</h3>
      <span className="text-yellow-600 font-medium">{selected?.name || '-'}</span>
    </div>
    <div className="flex flex-wrap gap-3">
      {colors.map((color) => (
        <motion.button
          key={color.name}
          onClick={() => onSelect(color)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="group relative"
        >
          {/* Color/Texture Swatch */}
          <div 
            className="w-14 h-14 rounded-xl shadow-lg transition-all overflow-hidden"
            style={{ backgroundColor: color.hex }}
          >
            {/* Show texture image if available */}
            {color.image && (
              <img 
                src={color.image} 
                alt={color.name}
                className="w-full h-full object-cover"
                onError={(e) => e.target.style.display = 'none'}
              />
            )}
          </div>
          
          {/* Selection Ring */}
          <motion.div 
            animate={{ 
              scale: selected?.name === color.name ? 1 : 0,
              opacity: selected?.name === color.name ? 1 : 0
            }}
            className="absolute -inset-1 rounded-xl border-2 border-yellow-600"
          />
          
          {/* Check Mark */}
          <AnimatePresence>
            {selected?.name === color.name && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-8 h-8 rounded-full bg-blue-300/90 flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Tooltip with finish name */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-blue-300/15 rounded text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
            {color.name}
          </div>
        </motion.button>
      ))}
    </div>
    
    {/* Selected finish detail - show texture image preview if available */}
    {selected?.image && (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 p-3 bg-blue-400/10 rounded-lg"
      >
        <div className="flex items-center gap-3">
          <img 
            src={selected.image} 
            alt={selected.name}
            className="w-20 h-14 object-cover rounded-lg shadow"
          />
          <div>
            <p className="text-sm font-medium text-white">{selected.name}</p>
            <p className="text-xs text-slate-400">Texture Preview</p>
          </div>
        </div>
      </motion.div>
    )}
  </div>
);

// Specification Row Component
const SpecRow = ({ label, value, index }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.05 }}
    className={`flex items-center justify-between py-4 px-6 ${
      index % 2 === 0 ? 'bg-blue-300/15' : ''
    }`}
  >
    <span className="text-slate-300 capitalize">
      {label.replace(/([A-Z])/g, ' $1').trim()}
    </span>
    <span className="text-white font-medium">{value}</span>
  </motion.div>
);

// Product Feature Badge
const FeatureBadge = ({ icon: IconComponent, label, color }) => (
  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-300/15 border border-blue-200/20">
    <IconComponent className={`w-4 h-4 ${color}`} />
    <span className="text-slate-200 text-sm">{label}</span>
  </div>
);

// Trust Badge Component
const TrustBadge = ({ icon: IconComponent, title, subtitle }) => (
  <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-400/10 border border-blue-200/25">
    <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center text-yellow-600">
      <IconComponent className="w-5 h-5" />
    </div>
    <div>
      <div className="text-white font-medium text-sm">{title}</div>
      <div className="text-slate-400 text-xs">{subtitle}</div>
    </div>
  </div>
);

// Applications Section
const ApplicationsSection = ({ category }) => {
  const applicationsByCategory = {
    'Wood Series': [
      { name: 'Corporate Offices', description: 'Create warm, professional environments' },
      { name: 'Hotels & Resorts', description: 'Luxury interiors with natural aesthetics' },
      { name: 'Conference Rooms', description: 'Executive boardroom paneling' },
      { name: 'Residential Spaces', description: 'Living rooms and bedroom feature walls' }
    ],
    'Stone Series': [
      { name: 'Reception Areas', description: 'Make a grand first impression' },
      { name: 'Retail Showrooms', description: 'Premium display environments' },
      { name: 'Restaurant Interiors', description: 'Upscale dining ambiance' },
      { name: 'Commercial Lobbies', description: 'High-traffic luxury spaces' }
    ],
    default: [
      { name: 'Commercial Interiors', description: 'Offices, retail, and hospitality' },
      { name: 'Healthcare Facilities', description: 'Hygienic wall solutions' },
      { name: 'Educational Institutions', description: 'Durable classroom paneling' },
      { name: 'Residential Projects', description: 'Modern home interiors' }
    ]
  };

  const applications = applicationsByCategory[category] || applicationsByCategory.default;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {applications.map((app, index) => (
        <motion.div
          key={app.name}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className="p-4 rounded-xl bg-blue-300/15 border border-blue-200/25 hover:border-gold/30 transition-all"
        >
          <h4 className="text-ivory font-medium mb-1">{app.name}</h4>
          <p className="text-ivory/60 text-sm">{app.description}</p>
        </motion.div>
      ))}
    </div>
  );
};

const ProductDetails = () => {
  const { id } = useParams();
  
  // Fetch product from API
  const { data: apiResponse, isLoading } = useProduct(id);
  
  // Transform API product to match expected format
  const transformProduct = (p) => {
    if (!p) return null;
    
    let features = [];
    let applications = [];
    try {
      features = typeof p.features === 'string' ? JSON.parse(p.features) : (p.features || []);
      applications = typeof p.applications === 'string' ? JSON.parse(p.applications) : (p.applications || []);
    } catch {
      features = [];
      applications = [];
    }
    
    // Convert specifications from array to object format if needed
    let specifications = {};
    if (Array.isArray(p.specifications)) {
      p.specifications.forEach(spec => {
        specifications[spec.name] = spec.value + (spec.unit ? ` ${spec.unit}` : '');
      });
    } else if (typeof p.specifications === 'object') {
      specifications = p.specifications || {};
    }
    
    // Parse finishes from API payload.
    let colors = [];
    
    try {
      if (p.finishes) {
        const finishes = typeof p.finishes === 'string' 
          ? JSON.parse(p.finishes) 
          : p.finishes;
        if (Array.isArray(finishes) && finishes.length > 0) {
          colors = finishes.map(f => ({
            name: typeof f === 'string' ? f : (f.name || 'Finish'),
            hex: typeof f === 'string' ? '#D4B896' : (f.hex || '#D4B896'),
            image: typeof f === 'string' ? '' : (toAbsoluteMediaUrl(f.image) || ''),
            images: typeof f === 'string'
              ? []
              : (
                Array.isArray(f.images)
                  ? f.images.map((url) => toAbsoluteMediaUrl(url)).filter(Boolean)
                  : []
              )
          }));
        }
      }
    } catch {
      colors = [];
    }
    
    // Preserve uploaded product image URLs.
    const defaultImages = p.images?.length > 0 
      ? p.images.map(img => toAbsoluteMediaUrl(img.url)).filter(Boolean)
      : [];

    const normalizedSpecifications = Object.fromEntries(
      Object.entries(specifications || {}).map(([key, value]) => [key.toLowerCase(), value])
    );
    
    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      category: p.category?.name || 'General',
      catalogueUrl: p.category?.catalogueUrl || null,
      description: p.description || p.shortDescription || '',
      shortDescription: p.shortDescription || '',
      price: p.price,
      unit: p.unit || 'sq ft',
      features: features,
      applications: applications,
      specifications: normalizedSpecifications,
      colors: colors,
      images: defaultImages,
      defaultImageUrls: defaultImages,
      isFeatured: p.isFeatured
    };
  };
  
  // Get product from API or fallback to static
  const apiProduct = apiResponse?.data?.product || apiResponse?.product;
  const product = apiProduct 
    ? transformProduct(apiProduct)
    : staticProducts.find(p => p.id === parseInt(id) || p.slug === id);
  
  // Get related products from API response or use empty array
  const apiRelatedProducts = apiResponse?.data?.relatedProducts || apiResponse?.relatedProducts || [];
  const relatedProducts = apiRelatedProducts.length > 0 
    ? apiRelatedProducts.map(p => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        category: p.category?.name || 'General',
        image: toAbsoluteMediaUrl(p.images?.[0]?.url),
        colors: (() => {
          try {
            const finishes = typeof p.finishes === 'string' ? JSON.parse(p.finishes) : p.finishes;
            return Array.isArray(finishes) ? finishes : [];
          } catch {
            return [];
          }
        })()
      }))
    : staticProducts.filter(p => p.id !== product?.id && p.category === product?.category).slice(0, 4);
  
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  // Set initial color when product loads - using layout effect to run before paint
  // This is a valid use case for setState in effect - initializing from async data
  const colorInitialized = useRef(false);
  useLayoutEffect(() => {
    if (product?.colors?.[0] && !colorInitialized.current) {
      colorInitialized.current = true;
      startTransition(() => setSelectedColor(product.colors[0]));
    }
  }, [product]);

  // Compute current images based on selected finish
  // If selected finish has specific images, use those; otherwise use product default images
  const currentImages = useMemo(() => {
    if (selectedColor?.images && selectedColor.images.length > 0) {
      return selectedColor.images;
    }
    if (product?.images && product.images.length > 0) {
      return product.images;
    }
    return [null];
  }, [selectedColor, product?.images]);

  // Reset image index when finish changes - handled in color selection handler below

  // Compute display title based on selected finish
  const displayTitle = useMemo(() => {
    if (selectedColor?.name && product) {
      return `${product.name} - ${selectedColor.name}`;
    }
    return product?.name || '';
  }, [selectedColor, product]);

  // Handler for color selection that also resets image index
  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setSelectedImageIndex(0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-yellow-500 mx-auto mb-4" />
          <p className="text-slate-300">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <GlassCard className="text-center p-12">
          <div className="w-20 h-20 rounded-full bg-blue-300/15 flex items-center justify-center mx-auto mb-6">
            <Package className="w-10 h-10 text-slate-300" />
          </div>
          <H2 className="mb-4">Product Not Found</H2>
          <Body className="text-ivory/60 mb-6">
            The product you're looking for doesn't exist or has been removed.
          </Body>
          <Link to="/products">
            <Button variant="primary">Browse Products</Button>
          </Link>
        </GlassCard>
      </div>
    );
  }

  const productFeatures = [
    { icon: Droplets, label: 'Waterproof', color: 'text-yellow-400' },
    { icon: Shield, label: 'Termite Proof', color: 'text-green-400' },
    { icon: Flame, label: 'Fire Retardant', color: 'text-orange-400' },
    { icon: Leaf, label: 'Eco-Friendly', color: 'text-emerald-400' },
  ];

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <AnimatedBackground variant="minimal" />
      <SpotlightEffect />
      
      <div className="container mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 pt-24"
        >
          <Link 
            to="/products" 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-300/15 border border-blue-200/25 text-slate-200 hover:text-yellow-600 hover:border-yellow-300 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: Product Viewer */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="group"
          >
            <ProductViewer3D
              images={currentImages}
              selectedColor={selectedColor}
              selectedIndex={selectedImageIndex}
              onSelect={setSelectedImageIndex}
            />
          </motion.div>

          {/* Right: Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <SectionBadge className="bg-blue-300/16 text-orange-300 border-blue-200/30">{product.category}</SectionBadge>
                {product.badge && (
                  <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-600 text-sm font-medium">
                    {product.badge}
                  </span>
                )}
              </div>
              
              <H1 className="mb-4 font-heading text-white">{displayTitle}</H1>
              
              {/* Product Features */}
              <div className="flex flex-wrap gap-2 mb-6">
                {productFeatures.map((feature, index) => (
                  <FeatureBadge key={index} {...feature} />
                ))}
              </div>
            </div>

            {/* Description */}
            <Body className="text-slate-200 leading-relaxed">{product.description}</Body>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-blue-300/15 border border-blue-200/20">
              <div>
                <span className="text-slate-400 text-sm">Thickness</span>
                <p className="text-white font-medium">{product.specifications?.thickness}</p>
              </div>
              <div>
                <span className="text-slate-400 text-sm">Dimensions</span>
                <p className="text-white font-medium">{product.specifications?.width} x {product.specifications?.length}</p>
              </div>
              <div>
                <span className="text-slate-400 text-sm">Finish</span>
                <p className="text-white font-medium">{selectedColor?.name || 'Standard'}</p>
              </div>
              <div>
                <span className="text-slate-400 text-sm">Available Finishes</span>
                <p className="text-white font-medium">{product.colors.length} options</p>
              </div>
            </div>

            {/* Color Selection */}
            <ColorSelector
              colors={product.colors}
              selected={selectedColor}
              onSelect={handleColorSelect}
            />

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4">
              <TrustBadge icon={ShieldCheck} title="10 Year Warranty" subtitle="Manufacturing defects" />
              <TrustBadge icon={Truck} title="Pan-India Delivery" subtitle="Bulk orders" />
              <TrustBadge icon={Factory} title="Made in India" subtitle="ISO certified facility" />
              <TrustBadge icon={Award} title="Quality Assured" subtitle="100% tested" />
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4 pt-4">
              <div className="flex gap-4">
                <Link 
                  to={`/contact?product=${encodeURIComponent(product.name)}&category=${encodeURIComponent(product.category)}`} 
                  className="flex-1"
                >
                  <Button variant="primary" size="lg" className="w-full">
                    <Phone className="w-5 h-5 mr-2" />
                    Request Quotation
                  </Button>
                </Link>
              </div>
              <div className="flex gap-4">
                <Button variant="outline" size="lg" className="flex-1">
                  <Download className="w-5 h-5 mr-2" />
                  Download Datasheet
                </Button>
                {product.catalogueUrl ? (
                  <a 
                    href={product.catalogueUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button variant="outline" size="lg" className="w-full">
                      <FileText className="w-5 h-5 mr-2" />
                      Product Catalogue
                    </Button>
                  </a>
                ) : (
                  <Button variant="outline" size="lg" className="flex-1" disabled>
                    <FileText className="w-5 h-5 mr-2" />
                    Catalogue Coming Soon
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Technical Specifications Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24"
        >
          <div className="text-center mb-12">
            <SectionBadge className="mb-4 bg-blue-300/16 text-orange-300 border-blue-200/30">
              <Sparkles className="w-4 h-4" />
              Specifications
            </SectionBadge>
            <H2 className="font-heading text-white">Technical <span className="text-yellow-600">Details</span></H2>
          </div>

          <GlassCard className="p-0 overflow-hidden">
            <div className="divide-y divide-gray-200">
              {Object.entries(product.specifications).map(([key, value], index) => (
                <SpecRow key={key} label={key} value={value} index={index} />
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Applications Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24"
        >
          <div className="text-center mb-12">
            <SectionBadge className="mb-4 bg-blue-300/16 text-orange-300 border-blue-200/30">
              <Factory className="w-4 h-4" />
              Applications
            </SectionBadge>
            <H2 className="font-heading text-white">Ideal <span className="text-yellow-600">Use Cases</span></H2>
            <Body className="text-slate-300 max-w-2xl mx-auto mt-4">
              This product is recommended for the following commercial and residential applications.
            </Body>
          </div>

          <ApplicationsSection category={product.category} />
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24"
        >
          <GlassCard className="p-12 text-center">
            <Award className="w-12 h-12 text-yellow-600 mx-auto mb-6" />
            <H2 className="mb-4 font-heading text-white">
              Ready to <span className="text-yellow-600">Place an Order?</span>
            </H2>
            <Body className="text-slate-200 max-w-2xl mx-auto mb-8">
              Contact our sales team for bulk pricing, custom specifications, and delivery timelines. 
              We offer competitive rates for distributors and project contractors.
            </Body>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact">
                <Button variant="primary">
                  Request Quotation
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/dealer">
                <Button variant="outline">
                  Become a Dealer
                </Button>
              </Link>
            </div>
          </GlassCard>
        </motion.div>

        {/* Related Products */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 pb-16"
        >
          <div className="text-center mb-12">
            <SectionBadge className="mb-4 bg-blue-300/16 text-orange-300 border-blue-200/30">
              <Package className="w-4 h-4" />
              Related Products
            </SectionBadge>
            <H2 className="font-heading text-white">You May Also <span className="text-yellow-600">Like</span></H2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.slice(0, 4).map((relatedProduct, index) => (
              <motion.div
                key={relatedProduct.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/products/${relatedProduct.slug || relatedProduct.id}`}>
                  <GlassCard className="p-4 hover:border-yellow-300 transition-all group">
                    <div className="aspect-square rounded-xl mb-4 overflow-hidden bg-gray-200 group-hover:scale-105 transition-transform">
                      {relatedProduct.image ? (
                        <img
                          src={relatedProduct.image}
                          alt={relatedProduct.name}
                          className="w-full h-full object-cover"
                        />
                      ) : null}
                    </div>
                    <p className="text-yellow-600 text-xs font-medium mb-1">{relatedProduct.category}</p>
                    <h3 className="text-white font-medium group-hover:text-yellow-600 transition-colors">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-slate-400 text-sm mt-1">{relatedProduct.colors?.length || 0} finishes</p>
                  </GlassCard>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetails;


