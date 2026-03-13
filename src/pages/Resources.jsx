import React from 'react';
import { Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { 
  Download, FileText, BookOpen, Video, Image, Calculator, 
  ArrowRight, ExternalLink, Ruler, CheckCircle, Phone, HelpCircle
} from 'lucide-react';
import { MaterialCalculator } from '../components/tools/MaterialCalculator';
import { FAQ } from '../components/contact/FAQ';
import { AnimatedBackground, SpotlightEffect } from '../components/ui/AnimatedBackground';
import { GlassCard } from '../components/ui/GlassCard';
import { H1, H2, Body, SectionBadge } from '../components/ui/Typography';
import { Button } from '../components/ui/Button';

// Resource Card Component
const ResourceCard = ({ icon: IconComponent, title, description, fileType, fileSize, downloadLink }) => (
  <motion.div
    whileHover={{ y: -5, scale: 1.02 }}
    className="group"
  >
    <GlassCard className="p-6 h-full border-gold/20 hover:border-gold/40 transition-all">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gold/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
          <IconComponent className="w-7 h-7 text-gold" />
        </div>
        <div className="flex-1">
          <h3 className="text-white font-bold mb-2 group-hover:text-gold transition-colors font-heading">
            {title}
          </h3>
          <p className="text-slate-300 text-sm mb-4">{description}</p>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs">{fileType} - {fileSize}</span>
            <a 
              href={downloadLink}
              className="flex items-center gap-2 text-gold text-sm font-medium hover:gap-3 transition-all"
            >
              <Download className="w-4 h-4" />
              Download
            </a>
          </div>
        </div>
      </div>
    </GlassCard>
  </motion.div>
);

// Category Section Component
const ResourceCategory = ({ title, description, icon: IconComponent, resources }) => (
  <div className="mb-16">
    <div className="flex items-center gap-4 mb-8">
      <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center">
        <IconComponent className="w-6 h-6 text-gold" />
      </div>
      <div>
        <h3 className="text-xl font-bold text-white font-heading">{title}</h3>
        <p className="text-slate-300 text-sm">{description}</p>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {resources.map((resource, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
        >
          <ResourceCard {...resource} />
        </motion.div>
      ))}
    </div>
  </div>
);

// Quick Link Card
const QuickLinkCard = ({ icon: IconComponent, title, description, link, linkText }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="group"
  >
    <GlassCard className="p-6 h-full border-gold/20 hover:border-gold/40 transition-all text-center">
      <div className="w-16 h-16 rounded-2xl bg-gold/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
        <IconComponent className="w-8 h-8 text-gold" />
      </div>
      <h4 className="text-white font-bold mb-2 font-heading">{title}</h4>
      <p className="text-slate-300 text-sm mb-4">{description}</p>
      <Link to={link} className="inline-flex items-center gap-2 text-gold text-sm font-medium hover:gap-3 transition-all">
        {linkText}
        <ArrowRight className="w-4 h-4" />
      </Link>
    </GlassCard>
  </motion.div>
);

const Resources = () => {
  const catalogues = [
    { 
      icon: FileText, 
      title: "Product Catalogue 2024", 
      description: "Complete catalogue with all product ranges, specifications, and finishes.", 
      fileType: "PDF", 
      fileSize: "12.5 MB",
      downloadLink: "#"
    },
    { 
      icon: FileText, 
      title: "Wood Series Brochure", 
      description: "Detailed brochure featuring our premium wood finish panels.", 
      fileType: "PDF", 
      fileSize: "4.2 MB",
      downloadLink: "#"
    },
    { 
      icon: FileText, 
      title: "Stone Series Brochure", 
      description: "Explore our luxurious marble and stone effect panel collection.", 
      fileType: "PDF", 
      fileSize: "3.8 MB",
      downloadLink: "#"
    },
  ];

  const technicalDocs = [
    { 
      icon: BookOpen, 
      title: "Technical Specifications", 
      description: "Complete technical data sheets for all product categories.", 
      fileType: "PDF", 
      fileSize: "2.1 MB",
      downloadLink: "#"
    },
    { 
      icon: BookOpen, 
      title: "Material Safety Data Sheet", 
      description: "MSDS documentation for safety and compliance requirements.", 
      fileType: "PDF", 
      fileSize: "850 KB",
      downloadLink: "#"
    },
    { 
      icon: BookOpen, 
      title: "Fire Safety Certificate", 
      description: "Class A fire rating certification and test reports.", 
      fileType: "PDF", 
      fileSize: "1.2 MB",
      downloadLink: "#"
    },
  ];

  const installationGuides = [
    { 
      icon: Video, 
      title: "Wall Panel Installation Guide", 
      description: "Step-by-step video guide for wall panel installation.", 
      fileType: "Video", 
      fileSize: "Watch Online",
      downloadLink: "#"
    },
    { 
      icon: Video, 
      title: "Ceiling Panel Installation", 
      description: "Complete guide for ceiling panel installation techniques.", 
      fileType: "Video", 
      fileSize: "Watch Online",
      downloadLink: "#"
    },
    { 
      icon: BookOpen, 
      title: "Installation Manual", 
      description: "Comprehensive PDF manual with detailed instructions.", 
      fileType: "PDF", 
      fileSize: "5.4 MB",
      downloadLink: "#"
    },
  ];

  const imageAssets = [
    { 
      icon: Image, 
      title: "High-Res Product Images", 
      description: "Professional product images for marketing materials.", 
      fileType: "ZIP", 
      fileSize: "85 MB",
      downloadLink: "#"
    },
    { 
      icon: Image, 
      title: "Project Gallery", 
      description: "Completed project photographs for reference.", 
      fileType: "ZIP", 
      fileSize: "120 MB",
      downloadLink: "#"
    },
    { 
      icon: Image, 
      title: "Logo & Brand Assets", 
      description: "Official brand logos and guidelines for dealers.", 
      fileType: "ZIP", 
      fileSize: "15 MB",
      downloadLink: "#"
    },
  ];

  const quickLinks = [
    { icon: Calculator, title: "Material Calculator", description: "Calculate exact panel requirements for your project", link: "#calculator", linkText: "Use Calculator" },
    { icon: FileText, title: "Request Quotation", description: "Get customized pricing for your requirements", link: "/contact", linkText: "Get Quote" },
    { icon: Phone, title: "Technical Support", description: "Speak to our technical experts", link: "/contact", linkText: "Contact Us" },
  ];

  return (
    <div className="relative min-h-screen">
      {/* Background Effects */}
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
            <SectionBadge className="mb-6 bg-blue-300/16 text-orange-300 border-blue-200/30">
              <BookOpen className="w-4 h-4" />
              Resources
            </SectionBadge>
            
            <H1 className="mb-6 font-heading text-white">
              Downloads & <span className="text-gold">Technical Resources</span>
            </H1>
            
            <Body className="text-slate-300 text-lg">
              Access product catalogues, technical documentation, installation guides, 
              and marketing materials. Everything you need for your projects.
            </Body>
          </motion.div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="relative py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickLinks.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <QuickLinkCard {...item} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Material Calculator Section */}
      <section className="relative py-16" id="calculator">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <SectionBadge className="mb-6 bg-blue-300/16 text-orange-300 border-blue-200/30">
              <Calculator className="w-4 h-4" />
              Planning Tool
            </SectionBadge>
            
            <H2 className="mb-4 font-heading text-white">
              Material <span className="text-gold">Calculator</span>
            </H2>
            
            <p className="text-slate-300 max-w-2xl mx-auto">
              Calculate exact panel requirements for your project. Get accurate quantity estimates in seconds.
            </p>
          </motion.div>

          <MaterialCalculator />
        </div>
      </section>
      
      {/* Resources Sections */}
      <section className="relative py-16 bg-blue-400/10">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <SectionBadge className="mb-6 bg-blue-300/16 text-orange-300 border-blue-200/30">
              <Download className="w-4 h-4" />
              Downloads
            </SectionBadge>
            
            <H2 className="mb-4 font-heading text-white">
              Product <span className="text-gold">Catalogues</span> & Documentation
            </H2>
            
            <p className="text-slate-300 max-w-2xl mx-auto">
              Download our comprehensive catalogues, technical specifications, and marketing materials.
            </p>
          </motion.div>

          <ResourceCategory 
            title="Product Catalogues" 
            description="Complete product range documentation"
            icon={FileText}
            resources={catalogues}
          />

          <ResourceCategory 
            title="Technical Documentation" 
            description="Specifications, certifications, and compliance documents"
            icon={BookOpen}
            resources={technicalDocs}
          />

          <ResourceCategory 
            title="Installation Guides" 
            description="Step-by-step installation instructions and videos"
            icon={Video}
            resources={installationGuides}
          />

          <ResourceCategory 
            title="Marketing Assets" 
            description="Images and brand materials for dealers"
            icon={Image}
            resources={imageAssets}
          />
        </div>
      </section>

      {/* Dealer Resources Banner */}
      <section className="relative py-16">
        <div className="container mx-auto px-6">
          <GlassCard className="p-8 border-gold/20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gold/20 flex items-center justify-center">
                  <FileText className="w-8 h-8 text-gold" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white font-heading">Looking for Dealer Resources?</h3>
                  <p className="text-slate-300">Access exclusive pricing, dealer-specific catalogues, and marketing support materials.</p>
                </div>
              </div>
              <Link to="/dealer">
                <Button variant="primary" className="bg-gold hover:bg-gold/90 text-white whitespace-nowrap">
                  Dealer Portal
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-24 bg-blue-400/10" id="faq">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <SectionBadge className="mb-6 bg-blue-300/16 text-orange-300 border-blue-200/30">
              <HelpCircle className="w-4 h-4" />
              FAQ
            </SectionBadge>
            
            <H2 className="mb-4 font-heading text-white">
              Frequently Asked <span className="text-gold">Questions</span>
            </H2>
            
            <p className="text-slate-300 max-w-2xl mx-auto">
              Find answers to common questions about our products, installation, warranty, and ordering process.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <FAQ />
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="relative py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <GlassCard className="text-center py-16 border-gold/20">
              <div className="max-w-2xl mx-auto">
                <div className="w-16 h-16 rounded-2xl bg-gold/20 flex items-center justify-center mx-auto mb-6">
                  <Ruler className="w-8 h-8 text-gold" />
                </div>
                
                <H2 className="mb-4 font-heading text-white">
                  Need <span className="text-gold">Technical Assistance?</span>
                </H2>
                
                <p className="text-slate-300 mb-8">
                  Our technical team is available to help with specifications, installation guidance, 
                  and custom requirements. Get expert support for your projects.
                </p>
                
                <div className="flex flex-wrap justify-center gap-4">
                  <Link to="/contact">
                    <Button variant="primary" size="lg" className="bg-gold hover:bg-gold/90 text-white">
                      Contact Technical Team
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                  <a href="tel:+919876543210">
                    <Button variant="outline" size="lg" className="border-gold/50 text-gold hover:bg-gold/10">
                      <Phone className="w-5 h-5 mr-2" />
                      +91 98765 43210
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

export default Resources;


