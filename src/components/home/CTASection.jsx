import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { ChevronRight, ArrowRight, Phone, Download, FileText } from 'lucide-react';
import { H2 } from '../ui/Typography';
import { Button } from '../ui/Button';
import { Link } from 'react-router-dom';

export const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-linear-to-br from-yellow-50 via-gray-50 to-gray-100" />
      
      {/* Animated Background Elements */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-0 left-1/4 w-150 h-150 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(37,99,235,0.2) 0%, transparent 70%)',
          filter: 'blur(100px)',
        }}
      />
      
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        className="absolute bottom-0 right-1/4 w-125 h-125 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)',
          filter: 'blur(100px)',
        }}
      />
      
      {/* Decorative Lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-yellow-600/30 to-transparent" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <H2 className="mb-6 text-4xl md:text-5xl lg:text-6xl">
              Ready to Partner <br />
              <span className="text-yellow-600">With Us?</span>
            </H2>
            
            <p className="text-gray-600 mb-10 max-w-2xl mx-auto text-lg">
              Connect with our business development team to discuss dealership opportunities, 
              bulk orders, or project requirements.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="flex flex-col sm:flex-row justify-center gap-4 mb-12"
          >
            <Link to="/contact">
              <Button variant="primary" size="xl" icon={ChevronRight}>
                Request Quotation
              </Button>
            </Link>
            <a href="/catalogue.pdf" download>
              <Button variant="outline" size="xl" icon={Download} iconPosition="left">
                Download Catalogue
              </Button>
            </a>
            <a href="tel:+919876543210">
              <Button variant="glass" size="xl" icon={Phone} iconPosition="left">
                Call Now
              </Button>
            </a>
          </motion.div>

          {/* Quick Contact Options */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-8 text-sm text-gray-500"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>Business Hours: 9 AM - 6 PM IST</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>Technical specs available</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Pan-India delivery network</span>
            </div>
          </motion.div>
        </div>

        {/* Bottom Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            {
              title: "Become a Dealer",
              description: "Join India's fastest growing PVC panel network with exclusive territory rights",
              link: "/contact"
            },
            {
              title: "Project Consultation",
              description: "Our technical team will help specify the right products for your project",
              link: "/contact"
            },
            {
              title: "Bulk Order Enquiry",
              description: "Special pricing and dedicated support for large-scale orders",
              link: "/contact"
            }
          ].map((item, index) => (
            <Link key={index} to={item.link}>
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                className="glass-card p-6 group cursor-pointer hover:border-yellow-600/30 transition-all"
              >
                <h3 className="text-gray-800 font-semibold mb-2 group-hover:text-yellow-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm mb-4">{item.description}</p>
                <span className="text-yellow-600 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  Learn more <ArrowRight className="w-4 h-4" />
                </span>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

