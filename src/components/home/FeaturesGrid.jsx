import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { 
  Droplets, Shield, Flame, Bug, Sparkles, Wrench,
  Clock, Leaf, ThermometerSun, Volume2
} from 'lucide-react';
import { H2 } from '../ui/Typography';

// Feature Item Component
const FeatureItem = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="group text-center"
  >
    <div className="relative mb-4">
      {/* Icon Container */}
      <div className="w-16 h-16 mx-auto rounded-2xl bg-white border border-black/5 flex items-center justify-center group-hover:border-gold/30 group-hover:bg-gold/5 transition-all duration-300">
        <Icon className="w-8 h-8 text-gold" />
      </div>
      
      {/* Glow Effect on Hover */}
      <div className="absolute inset-0 w-16 h-16 mx-auto rounded-2xl bg-gold/20 filter blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
    </div>
    
    <h3 className="text-gray-800 font-semibold mb-2 group-hover:text-gold transition-colors">
      {title}
    </h3>
    
    <p className="text-gray-500 text-sm leading-relaxed">
      {description}
    </p>
  </motion.div>
);

export const FeaturesGrid = () => {
  const features = [
    {
      icon: Droplets,
      title: "100% Waterproof",
      description: "Complete water resistance for bathrooms, kitchens & wet areas"
    },
    {
      icon: Bug,
      title: "Termite Proof",
      description: "No risk of termite or insect damage, unlike natural wood"
    },
    {
      icon: Flame,
      title: "Fire Retardant",
      description: "Self-extinguishing material for enhanced safety compliance"
    },
    {
      icon: Shield,
      title: "Scratch Resistant",
      description: "Durable surface coating that withstands daily wear"
    },
    {
      icon: Wrench,
      title: "Easy Installation",
      description: "Click-lock system enables quick DIY or professional fitting"
    },
    {
      icon: Clock,
      title: "25 Year Warranty",
      description: "Industry-leading warranty on all premium products"
    },
    {
      icon: Sparkles,
      title: "Low Maintenance",
      description: "Simple cleaning with damp cloth, no polishing needed"
    },
    {
      icon: Leaf,
      title: "Eco-Friendly",
      description: "Lead-free & recyclable material, safe for all environments"
    },
    {
      icon: ThermometerSun,
      title: "Thermal Insulation",
      description: "Maintains room temperature, reduces energy costs"
    },
    {
      icon: Volume2,
      title: "Acoustic Control",
      description: "Sound dampening properties for quieter interiors"
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gray-100" />
      
      {/* Decorative Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(201,169,98,0.5) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>
      
      {/* Gold Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-gold/5 rounded-full filter blur-[150px]" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 mb-6">
            <span className="text-gold text-sm font-medium">Why Choose PVCPro</span>
          </div>
          
          <H2 className="mb-6">
            Built for <span className="gradient-text">Performance</span> & <span className="gradient-text">Longevity</span>
          </H2>
          
          <p className="text-gray-600 text-lg">
            Our panels are engineered with advanced technology to deliver exceptional 
            durability, safety, and aesthetic appeal for decades.
          </p>
        </motion.div>
        
        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-10">
          {features.map((feature, index) => (
            <FeatureItem key={feature.title} {...feature} delay={index * 0.05} />
          ))}
        </div>
        
        {/* Bottom Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16 pt-12 border-t border-white/5"
        >
          <p className="text-gray-400 text-sm uppercase tracking-widest">
            All products tested & certified to international quality standards
          </p>
        </motion.div>
      </div>
    </section>
  );
};

