import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle, ChevronDown } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';

const FAQItem = ({ question, answer, index, isOpen, onClick }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group"
    >
      <div className={`border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300 ${
        isOpen ? 'bg-gray-50 border-yellow-500/30' : 'hover:border-gray-300'
      }`}>
        <button
          onClick={onClick}
          className="w-full p-6 flex items-center justify-between text-left focus:outline-none"
        >
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
              isOpen ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
            }`}>
              <HelpCircle className="w-5 h-5" />
            </div>
            <span className={`text-lg font-medium transition-colors ${
              isOpen ? 'text-gray-800' : 'text-gray-700 group-hover:text-gray-900'
            }`}>
              {question}
            </span>
          </div>
          
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
              isOpen ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-600'
            }`}
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </button>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 pl-20">
                <div className="h-px bg-gray-200 mb-4" />
                <p className="text-gray-600 leading-relaxed">
                  {answer}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);
  
  const faqs = [
    {
      question: "What is the lifespan of your PVC panels?",
      answer: "Our premium PVC panels are designed to last for over 20-25 years with minimal maintenance. They are resistant to moisture, termites, and fading, ensuring long-term durability. With proper care, many of our panels have been known to exceed this lifespan while maintaining their appearance."
    },
    {
      question: "Are the panels fire resistant?",
      answer: "Yes, all our panels are Class A fire-retardant. They are self-extinguishing and do not contribute to the spread of fire, making them safe for both residential and commercial applications. Our panels meet all relevant safety certifications and building codes."
    },
    {
      question: "Can I install these panels in bathrooms?",
      answer: "Absolutely. Our PVC panels are 100% waterproof and mold-resistant, making them an ideal choice for high-moisture areas like bathrooms, kitchens, and basements. They won't warp, swell, or deteriorate when exposed to water or humidity."
    },
    {
      question: "Do you offer installation services?",
      answer: "We have a network of certified installation partners across major cities. When you request a quote, you can opt for installation services, and we will connect you with a professional in your area. Our installers are trained and certified to ensure the best results."
    },
    {
      question: "What is the minimum order quantity?",
      answer: "For standard designs, we have no minimum order quantity — order as few or as many panels as you need. For custom designs or specific color matches, a minimum order of 1000 sqft applies to ensure cost-effectiveness."
    },
    {
      question: "Do you provide samples before purchase?",
      answer: "Yes! We offer sample kits that include texture samples, color swatches, and product brochures. You can request samples through our contact form, and we'll ship them to your address within 3-5 business days."
    },
    {
      question: "What's the warranty coverage?",
      answer: "All our products come with a comprehensive warranty: Premium panels have a 15-year warranty, Standard panels have a 10-year warranty. This covers manufacturing defects, color fading beyond normal wear, and structural integrity issues."
    }
  ];

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <FAQItem 
          key={index} 
          {...faq} 
          index={index}
          isOpen={openIndex === index}
          onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
        />
      ))}
    </div>
  );
};

