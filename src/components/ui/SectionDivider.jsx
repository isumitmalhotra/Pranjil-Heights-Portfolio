import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

// Simple line divider
export const SectionDivider = ({ className, variant = 'default' }) => {
  const variants = {
    default: 'section-divider',
    ornament: 'section-divider-ornament',
    wave: 'section-divider-wave',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className={cn(variants[variant], className)}
    >
      {variant === 'ornament' && (
        <div className="w-12 h-12 rounded-full border-2 border-yellow-600/30 flex items-center justify-center bg-white mx-4 z-10">
          <div className="w-3 h-3 rounded-full bg-yellow-600" />
        </div>
      )}
    </motion.div>
  );
};

// Diamond divider with blue accents
export const DiamondDivider = ({ className }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className={cn("flex items-center justify-center gap-4 py-6", className)}
  >
    <div className="flex-1 h-px bg-linear-to-r from-transparent to-gray-300" />
    <div className="flex items-center gap-2">
      <div className="w-1.5 h-1.5 rotate-45 bg-yellow-400" />
      <div className="w-2.5 h-2.5 rotate-45 bg-yellow-600 border border-yellow-500" />
      <div className="w-1.5 h-1.5 rotate-45 bg-yellow-400" />
    </div>
    <div className="flex-1 h-px bg-linear-to-l from-transparent to-gray-300" />
  </motion.div>
);

// Simple line divider for transitioning between sections
export const GradientDivider = ({ 
  className,
  flip = false 
}) => (
  <div className={cn("relative w-full py-4", flip && "rotate-180", className)}>
    <div className="h-px bg-gray-200" />
  </div>
);

// Minimal line with center accent
export const AccentDivider = ({ className }) => (
  <motion.div
    initial={{ scaleX: 0 }}
    whileInView={{ scaleX: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    className={cn("relative flex items-center justify-center py-8", className)}
  >
    <div className="absolute left-0 right-0 top-1/2 h-px bg-gray-200" />
    <div className="relative bg-white px-6 flex items-center gap-3">
      <div className="w-8 h-px bg-yellow-600" />
      <div className="w-2 h-2 rounded-full bg-yellow-600" />
      <div className="w-8 h-px bg-yellow-600" />
    </div>
  </motion.div>
);

export default SectionDivider;

