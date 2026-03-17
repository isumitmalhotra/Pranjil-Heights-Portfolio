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
    text: "Partnering with Pranij Heights has transformed our business. The product quality is exceptional, and the dealer support is outstanding. Our sales have grown 40% year-over-year.",
    stats: "8 Years Partnership | 500+ Projects"
  },
  {
    id: 2,
    name: "Arjun Reddy",
    role: "Regional Distributor",
    company: "SR Distributors, Hyderabad",
    avatar: "AR",
    rating: 5,
    text: "The comprehensive product range and competitive margins make Pranij Heights our preferred supplier. Their training programs have helped us expand our dealer network significantly.",
    stats: "12 Years Partnership | 50+ Sub-dealers"
  },
  {
    id: 3,
    name: "Pradeep Sharma",
    role: "Project Architect",
    company: "Sharma & Associates, Delhi",
    avatar: "PS",
    rating: 5,
    text: "We specify Pranij Heights panels for all our commercial projects. The consistency in quality, timely delivery, and technical support make them a reliable partner for large-scale installations.",
    stats: "Leading Architecture Firm | 200+ Commercial Projects"
  },
  {
    id: 4,
    name: "Sunita Patel",
    role: "Interior Contractor",
    company: "Elite Interiors, Bangalore",
    avatar: "SP",
    rating: 5,
    text: "The fire-retardant certification and waterproof properties are crucial for our hospitality clients. Pranij Heights' documentation and compliance support streamlines our project approvals.",
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
      <div className="absolute inset-0 bg-linear-to-br from-[#102746] via-[#1B2A4A] to-[#243B63]" />
      
      {/* Large Quote Mark */}
      <div className="absolute top-20 left-10 text-orange-400/10 text-[400px] font-serif leading-none pointer-events-none">
        "
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-300/16 border border-blue-200/30 mb-6">
            <Building2 className="w-4 h-4 text-orange-300" />
            <span className="text-orange-300 text-sm font-medium">Partner Testimonials</span>
          </div>
          
          <H2 className="mb-6 text-white">
            Trusted by <span className="text-orange-400">Industry Leaders</span>
          </H2>
          
          <p className="text-slate-200 text-lg">
            Hear from our valued dealers, distributors, and business partners 
            who have grown their businesses with Pranij Heights.
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
              className="p-8 md:p-12 rounded-2xl bg-blue-300/16 border border-blue-200/30 backdrop-blur-sm"
            >
              {/* Quote Icon */}
              <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center mb-6">
                <Quote className="w-6 h-6 text-orange-300" />
              </div>
              
              {/* Rating */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-orange-400 fill-orange-400" />
                ))}
              </div>
              
              {/* Quote Text */}
              <p className="text-xl md:text-2xl text-white leading-relaxed mb-8 font-light">
                "{testimonials[currentIndex].text}"
              </p>
              
              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-lg">
                  {testimonials[currentIndex].avatar}
                </div>
                <div>
                  <div className="text-white font-semibold text-lg">
                    {testimonials[currentIndex].name}
                  </div>
                  <div className="text-slate-200 text-sm">
                    {testimonials[currentIndex].role}
                    {testimonials[currentIndex].company && `, ${testimonials[currentIndex].company}`}
                  </div>
                  <div className="text-orange-300 text-sm mt-1">
                    {testimonials[currentIndex].stats}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Navigation */}
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={prevTestimonial}
                className="p-3 rounded-full bg-blue-300/16 border border-blue-200/30 text-white hover:bg-orange-500/20 hover:border-orange-400/40 transition-all"
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
                        ? 'w-8 bg-orange-500' 
                        : 'bg-white/25 hover:bg-white/40'
                    }`}
                  />
                ))}
              </div>
              
              <button
                onClick={nextTestimonial}
                className="p-3 rounded-full bg-blue-300/16 border border-blue-200/30 text-white hover:bg-orange-500/20 hover:border-orange-400/40 transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

