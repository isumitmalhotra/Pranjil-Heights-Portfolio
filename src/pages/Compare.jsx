import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Download, Check, Minus, ArrowRight, Sparkles, Scale, RefreshCw } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { H1, Body, SectionBadge } from '../components/ui/Typography';
import { AnimatedBackground, SpotlightEffect } from '../components/ui/AnimatedBackground';
import { products } from '../data/products';

// Comparison Result Badge
const ComparisonBadge = ({ value, isBest, type = 'text' }) => {
  if (type === 'boolean') {
    return value === 'Yes' ? (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm">
        <Check className="w-4 h-4" />
        Yes
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-sm">
        <Minus className="w-4 h-4" />
        No
      </span>
    );
  }
  
  return (
    <span className={`font-medium ${isBest ? 'text-yellow-600' : 'text-white'}`}>
      {value}
      {isBest && (
        <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-600 text-xs">
          Best
        </span>
      )}
    </span>
  );
};

// Product Card for Comparison Header
const CompareProductCard = ({ product, onRemove }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="relative"
  >
    <GlassCard className="h-full flex flex-col items-center text-center p-6 relative group">
      {/* Remove Button */}
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onRemove}
        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-blue-300/15 flex items-center justify-center text-slate-300 hover:bg-red-500/20 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100"
      >
        <X className="w-4 h-4" />
      </motion.button>
      
      {/* Product Image */}
      <motion.div 
        whileHover={{ scale: 1.05, rotateY: 5 }}
        className={`w-28 h-28 rounded-xl mb-4 shadow-lg ${product.images[0]}`} 
      />
      
      {/* Product Info */}
      <h3 className="text-lg font-bold text-white mb-1">{product.name}</h3>
      <p className="text-yellow-600 text-sm font-medium">{product.category}</p>
    </GlassCard>
  </motion.div>
);

