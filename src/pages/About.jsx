import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { 
  Award, TrendingUp, Users, Factory, CheckCircle, Target, Heart, Lightbulb, 
  ArrowRight, MapPin, Building, Briefcase, Shield, Leaf, Globe
} from 'lucide-react';
import { H1, H2, H3, Body, SectionBadge } from '../components/ui/Typography';
import { GlassCard } from '../components/ui/GlassCard';
import { AnimatedBackground, SpotlightEffect } from '../components/ui/AnimatedBackground';
import { Button } from '../components/ui/Button';

// Animated Counter Component
const AnimatedNumber = ({ value, suffix = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  return (
    <span ref={ref}>
      {isInView ? value : '0'}{suffix}
    </span>
  );
};

// Timeline Item Component
const TimelineItem = ({ year, title, description, index, isLast }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={`flex items-center gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
    >
      {/* Content */}
      <div className="flex-1">
        <GlassCard className={`p-6 ${index % 2 === 0 ? 'md:ml-auto' : ''} max-w-md`}>
          <span className="text-yellow-600 font-bold text-2xl mb-2 block">{year}</span>
          <H3 className="mb-3 text-gray-800">{title}</H3>
          <p className="text-gray-600">{description}</p>
        </GlassCard>
      </div>
      
      {/* Timeline Node */}
      <div className="relative flex flex-col items-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="w-6 h-6 rounded-full bg-yellow-600 relative z-10 shadow-md"
        >
          <div className="absolute inset-0 rounded-full bg-yellow-600 animate-ping opacity-30" />
        </motion.div>
        {!isLast && (
          <div className="w-0.5 h-24 bg-gray-200" />
        )}
      </div>
      
      {/* Spacer */}
      <div className="flex-1 hidden md:block" />
    </motion.div>
  );
};

// Value Card Component
const ValueCard = ({ icon: IconComponent, title, description }) => (
  <motion.div
    whileHover={{ y: -10, scale: 1.02 }}
    className="group"
  >
    <GlassCard className="p-8 h-full relative overflow-hidden">
      {/* Gradient Background on Hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 bg-yellow-50" />
      
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 bg-yellow-100">
        <IconComponent className="w-8 h-8 text-yellow-600" />
      </div>
      
      <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-yellow-600 transition-all font-heading">
        {title}
      </h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </GlassCard>
  </motion.div>
);

// Leadership Card Component
const LeadershipCard = ({ name, role, experience }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="group"
  >
    <GlassCard className="p-6 text-center">
      <div className="w-24 h-24 rounded-full bg-gray-100 mx-auto mb-4 flex items-center justify-center">
        <Briefcase className="w-10 h-10 text-yellow-600" />
      </div>
      <h4 className="text-gray-800 font-bold text-lg font-heading">{name}</h4>
      <p className="text-yellow-600 text-sm font-medium mb-2">{role}</p>
      <p className="text-gray-500 text-sm">{experience}</p>
    </GlassCard>
  </motion.div>
);

// Facility Feature Component
const FacilityFeature = ({ icon: IconComponent, title, description }) => (
  <div className="flex items-start gap-4">
    <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center shrink-0">
      <IconComponent className="w-6 h-6 text-yellow-600" />
    </div>
    <div>
      <h4 className="text-gray-800 font-medium mb-1">{title}</h4>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  </div>
);

const About = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const stats = [
    { icon: Factory, value: "50,000+", label: "Sqft/Day Capacity" },
    { icon: TrendingUp, value: "25+", label: "Years Experience" },
    { icon: Users, value: "500+", label: "Dealers Nationwide" },
    { icon: Award, value: "ISO", label: "9001:2015 Certified" },
  ];

  const values = [
    { 
      icon: Target, 
      title: "Quality First", 
      description: "Every panel undergoes rigorous quality testing. We maintain industry-leading standards in manufacturing excellence."
    },
    { 
      icon: Lightbulb, 
      title: "Innovation", 
      description: "Continuous R&D investment in new textures, finishes, and sustainable materials keeps us ahead of industry trends."
    },
    { 
      icon: Heart, 
      title: "Customer Partnership", 
      description: "We build long-term relationships with dealers and contractors, offering dedicated support and competitive pricing."
    },
  ];

  const leadership = [
    { name: "Rajesh Kumar", role: "Managing Director", experience: "30+ years in manufacturing" },
    { name: "Priya Sharma", role: "Head of Operations", experience: "20+ years in supply chain" },
    { name: "Vikram Singh", role: "Technical Director", experience: "25+ years in product development" },
    { name: "Anita Patel", role: "Sales Director", experience: "18+ years in B2B sales" },
  ];

  const timeline = [
    { year: "1998", title: "Company Founded", description: "Started manufacturing operations in New Delhi with a vision to transform interior solutions in India." },
    { year: "2005", title: "Capacity Expansion", description: "Expanded production capacity to 20,000 sqft per day with automated German machinery." },
    { year: "2012", title: "ISO Certification", description: "Achieved ISO 9001:2015 certification for quality management systems." },
    { year: "2018", title: "Pan-India Network", description: "Established dealer network across 500+ cities with regional distribution centers." },
    { year: "2024", title: "Sustainability Focus", description: "Launched 100% recyclable product line and achieved carbon-neutral manufacturing." },
  ];

  const certifications = [
    { name: "ISO 9001:2015", subtitle: "Quality Management" },
    { name: "ISO 14001:2015", subtitle: "Environmental" },
    { name: "BIS Certified", subtitle: "Indian Standards" },
    { name: "Fire Safety", subtitle: "Class A Rated" },
  ];

  const facilityFeatures = [
    { icon: Factory, title: "State-of-the-Art Machinery", description: "German-engineered extrusion lines with precision control" },
    { icon: Shield, title: "Quality Testing Lab", description: "In-house testing for durability, fire resistance, and waterproofing" },
    { icon: Leaf, title: "Sustainable Manufacturing", description: "Solar-powered facility with zero-waste production processes" },
    { icon: Globe, title: "Export Capability", description: "Products meeting international standards for global markets" },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Background */}
      <AnimatedBackground variant="mesh" />
      <SpotlightEffect />

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-[70vh] flex items-center justify-center pt-32 pb-24">
        <motion.div 
          style={{ y: heroY, opacity: heroOpacity }}
          className="container mx-auto px-6 text-center relative z-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <SectionBadge className="mb-6 bg-yellow-100 text-yellow-600 border-yellow-200">
              <Building className="w-4 h-4" />
              About Our Company
            </SectionBadge>
            
            <H1 className="mb-6 max-w-4xl mx-auto font-heading text-gray-800">
              India's Leading Manufacturer of <span className="text-yellow-600">Premium PVC Panels</span>
            </H1>
            
            <Body className="max-w-3xl mx-auto text-xl text-gray-700 mb-8">
              For over 25 years, we have been at the forefront of PVC panel manufacturing, 
              delivering quality products to architects, contractors, and dealers across India.
            </Body>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/products">
                <Button variant="primary">
                  Explore Products
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline">
                  Partner With Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="relative py-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <GlassCard className="text-center py-8 px-4 h-full border-yellow-100">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-yellow-50">
                      <stat.icon className="w-8 h-8 text-yellow-600" />
                    </div>
                    <div className="text-3xl md:text-4xl font-bold text-yellow-600 mb-2 font-heading">
                      <AnimatedNumber value={stat.value} />
                    </div>
                    <div className="text-gray-600 text-sm">{stat.label}</div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Company Overview Section */}
      <section className="relative py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <SectionBadge className="mb-6 bg-yellow-50 text-yellow-600 border-yellow-200">Company Overview</SectionBadge>
              
              <H2 className="mb-6 font-heading text-gray-800">
                Building India's <span className="text-yellow-600">Interior Future</span>
              </H2>
              
              <Body className="text-gray-700 mb-6 leading-relaxed">
                Established in 1998, PVCPro has grown from a small manufacturing unit to become 
                one of India's most trusted names in PVC wall and ceiling panels. Our commitment 
                to quality, innovation, and customer service has made us the preferred choice for 
                architects, interior designers, and contractors nationwide.
              </Body>
              
              <Body className="text-gray-700 mb-8 leading-relaxed">
                With a production capacity of 50,000+ square feet per day and a network of 500+ 
                authorized dealers, we ensure reliable supply and consistent quality across the country. 
                Our products are specified in premium residential projects, commercial spaces, 
                hospitals, hotels, and institutional buildings.
              </Body>
              
              <div className="flex gap-4">
                <Link to="/dealer">
                  <Button variant="primary" className="bg-yellow-600 hover:bg-yellow-700 text-white">
                    Become a Dealer
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              {/* Factory Image Placeholder */}
              <div className="relative">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.4 }}
                  className="rounded-3xl overflow-hidden shadow-2xl border border-gray-200 aspect-4/3 bg-linear-to-br from-gray-800 to-gray-900 relative"
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Factory className="w-32 h-32 text-yellow-400/30" />
                  </div>
                  <div className="absolute inset-0 bg-linear-to-t from-gray-900 via-transparent to-transparent" />
                  
                  {/* Overlay Text */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-yellow-400 font-medium text-sm mb-1">Manufacturing Facility</p>
                    <p className="text-white text-lg font-heading">New Delhi, India</p>
                  </div>
                </motion.div>
                
                {/* Decorative Elements */}
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-yellow-400/20 blur-[80px] rounded-full" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="relative py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <SectionBadge className="mb-6 bg-yellow-50 text-yellow-600 border-yellow-200">
              <Users className="w-4 h-4" />
              Leadership Team
            </SectionBadge>
            
            <H2 className="mb-4 font-heading text-gray-800">
              Meet Our <span className="text-yellow-600">Leaders</span>
            </H2>
            
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experienced professionals driving innovation and excellence in PVC manufacturing.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {leadership.map((leader, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <LeadershipCard {...leader} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Manufacturing Facilities Section */}
      <section className="relative py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Facility Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="rounded-3xl overflow-hidden border border-gray-200 bg-linear-to-br from-gray-800 to-gray-900 aspect-video relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Factory className="w-20 h-20 text-yellow-400/30 mx-auto mb-4" />
                    <p className="text-gray-500">Manufacturing Facility</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Facility Features */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <SectionBadge className="mb-6 bg-yellow-50 text-yellow-600 border-yellow-200">
                <Factory className="w-4 h-4" />
                Our Facilities
              </SectionBadge>
              
              <H2 className="mb-6 font-heading text-gray-800">
                World-Class <span className="text-yellow-600">Manufacturing</span>
              </H2>
              
              <Body className="text-gray-700 mb-8">
                Our 100,000 sq ft facility is equipped with the latest German and Italian machinery, 
                ensuring precision manufacturing and consistent quality in every panel.
              </Body>
              
              <div className="space-y-6">
                {facilityFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <FacilityFeature {...feature} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="relative py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <SectionBadge className="mb-6 bg-yellow-50 text-yellow-600 border-yellow-200">
              <Heart className="w-4 h-4" />
              Our Values
            </SectionBadge>
            
            <H2 className="mb-4 font-heading text-gray-800">
              What <span className="text-yellow-600">Drives Us</span>
            </H2>
            
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our core values shape everything we do, from product design to customer relationships.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <ValueCard {...value} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="relative py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <SectionBadge className="mb-6 bg-yellow-50 text-yellow-600 border-yellow-200">
              <TrendingUp className="w-4 h-4" />
              Our Journey
            </SectionBadge>
            
            <H2 className="mb-4 font-heading text-gray-800">
              25+ Years of <span className="text-yellow-600">Excellence</span>
            </H2>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {timeline.map((item, index) => (
                <TimelineItem 
                  key={index} 
                  {...item} 
                  index={index}
                  isLast={index === timeline.length - 1}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="relative py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Certification Grid */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <div className="grid grid-cols-2 gap-6">
                {certifications.map((cert, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <GlassCard className="flex flex-col items-center justify-center p-8 aspect-square text-center border-yellow-100">
                      <div className="w-16 h-16 rounded-2xl bg-yellow-50 flex items-center justify-center mb-4">
                        <Award className="w-8 h-8 text-yellow-600" />
                      </div>
                      <span className="text-gray-800 font-bold text-lg font-heading">{cert.name}</span>
                      <span className="text-gray-500 text-sm mt-1">{cert.subtitle}</span>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <SectionBadge className="mb-6 bg-yellow-50 text-yellow-600 border-yellow-200">
                <Award className="w-4 h-4" />
                Certifications
              </SectionBadge>
              
              <H2 className="mb-6 font-heading text-gray-800">
                Certified <span className="text-yellow-600">Excellence</span>
              </H2>
              
              <Body className="text-gray-700 mb-8 leading-relaxed">
                Quality is not just a promise; it's verified by independent certifications. 
                We adhere to the strictest international and Indian standards for manufacturing, 
                safety, and environmental sustainability.
              </Body>
              
              <ul className="space-y-4">
                {[
                  "ISO 9001:2015 Quality Management System",
                  "ISO 14001:2015 Environmental Management",
                  "BIS Certification for Indian Standards",
                  "Fire Safety Certified (Class A Rating)",
                  "100% Recyclable Product Line"
                ].map((cert, i) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 text-gray-700"
                  >
                    <div className="w-6 h-6 rounded-full bg-yellow-50 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-yellow-600" />
                    </div>
                    {cert}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
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
            <GlassCard className="text-center py-16 px-8 relative overflow-hidden border-yellow-100">
              {/* Background Gradient */}
              <div className="absolute inset-0 bg-linear-to-r from-yellow-50 via-transparent to-yellow-50 -z-10" />
              
              <div className="max-w-2xl mx-auto">
                <Award className="w-12 h-12 text-yellow-600 mx-auto mb-6" />
                
                <H2 className="mb-4 font-heading text-gray-800">
                  Partner With <span className="text-yellow-600">India's Best</span>
                </H2>
                
                <p className="text-gray-700 mb-8 text-lg">
                  Join our network of 500+ dealers and contractors. Experience reliable supply, 
                  competitive pricing, and dedicated support.
                </p>
                
                <div className="flex flex-wrap justify-center gap-4">
                  <Link to="/dealer">
                    <Button variant="primary" size="lg" className="bg-yellow-600 hover:bg-yellow-700 text-white">
                      Become a Dealer
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                  <Link to="/contact">
                    <Button variant="outline" size="lg" className="border-yellow-600 text-yellow-600 hover:bg-yellow-50">
                      Contact Sales
                    </Button>
                  </Link>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;

