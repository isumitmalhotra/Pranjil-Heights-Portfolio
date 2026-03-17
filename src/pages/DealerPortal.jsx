import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  Building, Users, TrendingUp, Award, CheckCircle, ArrowRight, 
  Mail, Phone, MapPin, Briefcase, Shield, Truck, Percent,
  HeadphonesIcon, Package, FileText, Globe, Star, Loader2
} from 'lucide-react';
import { H1, H2, H3, Body, SectionBadge } from '../components/ui/Typography';
import { GlassCard } from '../components/ui/GlassCard';
import { AnimatedBackground, SpotlightEffect } from '../components/ui/AnimatedBackground';
import { Button } from '../components/ui/Button';
import { dealerAPI } from '../services/api';

// Partnership Benefit Card
const BenefitCard = ({ icon: IconComponent, title, description }) => (
  <motion.div
    whileHover={{ y: -5, scale: 1.02 }}
    className="group"
  >
    <GlassCard className="p-6 h-full border-gold/20 hover:border-gold/40 transition-all">
      <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        <IconComponent className="w-6 h-6 text-gold" />
      </div>
      <h4 className="text-white font-bold mb-2 font-heading">{title}</h4>
      <p className="text-slate-300 text-sm leading-relaxed">{description}</p>
    </GlassCard>
  </motion.div>
);

// Stat Card
const StatCard = ({ value, label }) => (
  <div className="text-center">
    <div className="text-4xl font-bold text-gold mb-2 font-heading">{value}</div>
    <div className="text-slate-300 text-sm">{label}</div>
  </div>
);

