import React, { useState, useEffect, useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, useInView } from 'framer-motion';

// Animated Counter Hook
const useCounter = (end, duration = 2000, startWhenInView = true, isInView = true) => {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || !startWhenInView) return;
    if (hasAnimated.current) return;
    
    hasAnimated.current = true;
    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function (ease out cubic)
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(end * easeOutCubic));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration, startWhenInView, isInView]);

  return count;
};

// Individual Stat Card Component
export const StatCard = ({ value, suffix = '', prefix = '', label, icon: Icon, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  
  // Parse numeric value (handle formats like "5000+", "2M", "2017")
  const numericValue = parseInt(value.toString().replace(/[^0-9]/g, ''), 10);
  const animatedValue = useCounter(numericValue, 2500, true, isInView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="relative group"
    >
      <div className="text-center p-6 md:p-8 bg-blue-300/12 rounded-2xl border border-blue-200/20 hover:border-yellow-600/20 hover:bg-blue-300/16 transition-all duration-500">
        {/* Icon */}
        {Icon && (
          <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-yellow-50 border border-yellow-600/20 flex items-center justify-center group-hover:bg-yellow-100 transition-colors">
            <Icon className="w-7 h-7 text-yellow-600" />
          </div>
        )}
        
        {/* Value */}
        <div className="text-4xl md:text-5xl font-bold text-ivory mb-2 font-heading">
          {prefix}
          <span className="text-yellow-600">{animatedValue}</span>
          <span className="text-yellow-600">{suffix}</span>
        </div>
        
        {/* Label */}
        <div className="text-ivory/60 text-sm md:text-base uppercase tracking-wider">
          {label}
        </div>
        
        {/* Subtle glow on hover */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at center, rgba(37,99,235,0.05) 0%, transparent 70%)',
          }}
        />
      </div>
    </motion.div>
  );
};

// Stats Section Component
export const StatCounter = ({ 
  stats = [], 
  title = '', 
  subtitle = '',
  variant = 'default', // 'default' | 'compact' | 'dark'
  columns = 4
}) => {
  const defaultStats = [
    { value: 2017, suffix: '', label: 'Manufacturing Since' },
    { value: 5000, suffix: '+', label: 'Active Dealers' },
    { value: 5000, suffix: '+', label: 'Projects Completed' },
    { value: 50, suffix: '+', label: 'Cities Covered' }
  ];

  const displayStats = stats.length > 0 ? stats : defaultStats;

  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-3',
    4: 'grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
    6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6'
  };

  // Compact variant - inline stats without cards
  if (variant === 'compact') {
    return (
      <div className={`grid ${gridCols[columns]} gap-8`}>
        {displayStats.map((stat, index) => (
          <CompactStat key={stat.label} {...stat} delay={index * 0.1} />
        ))}
      </div>
    );
  }

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-charcoal-dark" />
      <div className="absolute inset-0 mesh-gradient opacity-10" />
      
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-yellow-600/30 to-transparent" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        {(title || subtitle) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-ivory mb-4 font-heading">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-ivory/60 text-lg max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </motion.div>
        )}
        
        {/* Stats Grid */}
        <div className={`grid ${gridCols[columns]} gap-6`}>
          {displayStats.map((stat, index) => (
            <StatCard key={stat.label} {...stat} delay={index * 0.1} />
          ))}
        </div>
      </div>
      
      {/* Decorative bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-yellow-600/30 to-transparent" />
    </section>
  );
};

// Compact Stat Component (for inline use)
const CompactStat = ({ value, suffix = '', prefix = '', label, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const numericValue = parseInt(value.toString().replace(/[^0-9]/g, ''), 10);
  const animatedValue = useCounter(numericValue, 2000, true, isInView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="text-center"
    >
      <div className="text-3xl md:text-4xl font-bold text-ivory mb-1 font-heading">
        {prefix}{animatedValue}<span className="text-yellow-600">{suffix}</span>
      </div>
      <div className="text-ivory/50 text-sm uppercase tracking-wider">{label}</div>
    </motion.div>
  );
};

// Single Stat Component (for individual use)
export const SingleStat = ({ value, suffix, prefix, label, icon, className = '' }) => (
  <StatCard 
    value={value} 
    suffix={suffix} 
    prefix={prefix} 
    label={label} 
    icon={icon}
    className={className}
  />
);

export default StatCounter;

