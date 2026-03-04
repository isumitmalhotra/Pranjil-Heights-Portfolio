import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export const GlassCard = ({ 
  children, 
  className, 
  hoverEffect = false,
  glowColor = 'gold',
  variant = 'default',
  noPadding = false,
  ...props 
}) => {
  const glowColors = {
    teal: 'group-hover:shadow-lg',
    gold: 'group-hover:shadow-lg',
    white: 'group-hover:shadow-lg',
    none: '',
  };

  // Clean white cards with subtle shadows - no blur effects
  const variants = {
    default: 'bg-white border border-gray-200 shadow-sm hover:shadow-md',
    solid: 'bg-white border border-gray-200 shadow-sm hover:shadow-md',
    gradient: 'bg-white border border-gray-200 shadow-sm hover:shadow-md',
    glow: 'bg-white border border-gray-200 shadow-sm hover:shadow-md ring-1 ring-yellow-500/10',
    premium: 'bg-white border border-gray-200 shadow-sm hover:shadow-lg border-l-4 border-l-yellow-600',
    dark: 'bg-gray-50 border border-gray-200 shadow-sm hover:shadow-md',
    outlined: 'bg-white border-2 border-gray-300 hover:border-yellow-500 shadow-sm hover:shadow-md',
  };

  return (
    <motion.div
      initial={hoverEffect ? { opacity: 0, y: 30 } : {}}
      whileInView={hoverEffect ? { opacity: 1, y: 0 } : {}}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={hoverEffect ? { 
        y: -8, 
        scale: 1.01,
        transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
      } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "group relative overflow-hidden rounded-2xl",
        !noPadding && "p-6",
        variants[variant],
        hoverEffect && `transition-shadow duration-500 hover:shadow-2xl ${glowColors[glowColor]}`,
        className
      )}
      {...props}
    >
      {/* Subtle hover state enhancement */}
      {hoverEffect && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-yellow-50/30" />
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-linear-to-t from-black/20 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
};

// Feature Card with Icon
export const FeatureCard = ({ 
  icon: IconComponent, 
  title, 
  description, 
  className,
  iconColor = 'gold',
  variant = 'default',
  ...props 
}) => {
  const iconColors = {
    teal: 'bg-gold/10 text-gold group-hover:bg-gold/20 group-hover:shadow-lg group-hover:shadow-gold/20',
    gold: 'bg-gold/10 text-gold group-hover:bg-gold/20 group-hover:shadow-lg group-hover:shadow-gold/20',
    white: 'bg-gray-100 text-gray-800 group-hover:bg-gray-200',
  };

  return (
    <GlassCard hoverEffect variant={variant} className={cn("text-center", className)} {...props}>
      <motion.div 
        className={cn(
          "w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all duration-300 border border-gold/10",
          iconColors[iconColor]
        )}
        whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
        transition={{ duration: 0.5 }}
      >
        <IconComponent className="w-8 h-8" />
      </motion.div>
      <h3 className="text-xl font-bold text-gray-800 mb-3 font-heading">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </GlassCard>
  );
};

// Stat Card with animated counter
export const StatCard = ({ value, label, icon: IconComponent, className, ...props }) => {
  return (
    <GlassCard hoverEffect className={cn("text-center py-8", className)} {...props}>
      {IconComponent && (
        <div className="w-12 h-12 rounded-xl bg-gold/10 text-gold flex items-center justify-center mx-auto mb-4 border border-gold/10 group-hover:bg-gold/20 transition-colors">
          <IconComponent className="w-6 h-6" />
        </div>
      )}
      <motion.div 
        className="text-4xl font-bold gradient-text mb-2 font-heading"
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {value}
      </motion.div>
      <div className="text-gray-500 text-sm uppercase tracking-wider">{label}</div>
    </GlassCard>
  );
};

// Product Card variant for B2B
export const ProductCard = ({ 
  image, 
  title, 
  features = [], 
  className, 
  onClick,
  badge,
  ...props 
}) => {
  return (
    <GlassCard 
      hoverEffect 
      noPadding 
      className={cn("cursor-pointer", className)} 
      onClick={onClick}
      {...props}
    >
      {/* Image */}
      <div className="relative aspect-4/3 overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
        
        {badge && (
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 text-xs font-medium bg-gold/90 text-white rounded-full">
              {badge}
            </span>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-3 group-hover:text-gold transition-colors font-heading">
          {title}
        </h3>
        
        {features.length > 0 && (
          <ul className="space-y-2">
            {features.slice(0, 4).map((feature, index) => (
              <li key={index} className="flex items-start gap-2 text-gray-500 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0 mt-1.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </GlassCard>
  );
};

// Info Card - for displaying key information
export const InfoCard = ({
  icon: IconComponent,
  title,
  value,
  description,
  className,
  ...props
}) => {
  return (
    <GlassCard hoverEffect variant="dark" className={cn("", className)} {...props}>
      <div className="flex items-start gap-4">
        {IconComponent && (
          <div className="w-12 h-12 rounded-xl bg-gold/10 text-gold flex items-center justify-center shrink-0 border border-gold/10">
            <IconComponent className="w-6 h-6" />
          </div>
        )}
        <div>
          <div className="text-gray-500 text-sm mb-1">{title}</div>
          <div className="text-xl font-bold text-gray-800 mb-1">{value}</div>
          {description && (
            <div className="text-gray-600 text-sm">{description}</div>
          )}
        </div>
      </div>
    </GlassCard>
  );
};

