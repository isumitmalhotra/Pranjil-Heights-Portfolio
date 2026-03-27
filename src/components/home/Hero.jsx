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

const ProductSwatch = ({ title, subtitle, textureClass }) => (
  <div className="group rounded-xl border border-blue-200/25 bg-[#0F2A44]/55 p-2 transition-all hover:-translate-y-0.5 hover:border-orange-400/40">
    <div className={`relative h-28 rounded-lg overflow-hidden ${textureClass}`}>
      <div className="absolute inset-0 bg-black/15 group-hover:bg-black/5 transition-colors" />
      <div className="absolute top-2 left-2 rounded-full bg-[#0F2A44]/75 px-2 py-1 border border-white/20">
        <span className="text-[10px] uppercase tracking-wide text-slate-100 font-semibold">{subtitle}</span>
      </div>
    </div>
    <p className="text-sm font-semibold text-white mt-2 px-1">{title}</p>
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

        {/* Dark overlay to keep hero text readable */}
        <div className="absolute inset-0 bg-linear-to-r from-[#0F2A44]/90 via-[#1B2A4A]/80 to-[#1B2A4A]/70" />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 relative z-10 pt-32 pb-20">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
          <div className="xl:col-span-8">
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
              <span className="block">India's No.1 Manufacturer of PVC Wall Panels,</span>
              <span className="block">Fluted Panels & ACP/HPL Sheets</span>
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

          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="hidden xl:block xl:col-span-4 rounded-2xl border border-blue-200/30 bg-blue-300/10 backdrop-blur-md p-6 shadow-xl shadow-black/25"
          >
            <div className="mb-5">
              <p className="text-xs uppercase tracking-[0.18em] text-orange-300 font-semibold">Product Visual Stack</p>
              <h3 className="text-2xl font-bold text-white mt-2 leading-tight">Explore Core Panel Categories</h3>
              <p className="text-xs text-slate-300 mt-2">Premium finishes crafted for dealer display, residential interiors, and commercial projects.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <ProductSwatch
                title="PVC Wall Panel"
                subtitle="Matte Grain"
                textureClass="bg-linear-to-br from-stone-300 via-stone-400 to-slate-500"
              />
              <ProductSwatch
                title="Fluted Panel"
                subtitle="Vertical Groove"
                textureClass="bg-[repeating-linear-gradient(90deg,#6b4f3e_0_6px,#805f49_6px_12px)]"
              />
              <ProductSwatch
                title="ACP/HPL Sheet"
                subtitle="Metallic Finish"
                textureClass="bg-linear-to-br from-slate-200 via-slate-400 to-slate-700"
              />
              <ProductSwatch
                title="UV Marble Sheet"
                subtitle="High Gloss"
                textureClass="bg-[radial-gradient(circle_at_25%_25%,#f8fafc_0_20%,#cbd5e1_20_35%,#f8fafc_35_52%,#94a3b8_52_70%,#e2e8f0_70_100%)]"
              />
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
};

