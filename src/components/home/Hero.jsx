import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { ChevronRight, Download, Building2, Award, Factory, Users, Sparkles, Shield, Droplets, Flame } from 'lucide-react';
import { Button } from '../ui/Button';
import { H1 } from '../ui/Typography';
import { Link } from 'react-router-dom';

// Trust Badge Component
const TrustBadge = ({ icon: Icon, label, value }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex items-center gap-3"
  >
    <div className="w-12 h-12 rounded-xl bg-blue-300/16 border border-blue-200/30 flex items-center justify-center">
      <Icon className="w-6 h-6 text-orange-400" />
    </div>
    <div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-slate-300 uppercase tracking-wider">{label}</div>
    </div>
  </motion.div>
);

// Feature Pill Component
const FeaturePill = ({ icon: Icon, text }) => (
  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-300/16 backdrop-blur-sm border border-blue-200/30 shadow-sm">
    <Icon className="w-4 h-4 text-orange-400" />
    <span className="text-sm font-medium text-slate-100">{text}</span>
  </div>
);

export const Hero = () => {
  const trustBadges = [
    { icon: Factory, label: "Manufacturing", value: "Since 2017" },
    { icon: Users, label: "Across India", value: "5000+" },
    { icon: Building2, label: "Projects", value: "10,000+" },
    { icon: Award, label: "Certified", value: "ISO 9001" },
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-linear-to-br from-[#0F2A44] via-[#1B2A4A] to-[#243B63]">
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Large gradient orbs */}
        <div className="absolute -top-40 -right-40 w-150 h-150 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-125 h-125 bg-[#1B2A4A]/40 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-100 h-100 bg-orange-500/20 rounded-full blur-3xl" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(to right, #60A5FA 1px, transparent 1px), linear-gradient(to bottom, #60A5FA 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
        
        {/* Diagonal accent lines */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 80px,
              #F97316 80px,
              #F97316 81px
            )`
          }} />
        </div>

        {/* Dark overlay to keep left content readable against decorative visuals */}
        <div className="absolute inset-0 bg-linear-to-r from-[#0F2A44]/90 via-[#1B2A4A]/70 to-transparent" />
        
        {/* 3D Floating PVC Panels - Right Side Hero Visual */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[55%] h-full hidden xl:flex items-center justify-center" style={{ perspective: '1200px' }}>
          
          {/* Large Hero Panel - Wood Grain */}
          <motion.div
            initial={{ opacity: 0, x: 150, rotateY: 25 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-16 top-[15%] w-80 h-105"
          >
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-full h-full rounded-3xl overflow-hidden"
              style={{ transform: 'rotateY(-12deg) rotateX(5deg)', transformStyle: 'preserve-3d' }}
            >
              {/* Panel Base with realistic wood texture */}
              <div className="absolute inset-0 bg-linear-to-br from-yellow-100 via-yellow-50 to-orange-100" />
              {/* Wood grain lines */}
              <div className="absolute inset-0" style={{
                backgroundImage: `
                  repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(180,83,9,0.04) 8px, rgba(180,83,9,0.04) 9px),
                  repeating-linear-gradient(90deg, transparent, transparent 23px, rgba(180,83,9,0.03) 23px, rgba(180,83,9,0.03) 24px),
                  linear-gradient(180deg, rgba(245,158,11,0.1) 0%, rgba(180,83,9,0.08) 50%, rgba(245,158,11,0.1) 100%)
                `
              }} />
              {/* Horizontal panel grooves */}
              <div className="absolute inset-0" style={{
                backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 80px, rgba(0,0,0,0.08) 80px, rgba(0,0,0,0.08) 82px)`
              }} />
              {/* Glass shine overlay */}
              <div className="absolute inset-0 bg-linear-to-br from-white/60 via-white/20 to-transparent" />
              {/* 3D edge effect - left */}
              <div className="absolute left-0 top-0 bottom-0 w-2 bg-linear-to-r from-black/10 to-transparent" />
              {/* Shadow depth */}
              <div className="absolute -inset-1 rounded-3xl shadow-2xl shadow-amber-900/30 -z-10" />
              {/* Label Card */}
              <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-blue-200/200">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  <span className="text-[10px] text-yellow-700 font-semibold uppercase tracking-wider">Premium Series</span>
                </div>
                <div className="text-lg font-bold text-gray-900">Walnut Wood</div>
                <div className="text-xs text-gray-500 mt-0.5">Natural grain finish</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Medium Panel - Light Oak Wood */}
          <motion.div
            initial={{ opacity: 0, x: 120, rotateY: 20 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-85 top-[25%] w-64 h-85"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="relative w-full h-full rounded-2xl overflow-hidden"
              style={{ transform: 'rotateY(-8deg) rotateX(3deg)', transformStyle: 'preserve-3d' }}
            >
              {/* Light wood base */}
              <div className="absolute inset-0 bg-linear-to-br from-yellow-200 via-yellow-100 to-yellow-100" />
              {/* Wood grain pattern */}
              <div className="absolute inset-0" style={{
                backgroundImage: `
                  repeating-linear-gradient(90deg, transparent, transparent 6px, rgba(180,83,9,0.08) 6px, rgba(180,83,9,0.08) 7px),
                  repeating-linear-gradient(90deg, transparent, transparent 18px, rgba(180,83,9,0.05) 18px, rgba(180,83,9,0.05) 19px),
                  linear-gradient(180deg, rgba(180,83,9,0.08) 0%, transparent 30%, rgba(180,83,9,0.1) 70%, transparent 100%)
                `
              }} />
              {/* Horizontal panel lines */}
              <div className="absolute inset-0" style={{
                backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(180,83,9,0.12) 60px, rgba(180,83,9,0.12) 62px)`
              }} />
              {/* Natural wood knots simulation */}
              <div className="absolute inset-0 opacity-15" style={{
                backgroundImage: `radial-gradient(ellipse 15px 25px at 30% 40%, rgba(180,83,9,0.4), transparent),
                                  radial-gradient(ellipse 10px 18px at 70% 70%, rgba(180,83,9,0.3), transparent)`
              }} />
              {/* Shine */}
              <div className="absolute inset-0 bg-linear-to-br from-white/50 via-white/20 to-transparent" />
              {/* Edge shadow */}
              <div className="absolute -inset-1 rounded-2xl shadow-xl shadow-yellow-400/30 -z-10" />
              {/* Label */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-xl p-3 shadow-lg border border-yellow-200">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  <span className="text-[10px] text-yellow-700 font-semibold uppercase tracking-wider">Classic Series</span>
                </div>
                <div className="text-base font-bold text-gray-900">Light Oak</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Small Panel - 3D Woven Cream */}
          <motion.div
            initial={{ opacity: 0, x: 100, rotateY: 15 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ delay: 0.7, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-8 bottom-[18%] w-56 h-72"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="relative w-full h-full rounded-2xl overflow-hidden"
              style={{ transform: 'rotateY(-6deg) rotateX(8deg)', transformStyle: 'preserve-3d' }}
            >
              {/* Cream/beige gradient base */}
              <div className="absolute inset-0 bg-linear-to-br from-yellow-50 via-orange-50 to-yellow-50" />
              {/* 3D Woven pattern */}
              <div className="absolute inset-0" style={{
                backgroundImage: `
                  linear-gradient(45deg, rgba(180,83,9,0.08) 25%, transparent 25%),
                  linear-gradient(-45deg, rgba(180,83,9,0.08) 25%, transparent 25%),
                  linear-gradient(45deg, transparent 75%, rgba(180,83,9,0.08) 75%),
                  linear-gradient(-45deg, transparent 75%, rgba(180,83,9,0.08) 75%)
                `,
                backgroundSize: '24px 24px',
                backgroundPosition: '0 0, 0 12px, 12px -12px, -12px 0px'
              }} />
              {/* Woven texture lines */}
              <div className="absolute inset-0 opacity-40" style={{
                backgroundImage: `
                  repeating-linear-gradient(60deg, transparent, transparent 15px, rgba(180,83,9,0.1) 15px, rgba(180,83,9,0.1) 16px),
                  repeating-linear-gradient(-60deg, transparent, transparent 15px, rgba(180,83,9,0.1) 15px, rgba(180,83,9,0.1) 16px)
                `
              }} />
              {/* Shine */}
              <div className="absolute inset-0 bg-linear-to-br from-white/60 via-white/20 to-yellow-100/30" />
              {/* Shadow */}
              <div className="absolute -inset-1 rounded-2xl shadow-xl shadow-yellow-300/30 -z-10" />
              {/* Label */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-xl p-3 border border-yellow-100 shadow-lg">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-yellow-400" />
                  <span className="text-[10px] text-yellow-700 font-semibold uppercase tracking-wider">Designer</span>
                </div>
                <div className="text-base font-bold text-gray-900">3D Woven</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Floating accent elements */}
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-[45%] top-[20%] w-4 h-4 rounded-full bg-yellow-300/40"
          />
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute right-[30%] bottom-[25%] w-3 h-3 rounded-full bg-yellow-400/50"
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-[55%] top-[60%] w-2 h-2 rounded-full bg-yellow-500"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 relative z-10 pt-32 pb-20">
        <div className="max-w-4xl">
          {/* Company Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-600 shadow-lg shadow-yellow-600/20 mb-8"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-white text-sm font-medium tracking-wide">
              India's Leading PVC Panel Manufacturer
            </span>
          </motion.div>
          
          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6 mb-8"
          >
            <H1 className="leading-tight text-white">
              India's Oldest & Most Trusted PVC Wall Panel Brand
            </H1>
            
            <p className="text-xl md:text-2xl text-slate-200 font-light max-w-2xl leading-relaxed">
              Delivering timeless designs, unmatched durability and premium wall solutions trusted by dealers across India.
            </p>
          </motion.div>

          {/* Key Value Proposition - Feature Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap gap-3 mb-10"
          >
            <FeaturePill icon={Droplets} text="Termite & Water Resistant" />
            <FeaturePill icon={Flame} text="Fire Retardant" />
            <FeaturePill icon={Shield} text="Easy Installation" />
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap gap-4 mb-16"
          >
            <Link to="/products">
              <Button variant="primary" size="lg" icon={ChevronRight} className="bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-500/30 border-0">
                Explore Product Range
              </Button>
            </Link>
            <Link to="/resources">
              <Button variant="secondary" size="lg" icon={Download} iconPosition="left" className="bg-blue-300/16 text-white hover:bg-blue-300/25 border border-white/25 shadow-lg shadow-black/20">
                Download Catalogue
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="secondary" size="lg" className="bg-[#0F2A44] text-white hover:bg-[#0b2238] border border-blue-200/30 shadow-lg shadow-black/30">
                Become a Dealer
              </Button>
            </Link>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-blue-200/30"
          >
            {trustBadges.map((badge, index) => (
              <motion.div
                key={badge.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
              >
                <TrustBadge {...badge} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

