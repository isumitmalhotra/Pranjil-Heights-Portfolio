import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ChevronRight, ChevronDown, 
  Layers, Calculator, Phone, Home, LayoutGrid,
  Download, FileText, HelpCircle, Building2,
  Palette, Grid3X3, Mountain, Box, Users
} from 'lucide-react';
import { Button } from './ui/Button';
import { cn } from '../utils/cn';

// Animated Hamburger Menu Icon
const MenuIcon = ({ isOpen, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="relative w-8 h-8 flex items-center justify-center lg:hidden z-50"
      aria-label="Toggle menu"
    >
      <div className="relative w-5 h-4">
        <motion.span
          animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
          className="absolute top-0 left-0 w-full h-0.5 bg-slate-100 rounded-full origin-center"
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.span
          animate={isOpen ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }}
          className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 rounded-full -translate-y-1/2"
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.span
          animate={isOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
          className="absolute bottom-0 left-0 w-full h-0.5 bg-slate-100 rounded-full origin-center"
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </button>
  );
};

// Nav Link with Active Indicator
const NavLink = ({ to, children, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));

  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        "relative px-3 py-2 text-[13px] font-semibold transition-colors duration-300 flex items-center gap-1.5 group whitespace-nowrap",
        isActive ? "text-white" : "text-slate-200 hover:text-white"
      )}
    >
      <span className="relative whitespace-nowrap text-inherit">
        {children}
        {/* Hover underline effect */}
        <motion.span
          className="absolute -bottom-0.5 left-0 h-0.5 bg-orange-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: isActive ? '100%' : 0 }}
          whileHover={{ width: '100%' }}
          transition={{ duration: 0.3 }}
        />
      </span>
    </Link>
  );
};