// Dealer Application Form
const DealerApplicationForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    businessType: '',
    yearsInBusiness: '',
    currentProducts: '',
    monthlyVolume: '',
    existingOutlets: '',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await dealerAPI.apply({
        companyName: formData.companyName,
        contactPerson: formData.contactName,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        state: formData.state,
        address: `${formData.city}, ${formData.state}`,
        pincode: '',
        businessType: formData.businessType,
        yearsInBusiness: parseInt(formData.yearsInBusiness?.split('-')[0]) || 0,
        currentProducts: formData.currentProducts ? [formData.currentProducts] : [],
        monthlyTargetValue: formData.monthlyVolume ? parseInt(formData.monthlyVolume?.split('-')[0]) : null,
        additionalNotes: formData.message
      });

      toast.success(`Application submitted! Reference: ${response.data.referenceNumber}`);
      setIsSubmitted(true);

      // Reset form after delay
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          companyName: '',
          contactName: '',
          email: '',
          phone: '',
          city: '',
          state: '',
          businessType: '',
          yearsInBusiness: '',
          currentProducts: '',
          monthlyVolume: '',
          existingOutlets: '',
          message: ''
        });
      }, 5000);
    } catch (error) {
      toast.error(error.message || 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success state
  if (isSubmitted) {
    return (
      <GlassCard className="p-8 border-gold/20" id="apply">
        <div className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3 font-heading">Application Submitted!</h3>
          <p className="text-slate-300 max-w-md mx-auto">
            Thank you for your interest in becoming a dealer. Our team will review your application 
            and contact you within 48 hours.
          </p>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-8 border-gold/20" id="apply">
      <div className="text-center mb-8">
        <SectionBadge className="mb-4 bg-blue-300/16 text-orange-300 border-blue-200/30">
          <Building className="w-4 h-4" />
          Dealer Application
        </SectionBadge>
        <H3 className="text-white font-heading">Apply to Become a Dealer</H3>
        <p className="text-slate-300 mt-2">Fill out the form below and our team will get back to you within 48 hours.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company Information */}
        <div className="space-y-4">
          <h4 className="text-white font-medium text-sm uppercase tracking-wider border-b border-blue-200/25 pb-2">
            Company Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-200 text-sm mb-2">Company Name *</label>
              <input
                type="text"
                required
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full bg-blue-300/15 border border-blue-200/25 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-gold/50 transition-colors"
                placeholder="Your Company Pvt. Ltd."
              />
            </div>
            <div>
              <label className="block text-slate-200 text-sm mb-2">Contact Person *</label>
              <input
                type="text"
                required
                value={formData.contactName}
                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                className="w-full bg-blue-300/15 border border-blue-200/25 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-gold/50 transition-colors"
                placeholder="Full Name"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-200 text-sm mb-2">Email Address *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-blue-300/15 border border-blue-200/25 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-gold/50 transition-colors"
                placeholder="business@company.com"
              />
            </div>
            <div>
              <label className="block text-slate-200 text-sm mb-2">Phone Number *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-blue-300/15 border border-blue-200/25 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-gold/50 transition-colors"
                placeholder="+91 98765 43210"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-200 text-sm mb-2">City *</label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full bg-blue-300/15 border border-blue-200/25 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-gold/50 transition-colors"
                placeholder="Your City"
              />
            </div>
            <div>
              <label className="block text-slate-200 text-sm mb-2">State *</label>
              <input
                type="text"
                required
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full bg-blue-300/15 border border-blue-200/25 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-gold/50 transition-colors"
                placeholder="Your State"
              />
            </div>
          </div>
        </div>

        {/* Business Details */}
        <div className="space-y-4">
          <h4 className="text-white font-medium text-sm uppercase tracking-wider border-b border-blue-200/25 pb-2">
            Business Details
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-200 text-sm mb-2">Business Type *</label>
              <select
                required
                value={formData.businessType}
                onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                className="w-full bg-blue-300/15 border border-blue-200/25 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold/50 transition-colors appearance-none cursor-pointer"
              >
                <option value="" className="bg-blue-300/15">Select Type...</option>
                <option value="retailer" className="bg-blue-300/15">Retailer</option>
                <option value="distributor" className="bg-blue-300/15">Distributor</option>
                <option value="contractor" className="bg-blue-300/15">Contractor / Builder</option>
                <option value="architect" className="bg-blue-300/15">Architect / Interior Designer</option>
                <option value="wholesaler" className="bg-blue-300/15">Wholesaler</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-200 text-sm mb-2">Years in Business *</label>
              <select
                required
                value={formData.yearsInBusiness}
                onChange={(e) => setFormData({ ...formData, yearsInBusiness: e.target.value })}
                className="w-full bg-blue-300/15 border border-blue-200/25 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold/50 transition-colors appearance-none cursor-pointer"
              >
                <option value="" className="bg-blue-300/15">Select...</option>
                <option value="0-2" className="bg-blue-300/15">0-2 years</option>
                <option value="3-5" className="bg-blue-300/15">3-5 years</option>
                <option value="5-10" className="bg-blue-300/15">5-10 years</option>
                <option value="10+" className="bg-blue-300/15">10+ years</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-200 text-sm mb-2">Current Product Lines</label>
              <input
                type="text"
                value={formData.currentProducts}
                onChange={(e) => setFormData({ ...formData, currentProducts: e.target.value })}
                className="w-full bg-blue-300/15 border border-blue-200/25 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-gold/50 transition-colors"
                placeholder="e.g., Building materials, Hardware"
              />
            </div>
            <div>
              <label className="block text-slate-200 text-sm mb-2">Expected Monthly Volume (sqft)</label>
              <select
                value={formData.monthlyVolume}
                onChange={(e) => setFormData({ ...formData, monthlyVolume: e.target.value })}
                className="w-full bg-blue-300/15 border border-blue-200/25 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold/50 transition-colors appearance-none cursor-pointer"
              >
                <option value="" className="bg-blue-300/15">Select...</option>
                <option value="500-2000" className="bg-blue-300/15">500 - 2,000 sqft</option>
                <option value="2000-5000" className="bg-blue-300/15">2,000 - 5,000 sqft</option>
                <option value="5000-10000" className="bg-blue-300/15">5,000 - 10,000 sqft</option>
                <option value="10000+" className="bg-blue-300/15">10,000+ sqft</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-200 text-sm mb-2">Tell us about your business</label>
            <textarea
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full bg-blue-300/15 border border-blue-200/25 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-gold/50 transition-colors resize-none"
              placeholder="Describe your business, existing customer base, and why you want to partner with Pranijheightsindia..."
            />
          </div>
        </div>

        <div className="flex items-start gap-3">
          <input type="checkbox" required className="mt-1 rounded border-black/20" />
          <p className="text-slate-300 text-sm">
            I agree to the <a href="#" className="text-gold hover:underline">Terms & Conditions</a> and 
            authorize Pranijheightsindia to contact me regarding the dealer partnership.
          </p>
        </div>

        <Button 
          type="submit" 
          variant="primary" 
          size="lg"
          className="w-full bg-gold hover:bg-gold/90 text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              Submit Application
              <ArrowRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>
      </form>
    </GlassCard>
  );
};

const DealerPortal = () => {
  const benefits = [
    { icon: Percent, title: "Competitive Margins", description: "Industry-leading profit margins with volume-based incentives and rebates." },
    { icon: Truck, title: "Fast Delivery", description: "Pan-India logistics network ensuring delivery within 5-7 business days." },
    { icon: HeadphonesIcon, title: "Dedicated Support", description: "Personal account manager and priority technical support line." },
    { icon: Package, title: "Wide Product Range", description: "Access to 200+ SKUs across all categories and finishes." },
    { icon: FileText, title: "Marketing Support", description: "Free POS materials, catalogues, and digital marketing assets." },
    { icon: Shield, title: "Brand Protection", description: "Territory protection and authorized dealer certification." },
  ];

  const requirements = [
    "Registered business entity (GST registered)",
    "Showroom or retail space minimum 500 sqft",
    "Minimum annual purchase commitment",
    "Dedicated sales staff for PVC panels",
    "Financial stability and creditworthiness"
  ];

  const testimonials = [
    { name: "Rajesh Traders", location: "Mumbai", quote: "Partnering with Pranij Heights transformed our business. Their quality products and support helped us grow 3x in two years." },
    { name: "Krishna Interiors", location: "Bangalore", quote: "The dealer program offers the best margins in the industry. Excellent product quality and consistent supply." },
  ];

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <AnimatedBackground variant="mesh" />
      <SpotlightEffect />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <SectionBadge className="mb-6 bg-blue-300/16 text-orange-300 border-blue-200/30">
                <Building className="w-4 h-4" />
                Dealer Partnership
              </SectionBadge>
              
              <H1 className="mb-6 font-heading text-white">
                Partner With India's <span className="text-gold">Leading</span> PVC Panel Brand
              </H1>
              
              <Body className="text-slate-200 text-lg mb-8">
                Join our network of 5000+ successful dealers across India. Get access to premium products, 
                competitive pricing, and comprehensive business support.
              </Body>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                <StatCard value="5000+" label="Dealers" />
                <StatCard value="200+" label="SKUs" />
                <StatCard value="Since 2017" label="Manufacturing" />
              </div>

              <div className="flex flex-wrap gap-4">
                <a href="#apply">
                  <Button variant="primary" className="bg-gold hover:bg-gold/90 text-charcoal">
                    Apply Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </a>
                <Link to="/contact">
                  <Button variant="outline" className="border-gold/50 text-gold hover:bg-gold/10">
                    <Phone className="w-5 h-5 mr-2" />
                    Talk to Sales
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Dealer onboarding info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <GlassCard className="p-8 border-gold/20">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gold/20 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-gold" />
                  </div>
                  <h3 className="text-xl font-bold text-white font-heading mb-2">Simple Dealer Onboarding</h3>
                  <p className="text-slate-300 text-sm">Submit the form and our team will contact you directly.</p>
                </div>

                <div className="space-y-4 text-sm text-slate-200">
                  <div className="p-4 rounded-xl bg-blue-300/12 border border-blue-200/25">
                    <p className="font-medium text-white">Step 1</p>
                    <p>Fill the dealer application form with your business details.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-blue-300/12 border border-blue-200/25">
                    <p className="font-medium text-white">Step 2</p>
                    <p>Admin team reviews your request and verifies eligibility.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-blue-300/12 border border-blue-200/25">
                    <p className="font-medium text-white">Step 3</p>
                    <p>Our partnership manager contacts you for onboarding.</p>
                  </div>
                </div>

                <a href="#apply" className="block mt-6">
                  <Button variant="primary" className="w-full bg-gold hover:bg-gold/90 text-charcoal" icon={ArrowRight}>
                    Apply for Dealership
                  </Button>
                </a>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative py-24 bg-charcoal-light/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <SectionBadge className="mb-6 bg-blue-300/16 text-orange-300 border-blue-200/30">
              <Award className="w-4 h-4" />
              Partnership Benefits
            </SectionBadge>
            
            <H2 className="mb-4 font-heading text-white">
              Why Partner With <span className="text-gold">Pranij Heights</span>
            </H2>
            
            <p className="text-slate-300 max-w-2xl mx-auto">
              Our dealer program is designed to help you succeed with industry-leading support and margins.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <BenefitCard {...benefit} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="relative py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <SectionBadge className="mb-6 bg-blue-300/16 text-orange-300 border-blue-200/30">
                <Briefcase className="w-4 h-4" />
                Requirements
              </SectionBadge>
              
              <H2 className="mb-6 font-heading text-white">
                Dealer <span className="text-gold">Eligibility</span>
              </H2>
              
              <Body className="text-slate-200 mb-8">
                We partner with established businesses that share our commitment to quality and customer service. 
                Here's what we look for in our dealer partners:
              </Body>

              <ul className="space-y-4">
                {requirements.map((req, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 text-gold" />
                    </div>
                    <span className="text-slate-200">{req}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Testimonials */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {testimonials.map((testimonial, index) => (
                <GlassCard key={index} className="p-6 border-gold/20">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-gold fill-gold" />
                    ))}
                  </div>
                  <p className="text-slate-200 italic mb-4">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                      <Building className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{testimonial.name}</p>
                      <p className="text-slate-300 text-sm">{testimonial.location}</p>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Application Form Section */}
      <section className="relative py-24 bg-charcoal-light/30">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <DealerApplicationForm />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <GlassCard className="text-center py-16 relative overflow-hidden border-gold/20">
              <div className="absolute inset-0 bg-linear-to-r from-gold/10 via-transparent to-gold/10 -z-10" />
              
              <div className="max-w-2xl mx-auto">
                <Globe className="w-12 h-12 text-gold mx-auto mb-6" />
                
                <H2 className="mb-4 font-heading text-white">
                  Ready to <span className="text-gold">Grow Together?</span>
                </H2>
                
                <p className="text-slate-200 mb-8">
                  Have questions about the dealer program? Our business development team is here to help.
                </p>
                
                <div className="flex flex-wrap justify-center gap-4">
                  <a href="tel:+919876543210">
                    <Button variant="primary" size="lg" className="bg-gold hover:bg-gold/90 text-charcoal">
                      <Phone className="w-5 h-5 mr-2" />
                      Call: +91 98765 43210
                    </Button>
                  </a>
                  <a href="mailto:dealers@pranijheightsindia.com">
                    <Button variant="outline" size="lg" className="border-gold/50 text-gold hover:bg-gold/10">
                      <Mail className="w-5 h-5 mr-2" />
                      dealers@pranijheightsindia.com
                    </Button>
                  </a>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default DealerPortal;