// Add Product Card
const AddProductCard = ({ onClick, disabled }) => (
  <motion.button
    whileHover={!disabled ? { scale: 1.02 } : {}}
    whileTap={!disabled ? { scale: 0.98 } : {}}
    onClick={onClick}
    disabled={disabled}
    className={`w-full h-full min-h-70 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all group ${
      disabled 
        ? 'border-blue-200/20 text-slate-300 cursor-not-allowed'
        : 'border-blue-200/25 text-slate-300 hover:text-teal hover:border-teal/50'
    }`}
  >
    <motion.div 
      animate={!disabled ? { scale: [1, 1.1, 1] } : {}}
      transition={{ repeat: Infinity, duration: 2 }}
      className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
        disabled ? 'bg-blue-300/15' : 'bg-blue-300/15 group-hover:bg-teal/10'
      }`}
    >
      <Plus className="w-8 h-8" />
    </motion.div>
    <span className="font-medium text-lg">Add Product</span>
    <span className="text-sm mt-1 text-slate-400">
      {disabled ? 'Maximum 4 products' : 'Click to select'}
    </span>
  </motion.button>
);

// Product Selection Modal
const ProductModal = ({ isOpen, onClose, onSelect, excludeIds }) => {
  const availableProducts = products.filter(p => !excludeIds.includes(p.id));
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-3xl"
          >
            <GlassCard className="max-h-[80vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex justify-between items-center mb-6 pb-6 border-b border-blue-200/25">
                <div>
                  <h3 className="text-2xl font-bold text-white">Select Product</h3>
                  <p className="text-slate-300 text-sm mt-1">Choose a product to add to comparison</p>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose} 
                  className="w-10 h-10 rounded-full bg-blue-300/15 flex items-center justify-center text-slate-300 hover:text-white hover:bg-blue-300/10 transition-all"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
              
              {/* Products Grid */}
              <div className="overflow-y-auto grow pr-2 -mr-2">
                {availableProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {availableProducts.map((product, index) => (
                      <motion.button
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => onSelect(product)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-4 p-4 rounded-xl border border-blue-200/25 hover:bg-blue-300/15 hover:border-teal/50 transition-all text-left group"
                      >
                        <div className={`w-20 h-20 rounded-xl shadow-lg ${product.images[0]}`} />
                        <div className="flex-1">
                          <h4 className="font-bold text-white group-hover:text-teal transition-colors">
                            {product.name}
                          </h4>
                          <p className="text-sm text-slate-300">{product.category}</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-teal transition-all group-hover:translate-x-1" />
                      </motion.button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-blue-300/15 flex items-center justify-center mx-auto mb-4">
                      <Check className="w-8 h-8 text-teal" />
                    </div>
                    <p className="text-slate-300">All products have been selected for comparison.</p>
                  </div>
                )}
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Compare = () => {
  const [selectedProducts, setSelectedProducts] = useState(products.slice(0, 3));
  const [isModalOpen, setIsModalOpen] = useState(false);

  const removeProduct = (id) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== id));
  };

  const addProduct = (product) => {
    if (selectedProducts.length < 4) {
      setSelectedProducts([...selectedProducts, product]);
      setIsModalOpen(false);
    }
  };

  const resetComparison = () => {
    setSelectedProducts([]);
  };

  const specs = [
    { key: 'category', label: 'Category', type: 'text' },
    { key: 'material', label: 'Material', isSpec: true, type: 'text' },
    { key: 'thickness', label: 'Thickness', isSpec: true, type: 'text' },
    { key: 'finish', label: 'Finish', isSpec: true, type: 'text' },
    { key: 'dimensions', label: 'Dimensions', isSpec: true, type: 'text' },
    { key: 'waterproof', label: 'Waterproof', isSpec: true, type: 'boolean' },
    { key: 'fireResistant', label: 'Fire Resistant', isSpec: true, type: 'boolean' },
  ];

  // Find best value for comparison - now focused on specs not price
  const getBestValue = () => {
    return null;
  };

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <AnimatedBackground variant="minimal" />
      <SpotlightEffect />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-12">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <SectionBadge className="mb-6">
              <Scale className="w-4 h-4" />
              Product Comparison
            </SectionBadge>
            
            <H1 className="mb-6">
              Compare <span className="text-yellow-600">Products</span>
            </H1>
            
            <Body className="text-slate-300 text-lg">
              Compare specifications and features side by side to find the perfect match for your project.
            </Body>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative py-12">
        <div className="container mx-auto px-6">
          {selectedProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-24"
            >
              <GlassCard className="max-w-md mx-auto py-16">
                <div className="w-20 h-20 rounded-full bg-blue-300/15 flex items-center justify-center mx-auto mb-6">
                  <Scale className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No Products Selected</h3>
                <p className="text-slate-400 mb-8">
                  Select up to 4 products to compare their features and specifications.
                </p>
                <Button onClick={() => setIsModalOpen(true)} variant="primary" glow>
                  <Plus className="w-5 h-5 mr-2" />
                  Select Products
                </Button>
              </GlassCard>
            </motion.div>
          ) : (
            <>
              {/* Action Bar */}
              <div className="flex justify-between items-center mb-8">
                <p className="text-slate-400">
                  Comparing <span className="text-white font-medium">{selectedProducts.length}</span> of 4 products
                </p>
                <div className="flex gap-4">
                  <Button variant="ghost" onClick={resetComparison} icon={RefreshCw}>
                    Reset
                  </Button>
                  <Button variant="outline" icon={Download}>
                    Download PDF
                  </Button>
                </div>
              </div>

              {/* Product Headers */}
              <div className="grid grid-cols-5 gap-4 mb-8">
                <div className="hidden lg:block" /> {/* Spacer for specs column */}
                <AnimatePresence mode="popLayout">
                  {selectedProducts.map(product => (
                    <CompareProductCard 
                      key={product.id}
                      product={product}
                      onRemove={() => removeProduct(product.id)}
                    />
                  ))}
                </AnimatePresence>
                {selectedProducts.length < 4 && (
                  <AddProductCard 
                    onClick={() => setIsModalOpen(true)}
                    disabled={selectedProducts.length >= 4}
                  />
                )}
              </div>

              {/* Comparison Table */}
              <GlassCard className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <tbody>
                      {specs.map((spec, index) => (
                        <motion.tr 
                          key={spec.key}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={index % 2 === 0 ? 'bg-blue-300/15' : ''}
                        >
                          <td className="p-5 text-gray-300 font-medium w-48">
                            {spec.label}
                          </td>
                          {selectedProducts.map(product => {
                            const value = spec.isSpec 
                              ? product.specifications[spec.key] 
                              : spec.format ? spec.format(product[spec.key]) : product[spec.key];
                            const isBest = spec.compareType === 'lowest' && product[spec.key] === getBestValue(spec.key);
                            
                            return (
                              <td key={product.id} className="p-5 text-center">
                                <ComparisonBadge value={value} isBest={isBest} type={spec.type} />
                              </td>
                            );
                          })}
                          {selectedProducts.length < 4 && <td className="p-5" />}
                        </motion.tr>
                      ))}
                      
                      {/* Action Row */}
                      <tr className="border-t border-blue-200/25">
                        <td className="p-5" />
                        {selectedProducts.map(product => (
                          <td key={product.id} className="p-5 text-center">
                            <Button variant="primary" size="sm" className="w-full" glow>
                              Get Quote
                            </Button>
                          </td>
                        ))}
                        {selectedProducts.length < 4 && <td className="p-5" />}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </GlassCard>
            </>
          )}
        </div>
      </section>

      {/* Tips Section */}
      <section className="relative py-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <GlassCard className="p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center shrink-0">
                  <Sparkles className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Pro Tip</h3>
                  <p className="text-slate-300">
                    Not sure which product to choose? Consider your specific needs: 
                    <span className="text-yellow-600"> Waterproof panels</span> are ideal for bathrooms, 
                    <span className="text-red-600"> Fire-resistant panels</span> are recommended for commercial spaces, and 
                    <span className="text-white font-medium"> Premium finishes</span> work best for living areas and bedrooms.
                    Our team is always happy to help you make the right choice!
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Product Selection Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={addProduct}
        excludeIds={selectedProducts.map(p => p.id)}
      />
    </div>
  );
};

export default Compare;


