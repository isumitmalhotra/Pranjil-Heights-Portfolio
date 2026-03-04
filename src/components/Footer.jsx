import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  Facebook, Twitter, Instagram, Linkedin, Youtube,
  Mail, Phone, MapPin, Send, 
  Sparkles, Shield, Award, Clock,
  Download, Users, FileText, ChevronRight,
  Palette, Grid3X3, Mountain, Box, Calculator, Loader2
} from 'lucide-react';
import { Button } from './ui/Button';
import { newsletterAPI } from '../services/api';

// Logo Component
const Logo = () => (
  <Link to="/" className="flex items-center gap-3 group">
    <motion.div 
      whileHover={{ rotate: 180, scale: 1.1 }}
      transition={{ duration: 0.5 }}
      className="relative w-10 h-10"
    >
      <div className="absolute inset-0 rounded-xl bg-yellow-600 rotate-45" />
      <div className="absolute inset-2 rounded-lg bg-white rotate-45 flex items-center justify-center">
        <div className="w-3 h-3 bg-yellow-600 -rotate-45 rounded-sm" />
      </div>
    </motion.div>
    <div className="flex flex-col">
      <span className="text-xl font-bold text-gray-800">
        Pranjil<span className="text-yellow-600"> Heights</span>
      </span>
      <span className="text-[10px] text-gray-400 tracking-widest uppercase -mt-1">India</span>
    </div>
  </Link>
);

