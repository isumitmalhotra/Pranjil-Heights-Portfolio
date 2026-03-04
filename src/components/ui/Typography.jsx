import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

// Animation variants for staggered text reveal
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.1,
    },
  },
};

const letterVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

// Animated Text - Character by character reveal
export const AnimatedText = ({ children, className, ...props }) => {
  const text = typeof children === 'string' ? children : '';
  
  return (
    <motion.span
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={cn("inline-block", className)}
      {...props}
    >
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          variants={letterVariants}
          className="inline-block"
          style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
};

export const H1 = ({ children, className, gradient = false, animated = false, ...props }) => {
  const baseClasses = cn(
    "text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] font-heading",
    gradient ? "text-yellow-600" : "text-gray-800",
    className
  );

  if (animated) {
    return (
      <h1 className={baseClasses} {...props}>
        <AnimatedText>{children}</AnimatedText>
      </h1>
    );
  }

  return (
    <motion.h1 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={baseClasses}
      {...props}
    >
      {children}
    </motion.h1>
  );
};

export const H2 = ({ children, className, gradient = false, ...props }) => {
  return (
    <motion.h2 
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      className={cn(
        "text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight font-heading",
        gradient ? "text-yellow-600" : "text-gray-800",
        className
      )}
      {...props}
    >
      {children}
    </motion.h2>
  );
};

export const H3 = ({ children, className, ...props }) => {
  return (
    <motion.h3 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      className={cn("text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight text-gray-800", className)}
      {...props}
    >
      {children}
    </motion.h3>
  );
};

export const H4 = ({ children, className, ...props }) => {
  return (
    <motion.h4 
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn("text-lg md:text-xl font-semibold text-gray-800", className)}
      {...props}
    >
      {children}
    </motion.h4>
  );
};

export const Body = ({ children, className, size = 'base', ...props }) => {
  const sizes = {
    sm: 'text-sm md:text-base',
    base: 'text-base md:text-lg',
    lg: 'text-lg md:text-xl',
  };

  return (
    <motion.p 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "text-gray-600 leading-relaxed",
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </motion.p>
  );
};

// Label/Caption
export const Label = ({ children, className, ...props }) => {
  return (
    <motion.span 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn(
        "text-xs md:text-sm font-medium uppercase tracking-widest text-yellow-600",
        className
      )}
      {...props}
    >
      {children}
    </motion.span>
  );
};

// Section Badge
export const SectionBadge = ({ children, className, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-full",
        "bg-yellow-50 border border-yellow-600/20",
        "text-yellow-600 text-sm font-medium tracking-wide",
        className
      )}
      {...props}
    >
      <span className="w-2 h-2 rounded-full bg-yellow-600 animate-pulse" />
      {children}
    </motion.div>
  );
};

// Gradient Divider
export const Divider = ({ className, gold = false, ...props }) => {
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "h-px",
        gold 
          ? "bg-linear-to-r from-transparent via-yellow-600/40 to-transparent"
          : "bg-linear-to-r from-transparent via-black/10 to-transparent",
        className
      )}
      {...props}
    />
  );
};


