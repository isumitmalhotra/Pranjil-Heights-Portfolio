import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Grid, List, ArrowRight, Sparkles, 
  Layers, Package, FileText, Droplets, Shield, Flame, Leaf, Award,
  Palette, Grid3X3, Mountain, Box, ChevronRight, Loader2
} from 'lucide-react';
import { AnimatedBackground } from '../components/ui/AnimatedBackground';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { H1, H2, Body, SectionBadge } from '../components/ui/Typography';
import { products as staticProducts } from '../data/products';
import { useProducts } from '../hooks/useApi';

// Category mapping for URL params to display names and data
const categoryMapping = {
  'wall': { name: 'Wall Panels', displayName: 'PVC Wall Panels', icon: Palette, filter: ['Wood Series', 'Stone Series', 'Solid Colors'] },
  'wall-panels': { name: 'Wall Panels', displayName: 'PVC Wall Panels', icon: Palette, filter: ['Wood Series', 'Stone Series', 'Solid Colors'] },
  'ceiling': { name: 'Ceiling Panels', displayName: 'PVC Ceiling Panels', icon: Grid3X3, filter: ['Stone Series', 'Solid Colors'] },
  'ceiling-panels': { name: 'Ceiling Panels', displayName: 'PVC Ceiling Panels', icon: Grid3X3, filter: ['Stone Series', 'Solid Colors'] },
  '3d': { name: '3D Panels', displayName: '3D Designer Panels', icon: Box, filter: ['3D Series'] },
  '3d-panels': { name: '3D Panels', displayName: '3D Designer Panels', icon: Box, filter: ['3D Series'] },
  'exterior': { name: 'Exterior', displayName: 'Exterior Cladding', icon: Mountain, filter: ['Stone Series'] },
  'wood': { name: 'Wood Series', displayName: 'Wood Series', icon: Layers, filter: ['Wood Series'] },
  'stone': { name: 'Stone Series', displayName: 'Stone Series', icon: Package, filter: ['Stone Series'] },
  'solid': { name: 'Solid Colors', displayName: 'Solid Colors', icon: Sparkles, filter: ['Solid Colors'] },
};

// Category data with B2B focus
const categoryInfo = {
  'Wood Series': {
    icon: Layers,
    description: 'Premium wood-finish panels with authentic grain textures',
    features: ['Natural grain patterns', 'Multiple finishes', 'Warm aesthetics'],
    applications: ['Corporate offices', 'Hotels & resorts', 'Residential interiors']
  },
  'Stone Series': {
    icon: Package,
    description: 'Luxurious marble and stone effect panels',
    features: ['High-gloss finish', 'Lightweight', 'Zero maintenance'],
    applications: ['Lobbies & reception', 'Showrooms', 'Commercial spaces']
  },
  'Solid Colors': {
    icon: Sparkles,
    description: 'Vibrant solid color panels for modern interiors',
    features: ['UV resistant', 'Consistent color', 'Easy to clean'],
    applications: ['Retail stores', 'Healthcare facilities', 'Educational institutions']
  },
  '3D Series': {
    icon: Award,
    description: 'Textured 3D panels for architectural statement walls',
    features: ['Unique textures', 'Acoustic properties', 'Design flexibility'],
    applications: ['Feature walls', 'Conference rooms', 'Hospitality spaces']
  },
  'Modern Series': {
    icon: Box,
    description: 'Contemporary designs for modern architecture',
    features: ['Sleek finishes', 'Geometric patterns', 'Bold colors'],
    applications: ['Commercial spaces', 'Modern homes', 'Retail environments']
  }
};

// Main category tabs for filtering
const mainCategoryTabs = [
  { id: 'all', name: 'All Products', icon: Package },
  { id: 'wall-panels', name: 'Wall Panels', icon: Palette },
  { id: 'ceiling-panels', name: 'Ceiling Panels', icon: Grid3X3 },
  { id: '3d-panels', name: '3D Panels', icon: Box },
  { id: 'exterior', name: 'Exterior', icon: Mountain },
];

