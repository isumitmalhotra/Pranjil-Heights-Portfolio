import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  MapPin, Phone, Mail, Clock, Send, MessageCircle, Users, Building, ArrowRight,
  CheckCircle, Globe, Briefcase, Factory, Loader2
} from 'lucide-react';
import { H1, H2, Body, SectionBadge } from '../components/ui/Typography';
import { GlassCard } from '../components/ui/GlassCard';
import { AnimatedBackground, SpotlightEffect } from '../components/ui/AnimatedBackground';
import { Button } from '../components/ui/Button';
import { FAQ } from '../components/contact/FAQ';
import { contactAPI, quoteAPI, dealerAPI } from '../services/api';

// Contact Info Card with hover effects
const ContactCard = ({ icon: IconComponent, title, details, action, link, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    whileHover={{ y: -5, scale: 1.02 }}
    className="group"
  >
    <GlassCard className="p-6 h-full relative overflow-hidden border-gold/20">
      {/* Gradient Glow on Hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl bg-gold/20" />
      
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110 bg-gold/20">
          <IconComponent className="w-6 h-6 text-gold" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-gold transition-all font-heading">
            {title}
          </h3>
          {details.map((line, i) => (
            <p key={i} className="text-gray-600 text-sm leading-relaxed">{line}</p>
          ))}
          {action && (
            <a 
              href={link} 
              className="inline-flex items-center gap-2 text-gold text-sm font-medium mt-3 hover:gap-3 transition-all"
            >
              {action}
              <ArrowRight className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </GlassCard>
  </motion.div>
);

// Regional Office Card
const RegionalOfficeCard = ({ city, address, phone, email }) => (
  <GlassCard className="p-6 border-gold/20 hover:border-gold/40 transition-all">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center">
        <MapPin className="w-5 h-5 text-gold" />
      </div>
      <h4 className="text-gray-800 font-bold font-heading">{city}</h4>
    </div>
    <p className="text-gray-600 text-sm mb-3">{address}</p>
    <div className="space-y-2">
      <a href={`tel:${phone}`} className="flex items-center gap-2 text-gray-700 text-sm hover:text-gold transition-colors">
        <Phone className="w-4 h-4" />
        {phone}
      </a>
      <a href={`mailto:${email}`} className="flex items-center gap-2 text-gray-700 text-sm hover:text-gold transition-colors">
        <Mail className="w-4 h-4" />
        {email}
      </a>
    </div>
  </GlassCard>
);

// Enquiry Form Component
const EnquiryForm = ({ enquiryType, setEnquiryType }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    city: '',
    requirement: '',
    message: ''
  });

  const resetForm = () => {
    setFormData({
      name: '',
      company: '',
      email: '',
      phone: '',
      city: '',
      requirement: '',
      message: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let response;
      
      if (enquiryType === 'dealer') {
        // Dealer application
        response = await dealerAPI.apply({
          contactPerson: formData.name,
          companyName: formData.company,
          email: formData.email,
          phone: formData.phone,
          city: formData.city,
          businessType: formData.requirement,
          additionalNotes: formData.message,
          address: formData.city,
          state: '',
          pincode: ''
        });
        toast.success(`Dealer application submitted! Reference: ${response.data.referenceNumber}`);
      } else if (enquiryType === 'quotation') {
        // Quote request
        response = await quoteAPI.submit({
          name: formData.name,
          company: formData.company,
          email: formData.email,
          phone: formData.phone,
          projectType: formData.requirement,
          projectDetails: formData.message,
          deliveryAddress: formData.city
        });
        toast.success(`Quote request submitted! Reference: ${response.data.referenceNumber}`);
      } else {
        // General contact
        response = await contactAPI.submit({
          name: formData.name,
          company: formData.company,
          email: formData.email,
          phone: formData.phone,
          subject: `${formData.requirement} - From ${formData.city}`,
          message: formData.message
        });
        toast.success('Thank you! Your message has been sent successfully.');
      }
      
      resetForm();
    } catch (error) {
      toast.error(error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <GlassCard className="p-8 border-gold/20">
      <div className="flex gap-2 mb-8 p-1 bg-gray-100 rounded-xl">
        <button
          onClick={() => setEnquiryType('general')}
          className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
            enquiryType === 'general' 
              ? 'bg-gold text-white' 
              : 'text-gray-700 hover:text-gray-900'
          }`}
        >
          <MessageCircle className="w-4 h-4 inline mr-2" />
          General Enquiry
        </button>
        <button
          onClick={() => setEnquiryType('quotation')}
          className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
            enquiryType === 'quotation' 
              ? 'bg-gold text-white' 
              : 'text-gray-700 hover:text-gray-900'
          }`}
        >
          <Briefcase className="w-4 h-4 inline mr-2" />
          Request Quotation
        </button>
        <button
          onClick={() => setEnquiryType('dealer')}
          className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
            enquiryType === 'dealer' 
              ? 'bg-gold text-white' 
              : 'text-gray-700 hover:text-gray-900'
          }`}
        >
          <Building className="w-4 h-4 inline mr-2" />
          Become a Dealer
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 text-sm mb-2">Full Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-gray-100 border border-black/10 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gold/50 transition-colors"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm mb-2">Company Name *</label>
            <input
              type="text"
              required
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full bg-gray-100 border border-black/10 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gold/50 transition-colors"
              placeholder="Your company"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 text-sm mb-2">Email Address *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-gray-100 border border-black/10 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gold/50 transition-colors"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm mb-2">Phone Number *</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-gray-100 border border-black/10 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gold/50 transition-colors"
              placeholder="+91 98765 43210"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 text-sm mb-2">City *</label>
            <input
              type="text"
              required
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full bg-gray-100 border border-black/10 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gold/50 transition-colors"
              placeholder="Your city"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm mb-2">
              {enquiryType === 'dealer' ? 'Business Type *' : 'Requirement Type *'}
            </label>
            <select
              required
              value={formData.requirement}
              onChange={(e) => setFormData({ ...formData, requirement: e.target.value })}
              className="w-full bg-gray-100 border border-black/10 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-gold/50 transition-colors appearance-none cursor-pointer"
            >
              <option value="" className="bg-white">Select...</option>
              {enquiryType === 'dealer' ? (
                <>
                  <option value="retailer" className="bg-white">Retailer</option>
                  <option value="distributor" className="bg-white">Distributor</option>
                  <option value="contractor" className="bg-white">Contractor</option>
                  <option value="architect" className="bg-white">Architect/Designer</option>
                </>
              ) : (
                <>
                  <option value="residential" className="bg-white">Residential Project</option>
                  <option value="commercial" className="bg-white">Commercial Project</option>
                  <option value="institutional" className="bg-white">Institutional Project</option>
                  <option value="bulk" className="bg-white">Bulk Order</option>
                </>
              )}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-gray-700 text-sm mb-2">
            {enquiryType === 'dealer' ? 'Tell us about your business' : 'Project Details / Message'}
          </label>
          <textarea
            rows={4}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full bg-gray-100 border border-black/10 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gold/50 transition-colors resize-none"
            placeholder={enquiryType === 'dealer' 
              ? "Tell us about your business, current product lines, and why you want to partner with us..."
              : "Describe your project requirements, estimated quantity, timeline..."
            }
          />
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
              <Send className="w-5 h-5 mr-2" />
              {enquiryType === 'dealer' ? 'Submit Dealer Application' : 'Send Enquiry'}
            </>
          )}
        </Button>
      </form>
    </GlassCard>
  );
};

// Stats Card
const StatCard = ({ value, label }) => (
  <div className="text-center p-6">
    <div className="text-4xl font-bold text-gold mb-2 font-heading">{value}</div>
    <div className="text-gray-600 text-sm">{label}</div>
  </div>
);

const Contact = () => {
  const [enquiryType, setEnquiryType] = useState('quotation');

  const contactInfo = [
    {
      icon: MapPin,
      title: "Head Office",
      details: ["123 Industrial Area, Sector 5", "New Delhi, India 110020"],
      action: "Get Directions",
      link: "#"
    },
    {
      icon: Phone,
      title: "Sales Enquiries",
      details: ["+91 98765 43210 (Sales)", "+91 11 2345 6789 (Office)"],
      action: "Call Now",
      link: "tel:+919876543210"
    },
    {
      icon: Mail,
      title: "Email Us",
      details: ["sales@pvcpro.com", "dealers@pvcpro.com"],
      action: "Send Email",
      link: "mailto:sales@pvcpro.com"
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: ["Mon - Sat: 9:00 AM - 6:00 PM", "Sunday: Closed"],
      action: null,
      link: null
    }
  ];

  const regionalOffices = [
    { city: "Mumbai", address: "Unit 45, Trade Center, Andheri East", phone: "+91 22 2345 6789", email: "mumbai@pvcpro.com" },
    { city: "Bangalore", address: "12/A, Industrial Layout, Whitefield", phone: "+91 80 2345 6789", email: "bangalore@pvcpro.com" },
    { city: "Chennai", address: "Plot 78, SIDCO Industrial Estate", phone: "+91 44 2345 6789", email: "chennai@pvcpro.com" },
    { city: "Kolkata", address: "Block C, Salt Lake Sector V", phone: "+91 33 2345 6789", email: "kolkata@pvcpro.com" },
  ];

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <AnimatedBackground variant="mesh" />
      <SpotlightEffect />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <SectionBadge className="mb-6 bg-gold/20 text-gold border-gold/30">
              <MessageCircle className="w-4 h-4" />
              Contact Us
            </SectionBadge>
            
            <H1 className="mb-6 font-heading text-gray-800">
              Let's Discuss Your <span className="text-gold">Project</span>
            </H1>
            
            <Body className="text-gray-700 text-lg">
              Whether you need a quotation for a project, want to become a dealer, or have 
              technical questions, our team is here to help.
            </Body>
          </motion.div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="relative py-8">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <GlassCard className="py-4 border-gold/20">
              <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
                <StatCard value="24h" label="Response Time" />
                <StatCard value="500+" label="Dealers Nationwide" />
                <StatCard value="98%" label="Client Satisfaction" />
                <StatCard value="25+" label="Years Experience" />
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="relative py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2"
            >
              <EnquiryForm enquiryType={enquiryType} setEnquiryType={setEnquiryType} />
            </motion.div>

            {/* Contact Info */}
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <ContactCard key={index} {...info} index={index} />
              ))}

              {/* Map */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <GlassCard className="p-0 h-64 overflow-hidden relative group border-gold/20">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224345.83923192776!2d77.0688975472578!3d28.52758200617607!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0x37205b715389640!2sDelhi!5e0!3m2!1sen!2sin!4v1704200000000!5m2!1sen!2sin" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen="" 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0 grayscale opacity-70 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500"
                  />
                  
                  {/* Map Overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-charcoal via-transparent to-transparent pointer-events-none" />
                  
                  {/* View Map Button */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <a 
                      href="https://maps.google.com" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 bg-gold/20 backdrop-blur-sm rounded-xl text-gold text-sm font-medium hover:bg-gold/30 transition-all"
                    >
                      <MapPin className="w-4 h-4" />
                      View on Google Maps
                    </a>
                  </div>
                </GlassCard>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Regional Offices Section */}
      <section className="relative py-16 bg-charcoal-light/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <SectionBadge className="mb-6 bg-gold/20 text-gold border-gold/30">
              <Globe className="w-4 h-4" />
              Regional Presence
            </SectionBadge>
            
            <H2 className="mb-4 font-heading text-gray-800">
              Our <span className="text-gold">Offices</span> Across India
            </H2>
            
            <p className="text-gray-600 max-w-2xl mx-auto">
              With regional offices in major cities, we ensure prompt support and 
              efficient delivery to our dealers and customers.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {regionalOffices.map((office, index) => (
              <motion.div
                key={office.city}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <RegionalOfficeCard {...office} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <SectionBadge className="mb-6 bg-gold/20 text-gold border-gold/30">
              <CheckCircle className="w-4 h-4" />
              FAQ
            </SectionBadge>
            
            <H2 className="mb-4 font-heading text-gray-800">
              Frequently Asked <span className="text-gold">Questions</span>
            </H2>
            
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find quick answers to common questions about our products, ordering, and dealer partnerships.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <FAQ />
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
              {/* Background Gradient */}
              <div className="absolute inset-0 bg-linear-to-r from-gold/10 via-transparent to-gold/10 -z-10" />
              
              <div className="max-w-2xl mx-auto">
                <div className="w-16 h-16 rounded-2xl bg-gold/20 flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-gold" />
                </div>
                
                <H2 className="mb-4 font-heading text-gray-800">
                  Ready to <span className="text-gold">Partner</span> With Us?
                </H2>
                
                <p className="text-gray-700 mb-8">
                  Join our network of 500+ dealers across India. Get access to competitive pricing, 
                  marketing support, and dedicated account management.
                </p>
                
                <div className="flex flex-wrap justify-center gap-4">
                  <Link to="/dealer">
                    <Button variant="primary" size="lg" className="bg-gold hover:bg-gold/90 text-charcoal">
                      <Building className="w-5 h-5 mr-2" />
                      Become a Dealer
                    </Button>
                  </Link>
                  <a href="tel:+919876543210">
                    <Button variant="outline" size="lg" className="border-gold/50 text-gold hover:bg-gold/10">
                      <Phone className="w-5 h-5 mr-2" />
                      Call Sales Team
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

export default Contact;

