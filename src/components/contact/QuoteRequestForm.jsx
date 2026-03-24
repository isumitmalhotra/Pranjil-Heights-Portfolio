import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Send, User, Mail, Phone, Building2, Package, FileText, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { quoteAPI } from '../../services/api';

// Input Field Component
const FormField = ({ label, id, type = 'text', icon: Icon, placeholder, required, value, onChange, error }) => (
  <div className="space-y-2">
    <label htmlFor={id} className="block text-sm font-medium text-ivory/80">
      {label} {required && <span className="text-gold">*</span>}
    </label>
    <div className="relative">
      {Icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-ivory/40">
          <Icon className="w-5 h-5" />
        </div>
      )}
      <input
        type={type}
        id={id}
        name={id}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChange}
        className={`w-full ${Icon ? 'pl-12' : 'pl-4'} pr-4 py-3.5 bg-blue-300/15 border ${
          error ? 'border-red-500' : 'border-blue-200/25 focus:border-gold/50'
        } rounded-xl text-ivory placeholder:text-ivory/30 focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all`}
      />
    </div>
    {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
  </div>
);

// Select Field Component
const SelectField = ({ label, id, icon: Icon, options, required, value, onChange }) => (
  <div className="space-y-2">
    <label htmlFor={id} className="block text-sm font-medium text-ivory/80">
      {label} {required && <span className="text-gold">*</span>}
    </label>
    <div className="relative">
      {Icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-ivory/40 pointer-events-none">
          <Icon className="w-5 h-5" />
        </div>
      )}
      <select
        id={id}
        name={id}
        required={required}
        value={value}
        onChange={onChange}
        className={`w-full ${Icon ? 'pl-12' : 'pl-4'} pr-4 py-3.5 bg-blue-300/15 border border-blue-200/25 rounded-xl text-ivory focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all appearance-none cursor-pointer`}
      >
        <option value="" className="bg-charcoal">Select an option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-charcoal">
            {option.label}
          </option>
        ))}
      </select>
      {/* Dropdown Arrow */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg className="w-4 h-4 text-ivory/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  </div>
);

// Textarea Component
const TextareaField = ({ label, id, icon: Icon, placeholder, required, rows = 4, value, onChange }) => (
  <div className="space-y-2">
    <label htmlFor={id} className="block text-sm font-medium text-ivory/80">
      {label} {required && <span className="text-gold">*</span>}
    </label>
    <div className="relative">
      {Icon && (
        <div className="absolute left-4 top-4 text-ivory/40">
          <Icon className="w-5 h-5" />
        </div>
      )}
      <textarea
        id={id}
        name={id}
        placeholder={placeholder}
        required={required}
        rows={rows}
        value={value}
        onChange={onChange}
        className={`w-full ${Icon ? 'pl-12' : 'pl-4'} pr-4 py-3.5 bg-blue-300/15 border border-blue-200/25 rounded-xl text-ivory placeholder:text-ivory/30 focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all resize-none`}
      />
    </div>
  </div>
);

// Product categories for dropdown
const productCategories = [
  { value: 'wall-panels', label: 'PVC Wall Panels' },
  { value: 'ceiling-panels', label: 'PVC Ceiling Panels' },
  { value: '3d-panels', label: '3D Designer Panels' },
  { value: 'wood-series', label: 'Wood Finish Series' },
  { value: 'marble-series', label: 'Marble Finish Series' },
  { value: 'exterior', label: 'Exterior Cladding' },
  { value: 'multiple', label: 'Multiple Categories' },
  { value: 'other', label: 'Other / Custom' }
];

// Quantity ranges
const quantityRanges = [
  { value: '50-200', label: '50 - 200 sq.ft' },
  { value: '200-500', label: '200 - 500 sq.ft' },
  { value: '500-1000', label: '500 - 1,000 sq.ft' },
  { value: '1000-5000', label: '1,000 - 5,000 sq.ft' },
  { value: '5000+', label: '5,000+ sq.ft' },
  { value: 'bulk', label: 'Bulk Order (Project)' }
];

// Business types
const businessTypes = [
  { value: 'contractor', label: 'Interior Contractor' },
  { value: 'architect', label: 'Architect / Designer' },
  { value: 'dealer', label: 'Dealer / Retailer' },
  { value: 'distributor', label: 'Distributor' },
  { value: 'builder', label: 'Builder / Developer' },
  { value: 'end-user', label: 'End User / Company' },
  { value: 'other', label: 'Other' }
];

