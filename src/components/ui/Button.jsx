import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className, 
  icon: IconComponent,
  iconPosition = 'right',
  glow = false,
  ...props 
}) => {
  const variants = {
    primary: `
      relative overflow-hidden
      bg-yellow-600 hover:bg-yellow-700
      text-white font-semibold
      border border-yellow-600
      shadow-md shadow-yellow-600/20
      hover:shadow-lg hover:shadow-yellow-600/30
      transition-all duration-200
    `,
    secondary: `
      bg-gray-100 text-gray-800
      border border-gray-200
      hover:bg-gray-200 hover:border-gray-300
      transition-all duration-200
    `,
    outline: `
      bg-transparent 
      border-2 border-yellow-600 text-yellow-600
      hover:bg-yellow-50 hover:border-yellow-700
      transition-all duration-200
    `,
    ghost: `
      bg-transparent text-gray-600
      hover:text-gray-800 hover:bg-gray-100
      transition-all duration-200
    `,
    glass: `
      bg-white
      border border-gray-200
      text-gray-800
      hover:bg-gray-50 hover:border-yellow-300
      shadow-sm
      transition-all duration-200
    `,
    premium: `
      relative overflow-hidden
      bg-yellow-600 hover:bg-yellow-700
      text-white font-semibold
      border border-yellow-500
      shadow-lg shadow-yellow-600/30
      hover:shadow-xl hover:shadow-yellow-600/40
      transition-all duration-200
    `,
    danger: `
      bg-red-600 hover:bg-red-700
      text-white font-semibold
      border border-red-500
      shadow-md shadow-red-500/20
      hover:shadow-lg hover:shadow-red-500/30
      transition-all duration-200
    `,
    corporate: `
      relative overflow-hidden
      bg-white text-gray-800 font-semibold
      border border-gray-300
      shadow-sm
      hover:border-yellow-500 hover:bg-gray-50
      transition-all duration-200
    `
  };

  const sizes = {
    xs: "px-3 py-1.5 text-xs",
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "px-10 py-5 text-xl",
  };

  return (
    <motion.button
      whileHover={{ 
        scale: 1.02, 
        y: -2,
      }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-300",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-teal/50 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
        variants[variant],
        sizes[size],
        glow && "neon-glow",
        className
      )}
      {...props}
    >
      {/* Button Content */}
      <span className="relative z-10 flex items-center gap-2">
        {IconComponent && iconPosition === 'left' && <IconComponent className="w-5 h-5" />}
        {children}
        {IconComponent && iconPosition === 'right' && (
          <motion.span
            className="inline-block"
            initial={{ x: 0 }}
            whileHover={{ x: 3 }}
            transition={{ duration: 0.2 }}
          >
            <IconComponent className="w-5 h-5" />
          </motion.span>
        )}
      </span>
      
      {/* Shimmer Effect for Primary */}
      {variant === 'primary' && (
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ x: '-100%', opacity: 0 }}
          whileHover={{ x: '100%', opacity: 0.3 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
          }}
        />
      )}
    </motion.button>
  );
};

// Icon Button Variant
export const IconButton = ({ 
  icon: IconComponent, 
  size = 'md', 
  variant = 'ghost',
  className,
  ...props 
}) => {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "inline-flex items-center justify-center rounded-xl transition-all duration-300",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-teal/50",
        variant === 'ghost' && "bg-white/5 hover:bg-white/10 text-white/70 hover:text-white",
        variant === 'primary' && "bg-teal/20 hover:bg-teal/30 text-teal",
        sizes[size],
        className
      )}
      {...props}
    >
      <IconComponent className={iconSizes[size]} />
    </motion.button>
  );
};

