import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, ZoomIn, Building2, Home, Hotel, Hospital, ShoppingBag, GraduationCap } from 'lucide-react';
import { H2 } from '../ui/Typography';

// Default application images data
const defaultApplications = [
  {
    id: 1,
    category: 'Residential',
    icon: Home,
    title: 'Modern Living Room',
    location: 'Mumbai Apartment',
    image: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=2070&auto=format&fit=crop',  // Modern living room with wall panels
    description: 'Wood-finish PVC wall panels creating a warm, contemporary interior'
  },
  {
    id: 2,
    category: 'Commercial',
    icon: Building2,
    title: 'Corporate Office',
    location: 'Bangalore Tech Park',
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=2069&auto=format&fit=crop',  // Modern office interior
    description: 'Premium PVC panels in executive meeting room'
  },
  {
    id: 3,
    category: 'Hospitality',
    icon: Hotel,
    title: 'Hotel Lobby',
    location: '5-Star Property, Delhi',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop',  // Luxury hotel interior
    description: 'Marble-finish PVC panels for luxury hospitality interiors'
  },
  {
    id: 4,
    category: 'Healthcare',
    icon: Hospital,
    title: 'Hospital Corridor',
    location: 'Multi-Specialty Hospital, Chennai',
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2068&auto=format&fit=crop',  // Clean hospital interior
    description: 'Hygienic, easy-to-clean PVC panels for healthcare facilities'
  },
  {
    id: 5,
    category: 'Retail',
    icon: ShoppingBag,
    title: 'Showroom Interior',
    location: 'Premium Retail Store, Pune',
    image: 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?q=80&w=2070&auto=format&fit=crop',  // Modern retail interior
    description: 'Designer 3D PVC panels for stunning retail environments'
  },
  {
    id: 6,
    category: 'Education',
    icon: GraduationCap,
    title: 'University Library',
    location: 'Education Campus, Hyderabad',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2086&auto=format&fit=crop',  // Modern library/education space
    description: 'Acoustic PVC ceiling panels for educational spaces'
  }
];

// Category filter buttons
const categories = ['All', 'Residential', 'Commercial', 'Hospitality', 'Healthcare', 'Retail', 'Education'];

// Gallery Image Card
const GalleryCard = ({ item, onClick, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="group cursor-pointer"
    onClick={onClick}
  >
    <div className="relative aspect-4/3 rounded-xl overflow-hidden">
      {/* Image */}
      <img
        src={item.image}
        alt={item.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-charcoal via-charcoal/30 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
      
      {/* Category Badge */}
      <div className="absolute top-4 left-4">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-600/90 rounded-full">
          <item.icon className="w-3.5 h-3.5 text-white" />
          <span className="text-xs font-medium text-white">{item.category}</span>
        </div>
      </div>
      
      {/* Zoom Icon */}
      <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <ZoomIn className="w-5 h-5 text-ivory" />
      </div>
      
      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h3 className="text-lg font-semibold text-ivory mb-1 group-hover:text-yellow-600 transition-colors">
          {item.title}
        </h3>
        <p className="text-ivory/60 text-sm">{item.location}</p>
      </div>
    </div>
  </motion.div>
);

// Lightbox Modal
const Lightbox = ({ item, onClose, onPrev, onNext, hasNext, hasPrev }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/95 backdrop-blur-xl p-4"
    onClick={onClose}
  >
    {/* Close Button */}
    <button
      onClick={onClose}
      className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-ivory hover:bg-white/20 transition-colors z-10"
    >
      <X className="w-6 h-6" />
    </button>
    
    {/* Navigation Arrows */}
    {hasPrev && (
      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-4 md:left-8 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-ivory hover:bg-yellow-600/20 hover:text-yellow-600 transition-colors z-10"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
    )}
    
    {hasNext && (
      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-4 md:right-8 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-ivory hover:bg-yellow-600/20 hover:text-yellow-600 transition-colors z-10"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    )}
    
    {/* Content */}
    <motion.div
      key={item.id}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="max-w-5xl w-full"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="relative aspect-video rounded-2xl overflow-hidden mb-6">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-600/10 rounded-full mb-4">
          <item.icon className="w-4 h-4 text-yellow-600" />
          <span className="text-yellow-600 text-sm font-medium">{item.category}</span>
        </div>
        
        <h3 className="text-2xl md:text-3xl font-bold text-ivory mb-2 font-heading">
          {item.title}
        </h3>
        <p className="text-ivory/60 mb-2">{item.location}</p>
        <p className="text-ivory/80 max-w-2xl mx-auto">{item.description}</p>
      </div>
    </motion.div>
  </motion.div>
);

// Main Application Gallery Component
export const ApplicationGallery = ({
  applications = defaultApplications,
  title = 'Applications Gallery',
  subtitle = 'Explore our PVC panel installations across various sectors',
  showFilters = true,
  columns = 3
}) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxItem, setLightboxItem] = useState(null);
  
  // Filter applications
  const filteredApps = activeCategory === 'All'
    ? applications
    : applications.filter(app => app.category === activeCategory);
  
  // Lightbox navigation
  const currentIndex = lightboxItem
    ? filteredApps.findIndex(app => app.id === lightboxItem.id)
    : -1;
  
  const goToNext = () => {
    if (currentIndex < filteredApps.length - 1) {
      setLightboxItem(filteredApps[currentIndex + 1]);
    }
  };
  
  const goToPrev = () => {
    if (currentIndex > 0) {
      setLightboxItem(filteredApps[currentIndex - 1]);
    }
  };

  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-charcoal" />
      <div className="absolute inset-0 mesh-gradient opacity-20" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-600/10 border border-yellow-600/20 mb-6">
            <Building2 className="w-4 h-4 text-yellow-600" />
            <span className="text-yellow-600 text-sm font-medium">Project Gallery</span>
          </div>
          
          <H2 className="mb-4">
            {title.split(' ').slice(0, -1).join(' ')}{' '}
            <span className="text-yellow-600">{title.split(' ').slice(-1)}</span>
          </H2>
          
          <p className="text-ivory/60 text-lg">
            {subtitle}
          </p>
        </motion.div>
        
        {/* Category Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-yellow-600 text-white'
                    : 'bg-white/5 text-ivory/70 hover:bg-white/10 hover:text-ivory border border-white/10'
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>
        )}
        
        {/* Gallery Grid */}
        <motion.div 
          layout
          className={`grid ${gridCols[columns]} gap-6`}
        >
          <AnimatePresence mode="popLayout">
            {filteredApps.map((item, index) => (
              <GalleryCard
                key={item.id}
                item={item}
                onClick={() => setLightboxItem(item)}
                delay={index * 0.1}
              />
            ))}
          </AnimatePresence>
        </motion.div>
        
        {/* Empty State */}
        {filteredApps.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-ivory/50 text-lg">No projects found in this category.</p>
          </motion.div>
        )}
      </div>
      
      {/* Lightbox */}
      <AnimatePresence>
        {lightboxItem && (
          <Lightbox
            item={lightboxItem}
            onClose={() => setLightboxItem(null)}
            onPrev={goToPrev}
            onNext={goToNext}
            hasPrev={currentIndex > 0}
            hasNext={currentIndex < filteredApps.length - 1}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default ApplicationGallery;

