import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Send, User, Mail, Phone, Building, Package, MapPin, MessageSquare, Sparkles } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { products } from '../../data/products';

// Animated Input Field
const FormInput = ({ icon: Icon, label, required, ...props }) => (
  <div className="space-y-2">
    <label className="text-sm text-slate-300 flex items-center gap-2">
      {Icon && <Icon className="w-4 h-4 text-teal" />}
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    <div className="relative group">
      <input
        {...props}
        required={required}
        className="w-full bg-blue-400/10 border border-blue-200/25 rounded-xl px-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-teal/50 focus:ring-2 focus:ring-teal/20 transition-all"
      />
      <div className="absolute inset-0 rounded-xl bg-linear-to-r from-teal/20 to-gold/20 opacity-0 group-focus-within:opacity-100 -z-10 blur-xl transition-opacity" />
    </div>
  </div>
);

// Animated Textarea
const FormTextarea = ({ icon: Icon, label, ...props }) => (
  <div className="space-y-2">
    <label className="text-sm text-slate-300 flex items-center gap-2">
      {Icon && <Icon className="w-4 h-4 text-teal" />}
      {label}
    </label>
    <div className="relative group">
      <textarea
        {...props}
        className="w-full bg-blue-400/10 border border-blue-200/25 rounded-xl px-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-teal/50 focus:ring-2 focus:ring-teal/20 transition-all resize-none"
      />
      <div className="absolute inset-0 rounded-xl bg-linear-to-r from-teal/20 to-gold/20 opacity-0 group-focus-within:opacity-100 -z-10 blur-xl transition-opacity" />
    </div>
  </div>
);

// Radio Button
const RadioOption = ({ name, value, checked, onChange, label }) => (
  <label className="relative flex items-center gap-3 cursor-pointer group">
    <input
      type="radio"
      name={name}
      value={value}
      checked={checked}
      onChange={onChange}
      className="sr-only"
    />
    <div className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${
      checked ? 'border-teal bg-teal' : 'border-gray-400 group-hover:border-gray-600'
    }`}>
      {checked && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-2 h-2 rounded-full bg-blue-300/15"
        />
      )}
    </div>
    <span className={`transition-colors ${checked ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
      {label}
    </span>
  </label>
);

export const QuotationForm = ({ compact = false }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    products: [],
    quantity: '',
    location: '',
    message: '',
    contactMethod: 'email'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProductChange = (e) => {
    const options = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({ ...prev, products: options }));
  };

  if (isSubmitted) {
    return (
      <GlassCard className="h-full flex flex-col items-center justify-center text-center p-12">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="w-24 h-24 bg-linear-to-br from-teal to-teal/50 rounded-full flex items-center justify-center mb-8 shadow-lg shadow-teal/30"
        >
          <CheckCircle className="w-12 h-12 text-white" />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-3xl font-bold text-white mb-4">
            Request <span className="gradient-text">Received!</span>
          </h3>
          <p className="text-slate-300 mb-8 max-w-md">
            Thank you for your interest. Our team will review your requirements and get back to you within 24 hours.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" onClick={() => setIsSubmitted(false)}>
              Submit Another Request
            </Button>
            <a href="/products">
              <Button variant="glass">
                Browse Products
              </Button>
            </a>
          </div>
        </motion.div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-linear-to-br from-teal to-teal/50 flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white">Request a Quote</h3>
          <p className="text-slate-400 text-sm">Fill out the form and we'll get back to you</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className={`grid grid-cols-1 ${compact ? '' : 'md:grid-cols-2'} gap-6`}>
          <FormInput
            icon={User}
            label="Full Name"
            required
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
          />
          <FormInput
            icon={Mail}
            label="Email Address"
            required
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@company.com"
          />
        </div>

        <div className={`grid grid-cols-1 ${compact ? '' : 'md:grid-cols-2'} gap-6`}>
          <FormInput
            icon={Phone}
            label="Phone Number"
            required
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+91 98131 45740"
          />
          <FormInput
            icon={Building}
            label="Company Name"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Your Company Ltd."
          />
        </div>

        {!compact && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-slate-300 flex items-center gap-2">
                <Package className="w-4 h-4 text-teal" />
                Interested Products
              </label>
              <select
                multiple
                name="products"
                value={formData.products}
                onChange={handleProductChange}
                className="w-full bg-blue-400/10 border border-blue-200/25 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-teal/50 focus:ring-2 focus:ring-teal/20 transition-all h-32"
              >
                {products.map(p => (
                  <option key={p.id} value={p.name} className="bg-blue-300/15 py-2">{p.name}</option>
                ))}
              </select>
              <p className="text-xs text-slate-400">Hold Ctrl/Cmd to select multiple</p>
            </div>
            <div className="space-y-6">
              <FormInput
                label="Quantity Needed (Approx)"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="e.g. 5000 sqft"
              />
              <FormInput
                icon={MapPin}
                label="Project Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="City, State"
              />
            </div>
          </div>
        )}

        <FormTextarea
          icon={MessageSquare}
          label="Message / Requirements"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={4}
          placeholder="Tell us about your project requirements..."
        />

        {/* Contact Preference */}
        <div className="space-y-3">
          <label className="text-sm text-slate-300">Preferred Contact Method</label>
          <div className="flex gap-8">
            <RadioOption
              name="contactMethod"
              value="email"
              checked={formData.contactMethod === 'email'}
              onChange={handleChange}
              label="Email"
            />
            <RadioOption
              name="contactMethod"
              value="phone"
              checked={formData.contactMethod === 'phone'}
              onChange={handleChange}
              label="Phone"
            />
            <RadioOption
              name="contactMethod"
              value="whatsapp"
              checked={formData.contactMethod === 'whatsapp'}
              onChange={handleChange}
              label="WhatsApp"
            />
          </div>
        </div>

        <Button 
          variant="primary" 
          size="lg" 
          className="w-full justify-center" 
          icon={Send}
          glow
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
              />
              Submitting...
            </span>
          ) : (
            'Submit Request'
          )}
        </Button>

        <p className="text-center text-slate-400 text-xs">
          By submitting, you agree to our Privacy Policy and Terms of Service
        </p>
      </form>
    </GlassCard>
  );
};


