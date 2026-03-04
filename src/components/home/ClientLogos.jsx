import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Building2, Award } from 'lucide-react';
import { H2 } from '../ui/Typography';

// Client Logo Component - for marquee/carousel
const ClientLogo = ({ name }) => (
  <div className="shrink-0 group relative h-20 w-48 flex items-center justify-center px-6 py-4 bg-white rounded-xl border border-black/5 hover:border-gold/20 hover:bg-gray-50 transition-all duration-300 mx-3">
    {/* Placeholder Logo - In production, replace with actual client logos */}
    <div className="text-gray-500 group-hover:text-gray-700 transition-colors font-semibold text-base tracking-wider whitespace-nowrap">
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
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-linear-to-l from-gray-50 to-transparent z-10 pointer-events-none" />
      
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
    className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-600 bg-white rounded-full border border-black/5 hover:border-gold/20 hover:text-gray-800 transition-all cursor-default"
  >
    {Icon && <Icon className="w-4 h-4 text-gold/60" />}
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
      <div className="absolute inset-0 bg-gray-50" />
      <div className="absolute inset-0 mesh-gradient opacity-10" />
      
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 mb-6">
              <Award className="w-4 h-4 text-gold" />
              <span className="text-gold text-sm font-medium">Trusted Partners</span>
            </div>
            
            <H2 className="mb-6">
              Partnering with{' '}
              <span className="gradient-text">Industry Leaders</span>
            </H2>
            
            <p className="text-gray-600 text-lg">
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
            <h4 className="text-gray-500 text-sm uppercase tracking-wider mb-6 flex items-center justify-center gap-2">
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
            <div className="inline-flex flex-wrap items-center justify-center gap-6 md:gap-8 px-8 py-6 bg-gold/5 rounded-2xl border border-gold/10">
              <div className="text-center px-4">
                <div className="text-3xl md:text-4xl font-bold gradient-text font-heading">500+</div>
                <div className="text-gray-500 text-sm">Corporate Clients</div>
              </div>
              <div className="hidden md:block w-px h-12 bg-gold/20" />
              <div className="text-center px-4">
                <div className="text-3xl md:text-4xl font-bold gradient-text font-heading">10M+</div>
                <div className="text-gray-500 text-sm">Sq.Ft. Installed</div>
              </div>
              <div className="hidden md:block w-px h-12 bg-gold/20" />
              <div className="text-center px-4">
                <div className="text-3xl md:text-4xl font-bold gradient-text font-heading">28</div>
                <div className="text-gray-500 text-sm">States Covered</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

