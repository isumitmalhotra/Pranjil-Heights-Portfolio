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
      bg-[#1B2A4A] hover:bg-[#0F2A44]
      text-white font-semibold
      border border-[#1B2A4A]
      shadow-md shadow-[#1B2A4A]/25
      hover:shadow-lg hover:shadow-[#1B2A4A]/35
      transition-all duration-200
    `,
    secondary: `
      bg-blue-300/16 text-white
      border border-blue-200/30
      hover:bg-blue-300/24 hover:border-blue-200/40
      transition-all duration-200
    `,
    outline: `
      bg-transparent 
      border-2 border-blue-200/35 text-slate-100
      hover:bg-blue-300/16 hover:border-orange-400/50
      transition-all duration-200
    `,
    ghost: `
      bg-transparent text-slate-200
      hover:text-white hover:bg-blue-300/16
      transition-all duration-200
    `,
    glass: `
      bg-blue-300/16
      border border-blue-200/30
      text-white
      hover:bg-blue-300/24 hover:border-[#F97316]/40
      shadow-md shadow-black/20
      transition-all duration-200
    `,
    premium: `
      relative overflow-hidden
      bg-[#F97316] hover:bg-[#EA580C]
      text-white font-semibold
      border border-[#EA580C]
      shadow-lg shadow-[#F97316]/30
      hover:shadow-xl hover:shadow-[#F97316]/40
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
      bg-blue-300/12 text-white font-semibold
      border border-blue-200/30
      shadow-md shadow-black/20
      hover:border-[#F97316] hover:bg-blue-300/20
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
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal",
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
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/50",
        variant === 'ghost' && "bg-blue-300/12 hover:bg-blue-300/20 text-white/70 hover:text-white",
        variant === 'primary' && "bg-[#1B2A4A]/25 hover:bg-[#1B2A4A]/35 text-orange-300",
        sizes[size],
        className
      )}
      {...props}
    >
      <IconComponent className={iconSizes[size]} />
    </motion.button>
  );
};

