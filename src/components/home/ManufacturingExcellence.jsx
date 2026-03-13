import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Factory, Gauge, Award, Cog, CheckCircle } from 'lucide-react';
import { H2, Body } from '../ui/Typography';
import { Button } from '../ui/Button';
import { Link } from 'react-router-dom';

// Certification Badge Component
const CertBadge = ({ title, icon: Icon, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay }}
    className="flex items-center gap-3 px-4 py-3 bg-blue-300/16 rounded-xl border border-blue-200/25"
  >
    <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
      <Icon className="w-5 h-5 text-orange-300" />
    </div>
    <span className="text-white text-sm font-medium">{title}</span>
  </motion.div>
);

// Capacity Stat Component
const CapacityStat = ({ value, unit, label, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="text-center"
  >
    <div className="text-3xl md:text-4xl font-bold text-white mb-1">
      {value}<span className="text-orange-300 text-xl">{unit}</span>
    </div>
    <div className="text-slate-300 text-sm">{label}</div>
  </motion.div>
);

export const ManufacturingExcellence = () => {
  const certifications = [
    { title: "ISO 9001:2015", icon: Award },
    { title: "ISO 14001:2015", icon: CheckCircle },
    { title: "CE Certified", icon: CheckCircle },
    { title: "BIS Approved", icon: Award }
  ];
  
  const capacityStats = [
    { value: "50,000", unit: " sq.ft", label: "Manufacturing Area" },
    { value: "2M", unit: "+", label: "Panels/Month" },
    { value: "500", unit: "+", label: "SKUs Available" },
    { value: "24/7", unit: "", label: "Production Capacity" }
  ];
  
  const capabilities = [
    "Automated extrusion lines",
    "UV coating technology",
    "Digital printing facility",
    "Quality testing lab",
    "In-house R&D center",
    "Eco-friendly production"
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-linear-to-br from-[#0F2A44] via-[#1B2A4A] to-[#243B63]" />
      <div className="absolute inset-0 mesh-gradient opacity-20" />
      
      {/* Decorative Lines */}
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-orange-400/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-blue-300/30 to-transparent" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Main Image */}
            <div className="relative aspect-4/3 rounded-2xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1581093458791-9d15482442f6?q=80&w=2070&auto=format&fit=crop"  // Manufacturing production line 
                alt="Manufacturing Facility"
                className="w-full h-full object-cover"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-linear-to-tr from-[#0F2A44]/85 via-[#1B2A4A]/45 to-transparent" />
              
              {/* Factory Icon Badge */}
              <div className="absolute top-6 left-6">
                <div className="w-16 h-16 rounded-xl bg-orange-500/90 flex items-center justify-center">
                  <Factory className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
            
            {/* Capacity Stats Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="absolute -bottom-8 left-6 right-6 md:left-12 md:right-12"
            >
              <div className="p-6 rounded-2xl bg-blue-200/18 border border-blue-100/35 backdrop-blur-md shadow-lg shadow-[#061223]/35">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {capacityStats.map((stat, index) => (
                    <CapacityStat key={stat.label} {...stat} delay={0.4 + index * 0.1} />
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8 lg:pt-8"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-300/16 border border-blue-200/30">
              <Cog className="w-4 h-4 text-orange-300" />
              <span className="text-orange-300 text-sm font-medium">Manufacturing Excellence</span>
            </div>
            
            <H2 className="text-white">
              State-of-the-Art{' '}
              <span className="text-orange-400">Production Facility</span>
            </H2>
            
            <Body className="text-slate-200" size="lg">
              Our world-class manufacturing facility combines cutting-edge German technology 
              with stringent quality control to produce panels that meet international standards. 
              Every product undergoes rigorous testing before reaching our valued partners.
            </Body>
            
            {/* Capabilities Grid */}
            <div className="grid grid-cols-2 gap-3">
              {capabilities.map((capability, index) => (
                <motion.div
                  key={capability}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="flex items-center gap-2 text-slate-100"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                  <span className="text-sm">{capability}</span>
                </motion.div>
              ))}
            </div>
            
            {/* Certifications */}
            <div className="space-y-4">
              <h4 className="text-slate-300 text-sm uppercase tracking-wider">
                Quality Certifications
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {certifications.map((cert, index) => (
                  <CertBadge key={cert.title} {...cert} delay={0.4 + index * 0.1} />
                ))}
              </div>
            </div>
            
            {/* CTA */}
            <div className="pt-4">
              <Link to="/about">
                <Button variant="outline" className="border-white text-white hover:bg-blue-300/16 hover:border-white">
                  Learn About Our Process
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

