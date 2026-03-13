import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Building2, Award } from 'lucide-react';
import { H2 } from '../ui/Typography';

// Client Logo Component - for marquee/carousel
const ClientLogo = ({ name }) => (
  <div className="shrink-0 group relative h-20 w-48 flex items-center justify-center px-6 py-4 bg-blue-300/16 rounded-xl border border-blue-200/25 hover:border-orange-400/40 hover:bg-blue-300/24 transition-all duration-300 mx-3">
    {/* Placeholder Logo - In production, replace with actual client logos */}
    <div className="text-slate-200 group-hover:text-white transition-colors font-semibold text-base tracking-wider whitespace-nowrap">
      {name}
    </div>
  </div>
);

// Animated Marquee Row
const MarqueeRow = ({ clients, direction = 'left', speed = 25 }) => {
  // Duplicate for seamless loop
  const duplicatedClients = [...clients, ...clients];
  
  return (
    <div className="relative overflow-hidden py-2">
      {/* Gradient masks for fade effect */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-[#1B2A4A] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-linear-to-l from-[#1B2A4A] to-transparent z-10 pointer-events-none" />
      
      <motion.div
        className="flex"
        animate={{
          x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%']
        }}
        transition={{
          x: {
            duration: speed,
            repeat: Infinity,
            ease: 'linear',
            repeatType: 'loop'
          }
        }}
      >
        {duplicatedClients.map((client, index) => (
          <ClientLogo key={`${client.name}-${index}`} name={client.name} />
        ))}
      </motion.div>
    </div>
  );
};

// Industry Tag Component
const IndustryTag = ({ name, icon: Icon }) => (
  <motion.span 
    whileHover={{ scale: 1.05 }}
    className="inline-flex items-center gap-2 px-4 py-2 text-sm text-slate-200 bg-blue-300/16 rounded-full border border-blue-200/25 hover:border-orange-400/40 hover:text-white transition-all cursor-default"
  >
    {Icon && <Icon className="w-4 h-4 text-orange-300" />}
    {name}
  </motion.span>
);

export const ClientLogos = () => {
  // Sample client names - replace with actual client data
  const clientsRow1 = [
    { name: "Lodha Group" },
    { name: "DLF Ltd" },
    { name: "Oberoi Realty" },
    { name: "Prestige Group" },
    { name: "L&T Construction" },
    { name: "Godrej Properties" }
  ];
  
  const clientsRow2 = [
    { name: "Shapoorji Pallonji" },
    { name: "Sobha Ltd" },
    { name: "Brigade Group" },
    { name: "Mahindra Lifespace" },
    { name: "Puravankara" },
    { name: "Sunteck Realty" }
  ];
  
  const industries = [
    "Real Estate",
    "Hospitality",
    "Healthcare",
    "Retail",
    "Corporate Offices",
    "Education",
    "Government Projects"
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-linear-to-br from-[#1B2A4A] via-[#243B63] to-[#1B2A4A]" />
      <div className="absolute inset-0 mesh-gradient opacity-20" />
      
      <div className="relative z-10">
        {/* Section Header */}
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-300/16 border border-blue-200/30 mb-6">
              <Award className="w-4 h-4 text-orange-300" />
              <span className="text-orange-300 text-sm font-medium">Trusted Partners</span>
            </div>
            
            <H2 className="mb-6 text-white">
              Partnering with{' '}
              <span className="text-orange-400">Industry Leaders</span>
            </H2>
            
            <p className="text-slate-200 text-lg">
              From leading real estate developers to renowned hospitality chains, 
              our products are trusted by India's most prestigious organizations.
            </p>
          </motion.div>
        </div>
        
        {/* Animated Logo Marquee - Row 1 */}
        <div className="mb-4">
          <MarqueeRow clients={clientsRow1} direction="left" speed={30} />
        </div>
        
        {/* Animated Logo Marquee - Row 2 (opposite direction) */}
        <div className="mb-16">
          <MarqueeRow clients={clientsRow2} direction="right" speed={35} />
        </div>
        
        {/* Industries Served */}
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h4 className="text-slate-300 text-sm uppercase tracking-wider mb-6 flex items-center justify-center gap-2">
              <Building2 className="w-4 h-4" />
              Industries We Serve
            </h4>
            <div className="flex flex-wrap justify-center gap-3">
              {industries.map((industry) => (
                <IndustryTag key={industry} name={industry} />
              ))}
            </div>
          </motion.div>
          
          {/* Trust Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <div className="inline-flex flex-wrap items-center justify-center gap-6 md:gap-8 px-8 py-6 bg-blue-300/16 rounded-2xl border border-blue-200/30">
              <div className="text-center px-4">
                <div className="text-3xl md:text-4xl font-bold text-orange-400 font-heading">500+</div>
                <div className="text-slate-300 text-sm">Corporate Clients</div>
              </div>
              <div className="hidden md:block w-px h-12 bg-white/20" />
              <div className="text-center px-4">
                <div className="text-3xl md:text-4xl font-bold text-orange-400 font-heading">10M+</div>
                <div className="text-slate-300 text-sm">Sq.Ft. Installed</div>
              </div>
              <div className="hidden md:block w-px h-12 bg-white/20" />
              <div className="text-center px-4">
                <div className="text-3xl md:text-4xl font-bold text-orange-400 font-heading">28</div>
                <div className="text-slate-300 text-sm">States Covered</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

