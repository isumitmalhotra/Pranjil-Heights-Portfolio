import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

export const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 overflow-x-hidden">
      <Navbar />
      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="grow"
      >
        {children || <Outlet />}
      </motion.main>
      <Footer />
    </div>
  );
};

