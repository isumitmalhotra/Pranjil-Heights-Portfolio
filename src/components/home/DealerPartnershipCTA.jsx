import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Users, TrendingUp, Package, HeadphonesIcon, Award, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { H2, Body } from '../ui/Typography';
import { Button } from '../ui/Button';

// Benefit Card
const BenefitCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className="flex items-start gap-4 group"
  >
    <div className="w-12 h-12 rounded-xl bg-blue-300/16 border border-blue-200/30 flex items-center justify-center shrink-0 group-hover:bg-orange-500/20 transition-colors">
      <Icon className="w-5 h-5 text-orange-300" />
    </div>
    <div>
      <h4 className="text-white font-semibold mb-1">{title}</h4>
      <p className="text-slate-200 text-sm leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

export const DealerPartnershipCTA = () => {
  const benefits = [
    {
      icon: TrendingUp,
      title: "Attractive Margins",
      description: "Industry-leading profit margins with performance-based incentives."
    },
    {
      icon: Package,
      title: "Complete Product Range",
      description: "Access to a wide range of premium designs across all PVC panel categories."
    },
    {
      icon: HeadphonesIcon,
      title: "Dedicated Support",
      description: "Personal account manager and technical support team."
    },
    {
      icon: Award,
      title: "Marketing Support",
      description: "Display stands, samples, catalogs, and co-branded materials."
    },
    {
      icon: MapPin,
      title: "Territory Rights",
      description: "Exclusive territory allocation based on business potential."
    },
    {
      icon: Users,
      title: "Training Programs",
      description: "Regular product training and sales skill development."
    },
  ];

  return (
    <section className="relative py-24 overflow-hidden bg-white">
      {/* Background */}
      <div className="absolute inset-0 bg-linear-to-br from-[#0F2A44] via-[#1B2A4A] to-[#243B63]" />
      
      {/* Subtle Blue Glow */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 rounded-full"
        style={{
            background: 'radial-gradient(circle, rgba(249, 115, 22, 0.18) 0%, transparent 60%)',
          filter: 'blur(100px)',
        }}
      />
      
      {/* Decorative Lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-orange-400/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-blue-300/30 to-transparent" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-300/16 border border-blue-200/30 mb-6"
              >
                <Users className="w-4 h-4 text-orange-300" />
                <span className="text-sm text-orange-300 font-medium">Partner With Us</span>
              </motion.div>
              
              <H2 className="mb-6 text-white">
                Become a
                <br />
                <span className="text-orange-400">Pranij Heights Dealer</span>
              </H2>
              
              <Body className="text-slate-200 text-lg leading-relaxed">
                Join India's fastest-growing PVC panel brand and unlock new business opportunities. 
                We're looking for committed partners across India to expand our dealer network.
              </Body>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link to="/contact?type=dealer">
                <Button variant="primary" size="lg" icon={ChevronRight}>
                  Apply for Dealership
                </Button>
              </Link>
              <Link to="/about#dealer-benefits">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-blue-300/16 hover:border-white">
                  Learn More
                </Button>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-8 pt-6 border-t border-blue-200/30">
              {[
                { value: "5000+", label: "Active Dealers" },
                { value: "28", label: "States" },
                { value: "15%+", label: "Avg. Growth" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold text-orange-400">{stat.value}</div>
                  <div className="text-slate-300 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Benefits Grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-blue-300/16 rounded-2xl p-8 border border-blue-200/30 backdrop-blur-sm"
          >
            <h3 className="text-white font-semibold text-lg mb-6">Dealer Benefits</h3>
            <div className="grid gap-6">
              {benefits.map((benefit, index) => (
                <BenefitCard
                  key={benefit.title}
                  {...benefit}
                  delay={0.1 + index * 0.05}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-16 p-8 bg-blue-300/16 rounded-2xl border border-blue-200/30 text-center"
        >
          <h3 className="text-xl font-semibold text-white mb-2">
            Ready to Partner with India's Leading PVC Brand?
          </h3>
          <p className="text-slate-200 mb-6">
            Contact our dealer development team today and start your journey with Pranij Heights India.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="tel:+919813027070" className="text-orange-300 font-semibold hover:underline">
              Call: +91 98130 27070
            </a>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <a href="mailto:contact@pranijheightsindia.com" className="text-orange-300 font-semibold hover:underline">
              Email: contact@pranijheightsindia.com
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

