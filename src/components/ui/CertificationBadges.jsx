import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Award, CheckCircle, Shield, BadgeCheck, Star, Leaf } from 'lucide-react';

// Default certification data
const defaultCertifications = [
  {
    id: 'iso9001',
    title: 'ISO 9001:2015',
    subtitle: 'Quality Management',
    icon: Award,
    color: 'gold'
  },
  {
    id: 'iso14001',
    title: 'ISO 14001:2015',
    subtitle: 'Environmental Management',
    icon: Leaf,
    color: 'green'
  },
  {
    id: 'ce',
    title: 'CE Certified',
    subtitle: 'European Standards',
    icon: CheckCircle,
    color: 'blue'
  },
  {
    id: 'bis',
    title: 'BIS Approved',
    subtitle: 'Bureau of Indian Standards',
    icon: Shield,
    color: 'gold'
  },
  {
    id: 'rohs',
    title: 'RoHS Compliant',
    subtitle: 'Lead Free Material',
    icon: BadgeCheck,
    color: 'green'
  },
  {
    id: 'fire',
    title: 'Fire Retardant',
    subtitle: 'Class B1 Rating',
    icon: Star,
    color: 'orange'
  }
];

// Single Badge Component
const CertBadge = ({ title, subtitle, icon: Icon, color = 'gold', delay = 0, variant = 'default' }) => {
  const colorClasses = {
    gold: 'bg-yellow-50 border-yellow-600/20 text-yellow-600 hover:bg-yellow-100',
    green: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20',
    blue: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20',
    orange: 'bg-orange-500/10 border-orange-500/20 text-orange-400 hover:bg-orange-500/20'
  };

  // Compact variant - smaller badges
  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay }}
        className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${colorClasses[color]} transition-all duration-300`}
      >
        <Icon className="w-4 h-4" />
        <span className="text-xs font-medium text-ivory">{title}</span>
      </motion.div>
    );
  }

  // Icon-only variant
  if (variant === 'icon-only') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay }}
        whileHover={{ scale: 1.1 }}
        className={`w-12 h-12 rounded-xl flex items-center justify-center border ${colorClasses[color]} transition-all duration-300 cursor-default`}
        title={title}
      >
        <Icon className="w-6 h-6" />
      </motion.div>
    );
  }

  // Default card variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={`group flex items-center gap-4 p-4 rounded-xl border bg-white/5 border-white/10 hover:border-yellow-600/20 hover:bg-white/10 transition-all duration-300`}
    >
      {/* Icon */}
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${colorClasses[color]} transition-all duration-300 shrink-0`}>
        <Icon className="w-6 h-6" />
      </div>
      
      {/* Text */}
      <div>
        <h4 className="text-ivory font-semibold text-sm md:text-base">{title}</h4>
        {subtitle && (
          <p className="text-ivory/50 text-xs md:text-sm">{subtitle}</p>
        )}
      </div>
    </motion.div>
  );
};

// Badge Strip - Horizontal scrolling badges
export const CertificationStrip = ({ certifications = defaultCertifications, variant = 'compact' }) => (
  <div className="flex flex-wrap justify-center gap-3 py-4">
    {certifications.map((cert, index) => (
      <CertBadge
        key={cert.id}
        {...cert}
        variant={variant}
        delay={index * 0.1}
      />
    ))}
  </div>
);

// Full Certification Section
export const CertificationBadges = ({
  certifications = defaultCertifications,
  title = 'Certifications & Compliance',
  subtitle = 'Our products meet international quality and safety standards',
  variant = 'default', // 'default' | 'compact' | 'icon-only' | 'grid'
  columns = 3,
  showHeader = true
}) => {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 lg:grid-cols-4',
    6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6'
  };

  // Icon-only grid variant
  if (variant === 'icon-only') {
    return (
      <div className="flex flex-wrap justify-center gap-4">
        {certifications.map((cert, index) => (
          <CertBadge
            key={cert.id}
            {...cert}
            variant="icon-only"
            delay={index * 0.1}
          />
        ))}
      </div>
    );
  }

  // Compact inline variant
  if (variant === 'compact') {
    return <CertificationStrip certifications={certifications} variant="compact" />;
  }

  // Full section variant
  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-charcoal" />
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
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-50 border border-yellow-600/20 mb-6">
              <Shield className="w-4 h-4 text-yellow-600" />
              <span className="text-yellow-600 text-sm font-medium">Quality Assured</span>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold text-ivory mb-4 font-heading">
              {title}
            </h2>
            
            <p className="text-ivory/60 max-w-2xl mx-auto">
              {subtitle}
            </p>
          </motion.div>
        )}
        
        {/* Certifications Grid */}
        <div className={`grid ${gridCols[columns]} gap-4`}>
          {certifications.map((cert, index) => (
            <CertBadge
              key={cert.id}
              {...cert}
              variant={variant}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// Export individual components for flexibility
export { CertBadge };
export default CertificationBadges;