// Product features for B2B
const productFeatures = [
  { icon: Droplets, label: '100% Waterproof', color: 'text-yellow-400' },
  { icon: Shield, label: 'Termite Proof', color: 'text-green-400' },
  { icon: Flame, label: 'Fire Retardant', color: 'text-orange-400' },
  { icon: Leaf, label: 'Eco-Friendly', color: 'text-emerald-400' },
];

// Product Card - B2B Version (no prices)
const ProductCard = ({ product, index, viewMode }) => {
  const gradientMap = {
    'Wood Series': 'from-amber-800 to-amber-900',
    'Stone Series': 'from-gray-600 to-gray-800',
    'Solid Colors': 'from-yellow-600/30 to-charcoal',
    '3D Series': 'from-purple-800 to-indigo-900',
  };
  
  const gradient = gradientMap[product.category] || 'from-charcoal-light to-charcoal';

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, duration: 0.5 }}
      >
      <Link to={`/products/${product.slug || product.id}`}>
          <div className="glass-card p-6 flex gap-6 group hover:border-yellow-500/30 transition-all duration-300">
            <div className={`w-40 h-32 rounded-xl bg-linear-to-br ${gradient} shrink-0 relative overflow-hidden`}>
              <div className="absolute inset-0 flex items-center justify-center">
                <Package className="w-10 h-10 text-white/40" />
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-yellow-600 text-sm font-medium">{product.category}</span>
                  {product.badge && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-600">
                      {product.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-800 group-hover:text-yellow-600 transition-colors font-heading">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2 mt-2">{product.description}</p>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>{product.specifications?.thickness} thick</span>
                  <span className="w-1 h-1 rounded-full bg-gray-400" />
                  <span>{product.colors.length} finishes available</span>
                </div>
                <span className="text-yellow-600 text-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  View Details <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      className="group"
    >
      <Link to={`/products/${product.slug || product.id}`}>
        <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-200 transition-all duration-500 group-hover:border-yellow-500/30 group-hover:shadow-lg">
          {/* Badge */}
          {product.badge && (
            <div className="absolute top-4 right-4 z-20">
              <span className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide bg-yellow-600 text-white">
                {product.badge}
              </span>
            </div>
          )}

          {/* Image */}
          <div className={`relative h-48 bg-linear-to-br ${gradient} overflow-hidden`}>
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-20 h-20 rounded-2xl bg-white/30 backdrop-blur-sm border border-white/40 flex items-center justify-center"
              >
                <Package className="w-8 h-8 text-white/80" />
              </motion.div>
            </div>
            
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="flex items-center gap-2 text-white font-medium">
                View Product Details
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 space-y-3">
            <div>
              <p className="text-yellow-600 text-sm font-medium mb-1">{product.category}</p>
              <h3 className="text-lg font-bold text-gray-800 group-hover:text-yellow-600 transition-colors font-heading">
                {product.name}
              </h3>
            </div>

            <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>

            <div className="pt-3 border-t border-black/5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{product.specifications?.thickness} thickness</span>
                <span className="text-gray-600">{product.colors.length} finishes</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

// Category Overview Card
const CategoryCard = ({ category, products: allProducts, onClick, isSelected }) => {
  const info = categoryInfo[category] || {};
  const IconComponent = info.icon || Package;
  const productCount = allProducts.filter(p => p.category === category).length;

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -4 }}
      className={`text-left p-6 rounded-2xl border transition-all duration-300 ${
        isSelected 
          ? 'bg-yellow-50 border-yellow-500 shadow-md' 
          : 'bg-gray-50 border-gray-200 hover:border-yellow-300'
      }`}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
        isSelected ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-yellow-600'
      }`}>
        <IconComponent className="w-6 h-6" />
      </div>
      <h3 className={`font-bold mb-1 ${isSelected ? 'text-yellow-600' : 'text-gray-800'}`}>
        {category}
      </h3>
      <p className="text-sm text-gray-600 mb-2">{productCount} products</p>
      <p className="text-xs text-gray-500 line-clamp-2">{info.description}</p>
    </motion.button>
  );
};

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  
  // Fetch products from API
  const { data: apiResponse } = useProducts();
  
  // Transform API products to match static format
  const transformProduct = (p) => {
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
    
    // Create default colors if not provided
    const colors = p.colors || [
      { name: 'Natural', hex: '#D4B896' },
      { name: 'Walnut', hex: '#5D4037' },
      { name: 'Oak', hex: '#C4A35A' },
      { name: 'White', hex: '#F5F5F5' }
    ];
    
    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      category: p.category?.name || 'General',
      description: p.description || p.shortDescription || '',
      shortDescription: p.shortDescription || '',
      price: p.price,
      unit: p.unit || 'sq ft',
      image: p.images?.[0]?.url || '/placeholder-product.jpg',
      features: features,
      applications: applications,
      specifications: specifications,
      colors: colors,
      isFeatured: p.isFeatured,
      badge: p.isFeatured ? 'Featured' : null
    };
  };

  // Use API products or fallback to static products
  // React Query wraps data in .data, and our API response has { success, data: { products } }
  const apiProducts = apiResponse?.data?.products || apiResponse?.products;
  const products = useMemo(() => {
    return apiProducts 
      ? apiProducts.map(transformProduct)
      : staticProducts;
  }, [apiProducts]);
  
  // Get category from URL params
  const categoryParam = searchParams.get('category') || 'all';
  const mappedCategory = categoryMapping[categoryParam];
  
  // Get unique series categories from products
  const seriesCategories = ['All', ...new Set(products.map(p => p.category))];
  
  // Handle category change
  const handleCategoryChange = (categoryId) => {
    if (categoryId === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', categoryId);
    }
    setSearchParams(searchParams);
  };
  
  // Get active category display name
  const activeCategoryName = mappedCategory?.displayName || 'All Products';

  const filteredProducts = useMemo(() => {
    let result = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by URL category param
      let matchesCategory = true;
      if (mappedCategory && mappedCategory.filter) {
        matchesCategory = mappedCategory.filter.includes(product.category);
      }
      
      return matchesSearch && matchesCategory;
    });
    
    // Sort
    switch(sortBy) {
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'category':
        result.sort((a, b) => a.category.localeCompare(b.category));
        break;
      default:
        // Featured - keep original order
        break;
    }
    
    return result;
  }, [searchTerm, sortBy, mappedCategory, products]);

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 relative">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <SectionBadge className="mb-6">
              <Package className="w-4 h-4" />
              {categoryParam !== 'all' ? activeCategoryName : 'Product Range'}
            </SectionBadge>
            
            <H1 className="mb-6 font-heading">
              {categoryParam !== 'all' ? (
                <>Premium <span className="text-gold">{activeCategoryName}</span></>
              ) : (
                <>Premium PVC <span className="text-gold">Panel Solutions</span></>
              )}
            </H1>
            
            <Body className="text-gray-600 text-lg mb-8">
              {mappedCategory ? (
                `Explore our comprehensive range of high-quality ${activeCategoryName.toLowerCase()}. 
                Each product is engineered for durability, aesthetics, and ease of installation.`
              ) : (
                `Explore our comprehensive range of high-quality PVC wall and ceiling panels. 
                Each product is engineered for durability, aesthetics, and ease of installation.`
              )}
            </Body>

            {/* Product Features Bar */}
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              {productFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <feature.icon className={`w-4 h-4 ${feature.color}`} />
                  <span className="text-gray-600">{feature.label}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact">
                <Button variant="primary">
                  Request Quotation
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/resources">
                <Button variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  Download Catalogue
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="pb-8 sticky top-20 z-30 bg-white border-b border-gray-200">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-hide">
            {mainCategoryTabs.map((tab) => {
              const isActive = (tab.id === 'all' && categoryParam === 'all') || 
                               categoryParam === tab.id;
              const TabIcon = tab.icon;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => handleCategoryChange(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm whitespace-nowrap transition-all duration-300 ${
                    isActive
                      ? 'bg-yellow-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
                  }`}
                >
                  <TabIcon className="w-4 h-4" />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-24 pt-8">
        <div className="container mx-auto px-6">
          {/* Toolbar */}
          <div className="glass-card p-4 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative w-full lg:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search products by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-100 border border-gray-200 rounded-xl pl-12 pr-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-colors"
                />
              </div>
              
              <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-end">
                {/* Series Filter Pills (Desktop) */}
                <div className="hidden xl:flex gap-2">
                  {seriesCategories.slice(0, 5).map(category => (
                    <button
                      key={category}
                      onClick={() => {
                        if (category === 'All') {
                          handleCategoryChange('all');
                        } else {
                          // Map series to URL param
                          const paramMap = {
                            'Wood Series': 'wood',
                            'Stone Series': 'stone',
                            'Solid Colors': 'solid',
                            '3D Series': '3d-panels',
                            'Modern Series': 'wall-panels'
                          };
                          handleCategoryChange(paramMap[category] || 'all');
                        }
                      }}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        (category === 'All' && categoryParam === 'all') ||
                        (mappedCategory?.filter?.includes(category))
                          ? 'bg-yellow-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
                
                {/* Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors xl:hidden"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                </button>
                
                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-100 border border-gray-200 rounded-xl px-4 py-2 text-gray-800 text-sm focus:outline-none focus:border-yellow-500 appearance-none cursor-pointer"
                >
                  <option value="featured" className="bg-white">Featured</option>
                  <option value="name" className="bg-white">Name: A-Z</option>
                  <option value="category" className="bg-white">By Category</option>
                </select>
                
                {/* View Toggle */}
                <div className="flex rounded-xl border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results Info */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">
              Showing <span className="text-gold font-medium">{filteredProducts.length}</span> products
              {categoryParam !== 'all' && (
                <span> in <span className="text-gold">{activeCategoryName}</span></span>
              )}
            </p>
            {categoryParam !== 'all' && (
              <button
                onClick={() => handleCategoryChange('all')}
                className="text-sm text-gold hover:text-gold-light flex items-center gap-1"
              >
                Clear filters <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Products Grid/List */}
          {filteredProducts.length > 0 ? (
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
            }>
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product, index) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    index={index}
                    viewMode={viewMode}
                  />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-24 glass-card">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No products found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search or category filter</p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  handleCategoryChange('all');
                }}
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* B2B CTA Section */}
      <section className="py-16 border-t border-white/5">
        <div className="container mx-auto px-6">
          <GlassCard className="p-12 text-center">
            <Award className="w-12 h-12 text-yellow-600 mx-auto mb-6" />
            <H2 className="mb-4 font-heading">
              Need Custom <span className="text-yellow-600">Specifications?</span>
            </H2>
            <Body className="text-gray-700 max-w-2xl mx-auto mb-8">
              We offer custom panel solutions for large-scale commercial projects. 
              Our team can work with you on bulk orders, custom dimensions, and specialized finishes.
            </Body>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact">
                <Button variant="primary">
                  Request Custom Quote
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline">
                  Speak to Sales Team
                </Button>
              </Link>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Mobile Filter Modal */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 xl:hidden"
          >
            <div 
              className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
              onClick={() => setShowFilters(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="absolute right-0 top-0 bottom-0 w-80 bg-white border-l border-black/10 p-6 overflow-y-auto"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-6">Filter Products</h3>
              
              {/* Category Tabs */}
              <div className="space-y-2 mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Product Type</h4>
                {mainCategoryTabs.map(tab => {
                  const TabIcon = tab.icon;
                  const isActive = (tab.id === 'all' && categoryParam === 'all') || categoryParam === tab.id;
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        handleCategoryChange(tab.id);
                        setShowFilters(false);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${
                        isActive
                          ? 'bg-gold text-white font-medium'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <TabIcon className="w-4 h-4" />
                      {tab.name}
                    </button>
                  );
                })}
              </div>
              
              {/* Series Filter */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Series</h4>
                {seriesCategories.map(category => (
                  <button
                    key={category}
                    onClick={() => {
                      if (category === 'All') {
                        handleCategoryChange('all');
                      } else {
                        const paramMap = {
                          'Wood Series': 'wood',
                          'Stone Series': 'stone',
                          'Solid Colors': 'solid',
                          '3D Series': '3d-panels',
                          'Modern Series': 'wall-panels'
                        };
                        handleCategoryChange(paramMap[category] || 'all');
                      }
                      setShowFilters(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                      (category === 'All' && categoryParam === 'all') ||
                      (mappedCategory?.filter?.includes(category))
                        ? 'bg-gold text-white font-medium'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Products;

