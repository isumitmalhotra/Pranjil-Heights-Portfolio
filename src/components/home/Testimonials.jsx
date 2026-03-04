import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight, Building2 } from 'lucide-react';
import { H2 } from '../ui/Typography';
import { useState } from 'react';
import { useTestimonials } from '../../hooks/useApi';

// Fallback static testimonials
const fallbackTestimonials = [
  {
    id: 1,
    name: "Vikram Mehta",
    role: "Authorized Dealer",
    company: "Mehta Interiors, Mumbai",
    avatar: "VM",
    rating: 5,
    text: "Partnering with PVCPro has transformed our business. The product quality is exceptional, and the dealer support is outstanding. Our sales have grown 40% year-over-year.",
    stats: "8 Years Partnership | 500+ Projects"
  },
  {
    id: 2,
    name: "Arjun Reddy",
    role: "Regional Distributor",
    company: "SR Distributors, Hyderabad",
    avatar: "AR",
    rating: 5,
    text: "The comprehensive product range and competitive margins make PVCPro our preferred supplier. Their training programs have helped us expand our dealer network significantly.",
    stats: "12 Years Partnership | 50+ Sub-dealers"
  },
  {
    id: 3,
    name: "Pradeep Sharma",
    role: "Project Architect",
    company: "Sharma & Associates, Delhi",
    avatar: "PS",
    rating: 5,
    text: "We specify PVCPro panels for all our commercial projects. The consistency in quality, timely delivery, and technical support make them a reliable partner for large-scale installations.",
    stats: "Leading Architecture Firm | 200+ Commercial Projects"
  },
  {
    id: 4,
    name: "Sunita Patel",
    role: "Interior Contractor",
    company: "Elite Interiors, Bangalore",
    avatar: "SP",
    rating: 5,
    text: "The fire-retardant certification and waterproof properties are crucial for our hospitality clients. PVCPro's documentation and compliance support streamlines our project approvals.",
    stats: "6 Years Partnership | Hotel & Hospital Specialist"
  }
];

export const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Fetch testimonials from API
  const { data: apiResponse } = useTestimonials();
  
  // Transform API testimonials to match component format
  const transformTestimonial = (t) => ({
    id: t.id,
    name: t.name,
    role: t.designation || 'Customer',
    company: t.company ? `${t.company}${t.location ? `, ${t.location}` : ''}` : '',
    avatar: t.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'CU',
    rating: t.rating || 5,
    text: t.content,
    stats: t.projectType ? `${t.projectType} Project` : ''
  });

  // Use API testimonials or fallback
  const testimonials = apiResponse?.data?.testimonials 
    ? apiResponse.data.testimonials.map(transformTestimonial)
    : fallbackTestimonials;

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gray-100" />
      
      {/* Large Quote Mark */}
      <div className="absolute top-20 left-10 text-yellow-600/5 text-[400px] font-serif leading-none pointer-events-none">
        "
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-50 border border-yellow-600/20 mb-6">
            <Building2 className="w-4 h-4 text-yellow-600" />
            <span className="text-yellow-600 text-sm font-medium">Partner Testimonials</span>
          </div>
          
          <H2 className="mb-6">
            Trusted by <span className="text-yellow-600">Industry Leaders</span>
          </H2>
          
          <p className="text-gray-600 text-lg">
            Hear from our valued dealers, distributors, and business partners 
            who have grown their businesses with PVCPro.
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Main Card */}
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card p-8 md:p-12"
            >
              {/* Quote Icon */}
              <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center mb-6">
                <Quote className="w-6 h-6 text-yellow-600" />
              </div>
              
              {/* Rating */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-600 fill-yellow-600" />
                ))}
              </div>
              
              {/* Quote Text */}
              <p className="text-xl md:text-2xl text-gray-800 leading-relaxed mb-8 font-light">
                "{testimonials[currentIndex].text}"
              </p>
              
              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-yellow-600 flex items-center justify-center text-white font-bold text-lg">
                  {testimonials[currentIndex].avatar}
                </div>
                <div>
                  <div className="text-gray-800 font-semibold text-lg">
                    {testimonials[currentIndex].name}
                  </div>
                  <div className="text-gray-500 text-sm">
                    {testimonials[currentIndex].role}
                    {testimonials[currentIndex].company && `, ${testimonials[currentIndex].company}`}
                  </div>
                  <div className="text-yellow-600 text-sm mt-1">
                    {testimonials[currentIndex].stats}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Navigation */}
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={prevTestimonial}
                className="p-3 rounded-full bg-gray-100 border border-black/5 text-gray-800 hover:bg-gold/10 hover:border-gold/30 transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              {/* Dots */}
              <div className="flex items-center gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex 
                        ? 'w-8 bg-yellow-600' 
                        : 'bg-white/20 hover:bg-white/40'
                    }`}
                  />
                ))}
              </div>
              
              <button
                onClick={nextTestimonial}
                className="p-3 rounded-full bg-gray-100 border border-black/5 text-gray-800 hover:bg-yellow-50 hover:border-yellow-600/30 transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>      </div>
    </section>
  );
};