// Dropdown Menu Component
const DropdownMenu = ({ label, items, isActive }) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 150);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div 
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={cn(
          "relative px-3 py-2 text-[13px] font-semibold transition-colors duration-300 flex items-center gap-1 group whitespace-nowrap",
          isActive ? "text-white" : "text-slate-200 hover:text-white"
        )}
      >
        <span className="relative whitespace-nowrap text-inherit">
          {label}
          <motion.span
            className="absolute -bottom-0.5 left-0 h-0.5 bg-orange-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: isActive ? '100%' : 0 }}
            whileHover={{ width: '100%' }}
            transition={{ duration: 0.3 }}
          />
        </span>
        <ChevronDown className={cn(
          "w-3 h-3 transition-transform duration-300",
          isOpen && "rotate-180"
        )} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-full left-0 pt-2 z-50"
          >
            <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden min-w-60">
              <div className="absolute top-0 left-4 right-4 h-px bg-yellow-600/20" />
              <div className="p-2">
                {items.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-yellow-50 transition-all duration-200 group"
                  >
                    {item.icon && (
                      <div className="w-8 h-8 rounded-lg bg-yellow-50 flex items-center justify-center group-hover:bg-yellow-100 transition-colors">
                        <item.icon className="w-4 h-4 text-yellow-600 group-hover:text-yellow-700" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="text-sm font-medium">{item.name}</div>
                      {item.description && (
                        <div className="text-xs text-gray-400">{item.description}</div>
                      )}
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-50 group-hover:translate-x-0 transition-all" />
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Mobile Accordion Menu Item
const MobileAccordion = ({ label, items, icon: Icon = Layers, onLinkClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();

  return (
    <div className="border-b border-blue-200/25 last:border-0">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-4 p-4 text-slate-100 hover:text-white transition-colors"
      >
        <div className="w-10 h-10 rounded-lg bg-blue-300/16 flex items-center justify-center">
          <Icon className="w-5 h-5 text-orange-400" />
        </div>
        <span className="flex-1 text-left text-lg font-medium">{label}</span>
        <ChevronDown className={cn(
          "w-5 h-5 transition-transform duration-300",
          isExpanded && "rotate-180"
        )} />
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden bg-blue-300/12"
          >
            <div className="py-2 px-4">
              {items.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onLinkClick}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                    location.pathname === item.path
                      ? "bg-orange-500/20 text-orange-300"
                      : "text-slate-200 hover:text-white hover:bg-blue-300/16"
                  )}
                >
                  {item.icon && <item.icon className="w-4 h-4" />}
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Logo Component
const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-2 group">
      <motion.img
        src="/logo.png"
        alt="Pranijheightsindia logo"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="h-8 w-auto object-contain drop-shadow-sm"
      />
      <div className="flex flex-col">
        <span className="text-sm font-bold text-white tracking-tight">
          Pranij Heights
        </span>
        <span className="text-[8px] text-slate-300 tracking-widest uppercase -mt-0.5">India</span>
      </div>
    </Link>
  );
};

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();

  // Product Range dropdown items
  const productItems = [
    { name: 'PVC Wall Panels', path: '/products?category=wall-panels', icon: Palette, description: 'Interior wall solutions' },
    { name: 'PVC Ceiling Panels', path: '/products?category=ceiling-panels', icon: Grid3X3, description: 'False ceiling options' },
    { name: '3D Designer Panels', path: '/products?category=3d-panels', icon: Box, description: 'Modern accent walls' },
    { name: 'Exterior Cladding', path: '/products?category=exterior', icon: Mountain, description: 'Weather-resistant' },
    { name: 'View All Products', path: '/products', icon: LayoutGrid, description: 'Browse full catalogue' },
  ];

  // Resources dropdown items
  const resourceItems = [
    { name: 'Download Catalogue', path: '/resources#catalogue', icon: Download, description: 'Product brochures' },
    { name: 'Material Calculator', path: '/resources#calculator', icon: Calculator, description: 'Estimate requirements' },
    { name: 'Technical Documents', path: '/resources#technical', icon: FileText, description: 'Specs & guides' },
    { name: 'FAQs', path: '/resources#faq', icon: HelpCircle, description: 'Common questions' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show/hide on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      
      setScrolled(currentScrollY > 50);
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Close mobile menu on location change
  const prevPathRef = useRef(location.pathname);
  useLayoutEffect(() => {
    if (prevPathRef.current !== location.pathname) {
      prevPathRef.current = location.pathname;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: close menu on navigation
      setIsOpen(false);
    }
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const closeMobileMenu = () => setIsOpen(false);

  const isProductsActive = location.pathname === '/products' || location.pathname.startsWith('/products');
  const isResourcesActive = location.pathname === '/resources';

  return (
    <>
      {/* Full Width Navbar */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: hidden ? -100 : 0, opacity: hidden ? 0 : 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <nav
          className={cn(
            "relative w-full transition-all duration-500 border-b",
            scrolled 
              ? "bg-[#1B2A4A]/95 backdrop-blur-xl shadow-xl shadow-[#1B2A4A]/35 border-slate-300/20" 
              : "bg-[#1B2A4A]/90 backdrop-blur-md shadow-lg shadow-[#1B2A4A]/25 border-slate-300/15"
          )}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between gap-6">
              {/* Logo */}
              <Logo />

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center gap-1">
                <NavLink to="/">Home</NavLink>
                <NavLink to="/about">About Us</NavLink>
                <DropdownMenu 
                  label="Product Range" 
                  items={productItems} 
                  isActive={isProductsActive}
                />
                <NavLink to="/dealer">Dealer Portal</NavLink>
                <DropdownMenu 
                  label="Resources" 
                  items={resourceItems}
                  isActive={isResourcesActive}
                />
                <NavLink to="/contact">Contact</NavLink>
              </div>

              {/* CTA & Mobile Menu */}
              <div className="flex items-center gap-3">
                <Link to="/contact" className="hidden lg:block">
                  <Button variant="premium" size="sm" icon={ChevronRight} className="rounded-lg text-xs px-4 py-2">
                    Get Quote
                  </Button>
                </Link>
                
                <MenuIcon isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
              </div>
            </div>
          </div>
        </nav>
      </motion.div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-[85%] max-w-sm z-50 lg:hidden overflow-y-auto"
            >
              {/* Mobile Menu Background */}
              <div className="absolute inset-0 bg-[#0F2A44]/98 backdrop-blur-2xl border-l border-blue-200/25 shadow-2xl" />
              
              {/* Content */}
              <div className="relative h-full flex flex-col p-6 pt-24">
                {/* Navigation Links */}
                <nav className="flex-1 space-y-1">
                  {/* Home */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 }}
                  >
                    <Link
                      to="/"
                      onClick={closeMobileMenu}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300",
                        location.pathname === '/'
                          ? "bg-orange-500/20 text-orange-300"
                          : "text-slate-200 hover:bg-blue-300/16 hover:text-white"
                      )}
                    >
                      <Home className="w-5 h-5" />
                      <span className="font-medium">Home</span>
                    </Link>
                  </motion.div>

                  {/* About Us */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Link
                      to="/about"
                      onClick={closeMobileMenu}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300",
                        location.pathname === '/about'
                          ? "bg-orange-500/20 text-orange-300"
                          : "text-slate-200 hover:bg-blue-300/16 hover:text-white"
                      )}
                    >
                      <Building2 className="w-5 h-5" />
                      <span className="font-medium">About Us</span>
                    </Link>
                  </motion.div>

                  {/* Product Range Accordion */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    <MobileAccordion 
                      label="Product Range" 
                      items={productItems}
                      icon={LayoutGrid}
                      isActive={isProductsActive}
                      onItemClick={closeMobileMenu}
                    />
                  </motion.div>

                  {/* Dealer Portal */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Link
                      to="/dealer"
                      onClick={closeMobileMenu}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300",
                        location.pathname === '/dealer'
                          ? "bg-orange-500/20 text-orange-300"
                          : "text-slate-200 hover:bg-blue-300/16 hover:text-white"
                      )}
                    >
                      <Users className="w-5 h-5" />
                      <span className="font-medium">Dealer Portal</span>
                    </Link>
                  </motion.div>

                  {/* Resources Accordion */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 }}
                  >
                    <MobileAccordion 
                      label="Resources" 
                      items={resourceItems}
                      icon={FileText}
                      isActive={isResourcesActive}
                      onItemClick={closeMobileMenu}
                    />
                  </motion.div>

                  {/* Contact */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Link
                      to="/contact"
                      onClick={closeMobileMenu}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300",
                        location.pathname === '/contact'
                          ? "bg-orange-500/20 text-orange-300"
                          : "text-slate-200 hover:bg-blue-300/16 hover:text-white"
                      )}
                    >
                      <Phone className="w-5 h-5" />
                      <span className="font-medium">Contact</span>
                    </Link>
                  </motion.div>
                </nav>

                {/* Bottom CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-4 pt-6 border-t border-blue-200/25 mt-6"
                >
                  <Link to="/contact" onClick={closeMobileMenu} className="block">
                    <Button variant="primary" size="lg" className="w-full" icon={ChevronRight}>
                      Get Free Quote
                    </Button>
                  </Link>
                  <Link to="/dealer" onClick={closeMobileMenu} className="block">
                    <Button variant="outline" size="lg" className="w-full" icon={Users}>
                      Become a Dealer
                    </Button>
                  </Link>
                  <p className="text-center text-sm text-gray-400">
                    Premium PVC Panels for Modern Interiors
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