// Main Quote Request Form Component
export const QuoteRequestForm = ({
  title = 'Request a Quotation',
  subtitle = 'Fill in your requirements and our team will provide a detailed quote within 24 hours',
  variant = 'default', // 'default' | 'compact' | 'modal'
  onSubmit,
  showTitle = true
}) => {
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    businessType: '',
    productCategory: '',
    quantity: '',
    requirements: ''
  });

  // Pre-fill form from URL parameters (coming from product page)
  useEffect(() => {
    const productName = searchParams.get('product');
    const categoryName = searchParams.get('category');
    
    if (productName || categoryName) {
      setFormData(prev => ({
        ...prev,
        requirements: productName 
          ? `I'm interested in: ${productName}${categoryName ? ` (${categoryName})` : ''}\n\nPlease provide a quote for this product.`
          : prev.requirements
      }));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Submit to backend API
      const response = await quoteAPI.submit({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        projectType: formData.businessType || 'General',
        projectDetails: formData.requirements,
        estimatedArea: formData.quantity?.split('-')[0] || '',
        areaUnit: 'sq ft',
        preferredProducts: formData.productCategory ? [formData.productCategory] : []
      });
      
      // Call optional onSubmit callback
      if (onSubmit) {
        await onSubmit(formData);
      }
      
      toast.success(`Quote request submitted! Reference: ${response.data.referenceNumber}`);
      setIsSubmitted(true);
      
      // Reset after showing success
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          businessType: '',
          productCategory: '',
          quantity: '',
          requirements: ''
        });
      }, 3000);
    } catch (error) {
      toast.error(error.message || 'Failed to submit quote request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success State
  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/10 flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-green-400" />
        </div>
        <h3 className="text-2xl font-bold text-ivory mb-3 font-heading">Quote Request Received!</h3>
        <p className="text-ivory/60 max-w-md mx-auto">
          Thank you for your enquiry. Our sales team will review your requirements and 
          respond with a detailed quotation within 24 hours.
        </p>
      </motion.div>
    );
  }

  // Compact variant - inline horizontal form
  if (variant === 'compact') {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <FormField
            id="name"
            placeholder="Your Name"
            required
            value={formData.name}
            onChange={handleChange}
          />
          <FormField
            id="email"
            type="email"
            placeholder="Email Address"
            required
            value={formData.email}
            onChange={handleChange}
          />
          <FormField
            id="phone"
            type="tel"
            placeholder="Phone Number"
            required
            value={formData.phone}
            onChange={handleChange}
          />
          <Button type="submit" variant="primary" icon={Send} disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Get Quote'}
          </Button>
        </div>
      </form>
    );
  }

  // Default full form
  return (
    <div className={variant === 'modal' ? '' : 'glass-card p-8 md:p-10'}>
      {/* Header */}
      {showTitle && (
        <div className="mb-8">
          <h3 className="text-2xl md:text-3xl font-bold text-ivory mb-3 font-heading">
            {title}
          </h3>
          <p className="text-ivory/60">
            {subtitle}
          </p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Full Name"
            id="name"
            icon={User}
            placeholder="John Doe"
            required
            value={formData.name}
            onChange={handleChange}
          />
          <FormField
            label="Email Address"
            id="email"
            type="email"
            icon={Mail}
            placeholder="john@company.com"
            required
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Phone Number"
            id="phone"
            type="tel"
            icon={Phone}
            placeholder="+91 98131 45740"
            required
            value={formData.phone}
            onChange={handleChange}
          />
          <FormField
            label="Company Name"
            id="company"
            icon={Building2}
            placeholder="ABC Interiors Pvt Ltd"
            value={formData.company}
            onChange={handleChange}
          />
        </div>
        
        {/* Business Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectField
            label="Business Type"
            id="businessType"
            icon={Building2}
            options={businessTypes}
            value={formData.businessType}
            onChange={handleChange}
          />
          <SelectField
            label="Product Category"
            id="productCategory"
            icon={Package}
            options={productCategories}
            required
            value={formData.productCategory}
            onChange={handleChange}
          />
        </div>
        
        <SelectField
          label="Estimated Quantity"
          id="quantity"
          icon={Package}
          options={quantityRanges}
          required
          value={formData.quantity}
          onChange={handleChange}
        />
        
        <TextareaField
          label="Project Requirements"
          id="requirements"
          icon={FileText}
          placeholder="Please describe your project requirements, preferred finishes, delivery timeline, or any specific questions..."
          rows={4}
          value={formData.requirements}
          onChange={handleChange}
        />
        
        {/* Submit Button */}
        <div className="pt-4">
          <Button 
            type="submit" 
            variant="primary" 
            size="lg"
            icon={isSubmitting ? Loader2 : Send}
            className="w-full md:w-auto"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Request Quotation'}
          </Button>
          
          <p className="text-ivory/40 text-sm mt-4">
            By submitting this form, you agree to our privacy policy. 
            We'll respond within 24 business hours.
          </p>
        </div>
      </form>
    </div>
  );
};

export default QuoteRequestForm;


