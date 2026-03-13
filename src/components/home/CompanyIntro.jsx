import React, { useState, useEffect, useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, useInView } from 'framer-motion';
import { Building2, Users, MapPin, Calendar, ArrowRight } from 'lucide-react';
import { H2, Body } from '../ui/Typography';
import { Button } from '../ui/Button';
import { Link } from 'react-router-dom';

// Animated Counter Component
const AnimatedCounter = ({ value, suffix = '', duration = 2 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const numericValue = parseInt(value.toString().replace(/\D/g, ''));
  
  useEffect(() => {
    if (!isInView) return;
    
    let startTime;
    let animationFrame;
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      setCount(Math.floor(progress * numericValue));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [numericValue, duration, isInView]);
  
  return <span ref={ref}>{count}{suffix}</span>;
};

// Stat Card Component
const StatCard = ({ icon: Icon, value, suffix, label, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    className="relative group"
  >
    <div className="p-6 text-center rounded-2xl bg-blue-300/16 border border-blue-200/25 backdrop-blur-sm hover:border-orange-400/50 transition-all duration-300">
      {/* Icon */}
      <div className="w-14 h-14 rounded-xl bg-blue-300/16 flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-500/20 transition-colors">
        <Icon className="w-7 h-7 text-orange-400" />
      </div>
      
      {/* Value */}
      <div className="text-4xl md:text-5xl font-bold text-white mb-2">
        <AnimatedCounter value={value} suffix={suffix} />
      </div>
      
      {/* Label */}
      <div className="text-slate-300 text-sm uppercase tracking-wider">
        {label}
      </div>
    </div>
  </motion.div>
);

export const CompanyIntro = () => {
  const stats = [
    { icon: Calendar, value: 25, suffix: '+', label: 'Years Experience' },
    { icon: Users, value: 500, suffix: '+', label: 'Dealer Network' },
    { icon: MapPin, value: 28, suffix: '', label: 'States Covered' },
    { icon: Building2, value: 10000, suffix: '+', label: 'Projects Completed' },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-linear-to-br from-[#0F2A44] via-[#1B2A4A] to-[#243B63]" />
      <div className="absolute inset-0 mesh-gradient opacity-20" />
      
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400/15 rounded-full filter blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/15 rounded-full filter blur-[120px]" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            {/* Section Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-300/16 border border-blue-200/30">
              <span className="text-orange-300 text-sm font-medium">About PVCPro</span>
            </div>
            
            <H2 className="text-white">
              India's Trusted Name in{' '}
              <span className="text-orange-400">Premium PVC Solutions</span>
            </H2>
            
            <Body className="text-slate-200" size="lg">
              Since 1998, we have been at the forefront of revolutionizing interior spaces 
              across India. Our commitment to innovation, quality, and customer satisfaction 
              has made us the preferred choice for architects, builders, and interior designers.
            </Body>
            
            <Body className="text-slate-200">
              With state-of-the-art manufacturing facilities and a nationwide distribution network, 
              we deliver premium PVC wall and ceiling panels that combine aesthetic excellence 
              with unmatched durability. Our products are designed to meet the diverse needs of 
              commercial, residential, and industrial applications.
            </Body>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/about">
                <Button variant="outline" icon={ArrowRight} className="border-white text-white hover:bg-blue-300/16 hover:border-white">
                  Learn Our Story
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="premium">
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
          
          {/* Image/Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-4/3 rounded-2xl overflow-hidden">
              {/* Factory Image */}
              <img 
                src="https://images.unsplash.com/photo-1565793298595-6a879b1d9492?q=80&w=2071&auto=format&fit=crop"  // Modern factory interior 
                alt="Modern Manufacturing Facility"
                className="w-full h-full object-cover"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-[#0F2A44]/85 via-[#1B2A4A]/25 to-transparent" />
              
              {/* Floating Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-blue-300/16 border border-blue-200/30 backdrop-blur-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">State-of-the-Art Facility</div>
                    <div className="text-slate-200 text-sm">50,000 sq.ft. Manufacturing Plant</div>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Corner Decoration */}
            <div className="absolute -top-4 -right-4 w-24 h-24 border-t-2 border-r-2 border-orange-400/40 rounded-tr-3xl" />
            <div className="absolute -bottom-4 -left-4 w-24 h-24 border-b-2 border-l-2 border-blue-300/40 rounded-bl-3xl" />
          </motion.div>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard key={stat.label} {...stat} delay={index * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
};

