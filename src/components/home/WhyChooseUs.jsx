import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Shield, Award, Leaf, Zap, Clock, HeartHandshake, Sparkles } from 'lucide-react';
import { H2, Body, SectionBadge } from '../ui/Typography';
import { FeatureCard } from '../ui/GlassCard';

const features = [
  {
    icon: Shield,
    title: "25 Year Warranty",
    description: "Industry-leading warranty coverage ensuring your investment is protected for decades.",
    color: "teal"
  },
  {
    icon: Award,
    title: "ISO Certified",
    description: "Manufactured under strict ISO 9001:2015 quality management standards.",
    color: "gold"
  },
  {
    icon: Leaf,
    title: "100% Eco-Friendly",
    description: "Sustainable production with recyclable materials and zero harmful emissions.",
    color: "teal"
  },
  {
    icon: Zap,
    title: "Quick Installation",
    description: "Innovative interlocking system allows for rapid, hassle-free installation.",
    color: "gold"
  },
  {
    icon: Clock,
    title: "Fast Delivery",
    description: "Pan-India delivery within 7 days. Express shipping available for urgent projects.",
    color: "teal"
  },
  {
    icon: HeartHandshake,
    title: "Expert Support",
    description: "Dedicated design consultants to help you choose the perfect panels.",
    color: "gold"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export const WhyChooseUs = () => {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-linear-to-b from-charcoal via-charcoal-light to-charcoal" />
      
      {/* Decorative Elements */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/4 -right-64 w-125 h-125 border border-blue-200/20 rounded-full"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/3 -right-48 w-100 h-100 border border-teal/10 rounded-full"
      />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <SectionBadge className="mb-6">
            <Sparkles className="w-4 h-4" />
            Why Choose Us
          </SectionBadge>
          
          <H2 className="mb-6">
            Excellence in Every <span className="text-yellow-600">Detail</span>
          </H2>
          
          <Body className="text-gray-400" size="lg">
            We combine cutting-edge technology with decades of craftsmanship to deliver 
            PVC panels that exceed expectations.
          </Body>
        </div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                iconColor={feature.color}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-20 glass-card p-8 md:p-12"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "10K+", label: "Sqft Daily Production" },
              { value: "500+", label: "Premium Designs" },
              { value: "25+", label: "Years of Excellence" },
              { value: "50K+", label: "Happy Customers" },
            ].map((stat, index) => (
              <div key={index} className="space-y-2">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + index * 0.1, type: "spring", stiffness: 200 }}
                  className="text-4xl md:text-5xl font-bold text-yellow-600"
                >
                  {stat.value}
                </motion.div>
                <div className="text-sm text-gray-500 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

