import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Download, FileText, BookOpen, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from './Button';

// Catalogue items data
const defaultCatalogues = [
  {
    id: 'main',
    title: 'Product Catalogue 2024',
    description: 'Complete range of PVC panels with specifications',
    pages: '48 pages',
    size: '15 MB',
    type: 'PDF',
    featured: true
  },
  {
    id: 'technical',
    title: 'Technical Specifications',
    description: 'Detailed specs, installation guides & test reports',
    pages: '24 pages',
    size: '8 MB',
    type: 'PDF',
    featured: false
  },
  {
    id: 'colors',
    title: 'Color & Finish Guide',
    description: 'Full color palette with finish samples',
    pages: '16 pages',
    size: '12 MB',
    type: 'PDF',
    featured: false
  }
];

// Single Catalogue Card
const CatalogueCard = ({ title, description, pages, size, type, featured, delay = 0, onDownload }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className={`relative group ${featured ? 'md:col-span-2 lg:col-span-1' : ''}`}
  >
    <div className={`h-full p-6 rounded-2xl border transition-all duration-300 ${
      featured 
        ? 'bg-yellow-50 border-yellow-600/30 hover:border-yellow-600/50' 
        : 'bg-white/5 border-white/10 hover:border-yellow-600/30 hover:bg-white/10'
    }`}>
      {/* Featured Badge */}
      {featured && (
        <div className="absolute -top-3 left-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-600 text-white text-xs font-semibold rounded-full">
            <Sparkles className="w-3 h-3" />
            Most Downloaded
          </span>
        </div>
      )}
      
      {/* Icon */}
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${
        featured ? 'bg-yellow-600/20' : 'bg-white/5'
      }`}>
        <BookOpen className={`w-7 h-7 ${featured ? 'text-yellow-600' : 'text-ivory/60'}`} />
      </div>
      
      {/* Content */}
      <h4 className="text-lg font-semibold text-ivory mb-2 group-hover:text-yellow-600 transition-colors">
        {title}
      </h4>
      <p className="text-ivory/60 text-sm mb-4">{description}</p>
      
      {/* Meta */}
      <div className="flex items-center gap-4 text-xs text-ivory/40 mb-5">
        <span className="flex items-center gap-1">
          <FileText className="w-3.5 h-3.5" />
          {pages}
        </span>
        <span>•</span>
        <span>{size}</span>
        <span>•</span>
        <span className="uppercase">{type}</span>
      </div>
      
      {/* Download Button */}
      <Button
        variant={featured ? 'primary' : 'outline'}
        size="sm"
        icon={Download}
        onClick={onDownload}
        className="w-full"
      >
        Download {type}
      </Button>
    </div>
  </motion.div>
);

// Prominent CTA Section Component
export const CatalogueDownloadCTA = ({ onDownload }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="relative overflow-hidden rounded-2xl"
  >
    {/* Background */}
    <div className="absolute inset-0 bg-yellow-50" />
    <div className="absolute inset-0 bg-charcoal/80" />
    
    {/* Decorative Elements */}
    <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-600/10 rounded-full blur-3xl" />
    <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-600/5 rounded-full blur-2xl" />
    
    <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
      {/* Content */}
      <div className="flex items-start gap-6">
        <div className="w-16 h-16 rounded-2xl bg-yellow-600/20 flex items-center justify-center shrink-0">
          <BookOpen className="w-8 h-8 text-yellow-600" />
        </div>
        <div>
          <h3 className="text-2xl md:text-3xl font-bold text-ivory mb-2 font-heading">
            Download Our <span className="text-yellow-600">Product Catalogue</span>
          </h3>
          <p className="text-ivory/60 max-w-xl">
            Get the complete 2024 product catalogue with specifications, color options, 
            and technical details. Perfect for architects, designers, and dealers.
          </p>
        </div>
      </div>
      
      {/* CTA */}
      <div className="shrink-0">
        <Button variant="primary" size="lg" icon={Download} onClick={onDownload}>
          Download PDF
        </Button>
        <p className="text-ivory/40 text-xs mt-2 text-center">48 pages • 15 MB</p>
      </div>
    </div>
  </motion.div>
);

// Inline Download Button (for navbar/footer use)
export const InlineDownloadButton = ({ variant = 'default', onDownload }) => {
  if (variant === 'compact') {
    return (
      <button
        onClick={onDownload}
        className="inline-flex items-center gap-2 text-yellow-600 hover:text-yellow-500 transition-colors"
      >
        <Download className="w-4 h-4" />
        <span className="text-sm font-medium">Download Catalogue</span>
      </button>
    );
  }

  return (
    <Button variant="outline" size="sm" icon={Download} onClick={onDownload}>
      Catalogue
    </Button>
  );
};

// Full Catalogue Section
export const CatalogueDownload = ({
  catalogues = defaultCatalogues,
  title = 'Download Resources',
  subtitle = 'Access our product catalogues, technical documents, and design guides',
  showHeader = true,
  variant = 'grid', // 'grid' | 'cta' | 'inline'
  onDownload
}) => {
  const handleDownload = (catalogueId) => {
    if (onDownload) {
      onDownload(catalogueId);
    } else {
      // Default behavior - could link to actual PDFs
      console.log(`Downloading catalogue: ${catalogueId}`);
    }
  };

  // CTA variant - single prominent download
  if (variant === 'cta') {
    return <CatalogueDownloadCTA onDownload={() => handleDownload('main')} />;
  }

  // Inline variant - simple button
  if (variant === 'inline') {
    return <InlineDownloadButton onDownload={() => handleDownload('main')} />;
  }

  // Default grid variant
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-charcoal-light" />
      <div className="absolute inset-0 mesh-gradient opacity-10" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        {showHeader && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-50 border border-yellow-600/20 mb-6">
              <Download className="w-4 h-4 text-yellow-600" />
              <span className="text-yellow-600 text-sm font-medium">Free Download</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-ivory mb-4 font-heading">
              {title}
            </h2>
            
            <p className="text-ivory/60 max-w-2xl mx-auto">
              {subtitle}
            </p>
          </motion.div>
        )}
        
        {/* Catalogues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {catalogues.map((catalogue, index) => (
            <CatalogueCard
              key={catalogue.id}
              {...catalogue}
              delay={index * 0.1}
              onDownload={() => handleDownload(catalogue.id)}
            />
          ))}
        </div>
        
        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-12"
        >
          <a 
            href="/resources" 
            className="inline-flex items-center gap-2 text-yellow-600 hover:text-yellow-500 transition-colors group"
          >
            <span>View All Resources</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default CatalogueDownload;

