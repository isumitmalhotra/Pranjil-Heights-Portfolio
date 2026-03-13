import React, { useEffect, useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

// Floating Orbs Background Component
export const FloatingOrbs = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Primary Blue Orb */}
      <motion.div
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -80, 50, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/4 left-1/4 w-125 h-125 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      
      {/* Secondary Orange Orb */}
      <motion.div
        animate={{
          x: [0, -80, 60, 0],
          y: [0, 60, -40, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-1/4 right-1/4 w-100 h-100 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(249,115,22,0.16) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      
      {/* Tertiary Blue Orb */}
      <motion.div
        animate={{
          x: [0, 50, -70, 0],
          y: [0, -50, 80, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/2 right-1/3 w-75 h-75 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(96,165,250,0.14) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
    </div>
  );
};

// Pre-computed particle data to avoid Math.random during render
const generateParticles = (count) => Array.from({ length: count }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  duration: Math.random() * 20 + 10,
  delay: Math.random() * 5,
}));

const DEFAULT_PARTICLES = generateParticles(50);

// Particle Field Component
export const ParticleField = ({ count = 50 }) => {
  // Use pre-generated particles for default count, otherwise this is a static component
  const particles = count === 50 ? DEFAULT_PARTICLES : generateParticles(count);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.6, 0],
            y: [0, -100],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "linear",
          }}
          className="absolute rounded-full bg-teal"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
        />
      ))}
    </div>
  );
};

// Animated Grid Lines
export const GridLines = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-[0.03]">
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(96,165,250,0.24) 1px, transparent 1px),
            linear-gradient(90deg, rgba(96,165,250,0.24) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
        }}
      />
      {/* Animated scan line */}
      <motion.div
        animate={{ y: ['0%', '100%'] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute left-0 right-0 h-px bg-linear-to-r from-transparent via-blue-400/50 to-transparent"
      />
    </div>
  );
};

// Noise Texture Overlay
export const NoiseOverlay = () => {
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-1 opacity-[0.015]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      }}
    />
  );
};

// Spotlight Effect (follows mouse)
export const SpotlightEffect = () => {
  const spotlightRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (spotlightRef.current) {
        spotlightRef.current.style.background = `radial-gradient(600px circle at ${e.clientX}px ${e.clientY}px, rgba(59,130,246,0.12), transparent 40%)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={spotlightRef}
      className="fixed inset-0 pointer-events-none z-2 transition-all duration-300"
    />
  );
};

// Combined Background Component
export const AnimatedBackground = ({ variant = 'default' }) => {
  return (
    <>
      <FloatingOrbs />
      {variant === 'particles' && <ParticleField />}
      <GridLines />
      <NoiseOverlay />
      <SpotlightEffect />
    </>
  );
};

export default AnimatedBackground;