// Social Link Component
const SocialLink = ({ icon: Icon, href, label }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    whileHover={{ y: -3, scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    className="w-10 h-10 rounded-xl bg-gray-100 border border-black/10 flex items-center justify-center text-gray-500 hover:text-yellow-600 hover:border-yellow-600/30 hover:bg-yellow-50 transition-all duration-300"
    aria-label={label}
  >
    <Icon className="w-5 h-5" />
  </motion.a>
);

// Footer Link Component
const FooterLink = ({ to, children }) => (
  <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
    <Link 
      to={to} 
      className="text-gray-500 hover:text-gray-800 transition-colors flex items-center gap-2 group"
    >
      <span className="w-0 h-px bg-yellow-600 transition-all group-hover:w-4" />
      {children}
    </Link>
  </motion.li>
);

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    
    setIsSubscribing(true);
    try {
      await newsletterAPI.subscribe({ email });
      toast.success('Thank you for subscribing to our newsletter!');
      setEmail('');
    } catch (error) {
      toast.error(error.message || 'Failed to subscribe. Please try again.');
    } finally {
      setIsSubscribing(false);
    }
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Youtube, href: '#', label: 'YouTube' },
  ];

  return (
    <footer className="relative bg-gray-50 border-t border-black/5 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 mesh-gradient opacity-20" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-600/5 rounded-full filter blur-[100px]" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-600/5 rounded-full filter blur-[100px]" />
      
      {/* Newsletter Section */}
      <div className="border-b border-black/5">
        <div className="container mx-auto px-6 py-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center justify-between gap-8"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-yellow-50 flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-gray-800 font-semibold text-lg">Stay Updated</h3>
                <p className="text-gray-500 text-sm">Get the latest designs and offers in your inbox</p>
              </div>
            </div>
            
            <form onSubmit={handleSubscribe} className="flex gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-100 border border-black/10 rounded-xl pl-12 pr-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-yellow-600/50 transition-colors"
                  disabled={isSubscribing}
                />
              </div>
              <Button type="submit" variant="primary" icon={isSubscribing ? Loader2 : Send} disabled={isSubscribing}>
                {isSubscribing ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-3 space-y-6">
            <Logo />
            <p className="text-gray-500 leading-relaxed">
              India's leading manufacturer of premium PVC panels. Transforming interiors 
              with innovative designs since 1998.
            </p>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4">
              {[
                { icon: Shield, text: '25 Year Warranty' },
                { icon: Award, text: 'ISO Certified' },
                { icon: Clock, text: 'Fast Delivery' },
              ].map((badge, index) => (
                <div key={index} className="flex items-center gap-2 text-xs text-gray-500">
                  <badge.icon className="w-4 h-4 text-yellow-600" />
                  <span>{badge.text}</span>
                </div>
              ))}
            </div>
            
            {/* Social Links */}
            <div className="flex gap-3 pt-4">
              {socialLinks.map((social, index) => (
                <SocialLink key={index} {...social} />
              ))}
            </div>
          </div>

          {/* Product Range Links */}
          <div className="lg:col-span-2">
            <h4 className="text-gray-800 font-semibold mb-6 flex items-center gap-2">
              <span className="w-8 h-px bg-linear-to-r from-yellow-600 to-transparent" />
              Product Range
            </h4>
            <ul className="space-y-4">
              {[
                { icon: Palette, name: 'Wall Panels', path: '/products?category=wall' },
                { icon: Grid3X3, name: 'Ceiling Panels', path: '/products?category=ceiling' },
                { icon: Mountain, name: '3D Panels', path: '/products?category=3d' },
                { icon: Box, name: 'Exterior Panels', path: '/products?category=exterior' },
              ].map((item, index) => (
                <motion.li key={index} whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                  <Link 
                    to={item.path} 
                    className="text-gray-500 hover:text-gray-800 transition-colors flex items-center gap-3 group"
                  >
                    <item.icon className="w-4 h-4 text-yellow-600/70 group-hover:text-yellow-600 transition-colors" />
                    {item.name}
                  </Link>
                </motion.li>
              ))}
              <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                <Link 
                  to="/products" 
                  className="text-yellow-600 hover:text-yellow-500 transition-colors flex items-center gap-2 font-medium text-sm"
                >
                  View All Products
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </motion.li>
            </ul>
          </div>

          {/* Resources Links */}
          <div className="lg:col-span-2">
            <h4 className="text-gray-800 font-semibold mb-6 flex items-center gap-2">
              <span className="w-8 h-px bg-linear-to-r from-yellow-600 to-transparent" />
              Resources
            </h4>
            <ul className="space-y-4">
              <FooterLink to="/resources">Catalogue Download</FooterLink>
              <FooterLink to="/resources#calculator">Material Calculator</FooterLink>
              <FooterLink to="/resources">Technical Documents</FooterLink>
              <FooterLink to="/resources#faq">FAQs</FooterLink>
              <FooterLink to="/about">About Us</FooterLink>
            </ul>
          </div>

          {/* Dealer Section */}
          <div className="lg:col-span-2">
            <h4 className="text-gray-800 font-semibold mb-6 flex items-center gap-2">
              <span className="w-8 h-px bg-linear-to-r from-yellow-600 to-transparent" />
              For Dealers
            </h4>
            <ul className="space-y-4 mb-6">
              <FooterLink to="/dealer">Become a Dealer</FooterLink>
              <FooterLink to="/dealer">Dealer Benefits</FooterLink>
              <FooterLink to="/dealer">Dealer Login</FooterLink>
              <FooterLink to="/contact">Request Sample</FooterLink>
            </ul>
            {/* Dealer CTA */}
            <Link to="/dealer">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-yellow-50 border border-yellow-600/20 rounded-xl p-4 cursor-pointer hover:bg-yellow-100 transition-colors"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-5 h-5 text-yellow-600" />
                  <span className="text-gray-800 font-medium text-sm">Partner With Us</span>
                </div>
                <p className="text-gray-500 text-xs">Join 500+ dealers across India</p>
              </motion.div>
            </Link>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-3">
            <h4 className="text-gray-800 font-semibold mb-6 flex items-center gap-2">
              <span className="w-8 h-px bg-linear-to-r from-yellow-600 to-transparent" />
              Get in Touch
            </h4>
            <ul className="space-y-4 mb-6">
              <li>
                <a href="#" className="flex items-start gap-3 group">
                  <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-yellow-600 shrink-0 group-hover:bg-yellow-50 transition-colors">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-gray-800 text-sm font-medium">Head Office</p>
                    <p className="text-gray-500 text-xs">123 Business Park, Industrial Area,<br />New Delhi, India 110020</p>
                  </div>
                </a>
              </li>
              <li>
                <a href="tel:+919876543210" className="flex items-start gap-3 group">
                  <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-yellow-600 shrink-0 group-hover:bg-yellow-50 transition-colors">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-gray-800 text-sm font-medium">Call Us</p>
                    <p className="text-gray-500 text-xs">+91 98765 43210</p>
                  </div>
                </a>
              </li>
              <li>
                <a href="mailto:info@pvcpro.com" className="flex items-start gap-3 group">
                  <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-yellow-600 shrink-0 group-hover:bg-yellow-50 transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-gray-800 text-sm font-medium">Email Us</p>
                    <p className="text-gray-500 text-xs">info@pvcpro.com</p>
                  </div>
                </a>
              </li>
            </ul>
            
            {/* Catalogue Download CTA */}
            <Link to="/resources">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-yellow-50 border border-yellow-600/30 rounded-xl p-4 cursor-pointer hover:bg-yellow-100 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-yellow-600/20 flex items-center justify-center">
                    <Download className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium text-sm">Download Catalogue</p>
                    <p className="text-gray-500 text-xs">2024 Collection • PDF 15MB</p>
                  </div>
                </div>
              </motion.div>
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-black/5 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {currentYear} Pranjil Heights India. All rights reserved. Crafted with ❤️ in India.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-gray-800 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-gray-800 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-gray-800 transition-colors">Sitemap</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};


