import React from 'react';
import { Hero } from '../components/home/Hero';
import { CompanyIntro } from '../components/home/CompanyIntro';
import { ProductCategories } from '../components/home/ProductCategories';
import { FeaturesGrid } from '../components/home/FeaturesGrid';
import { ManufacturingExcellence } from '../components/home/ManufacturingExcellence';
import { ClientLogos } from '../components/home/ClientLogos';
import { DealerPartnershipCTA } from '../components/home/DealerPartnershipCTA';
import { Testimonials } from '../components/home/Testimonials';
import { CTASection } from '../components/home/CTASection';
import { DiamondDivider, AccentDivider } from '../components/ui/SectionDivider';

const Home = () => {
  return (
    <div className="relative bg-white">
      {/* Hero Section - Corporate brand statement */}
      <Hero />
      
      {/* Company Introduction - Who we are */}
      <CompanyIntro />
      
      <DiamondDivider />
      
      {/* Product Categories - Clean category showcase */}
      <ProductCategories />
      
      <AccentDivider />
      
      {/* Features Grid - Why choose our products */}
      <FeaturesGrid />
      
      <DiamondDivider />
      
      {/* Manufacturing Excellence - Factory & quality */}
      <ManufacturingExcellence />
      
      <AccentDivider />
      
      {/* Client Logos - Social proof */}
      <ClientLogos />
      
      <DiamondDivider />
      
      {/* Dealer Partnership - B2B focus */}
      <DealerPartnershipCTA />
      
      <AccentDivider />
      
      {/* Testimonials - Business partner quotes */}
      <Testimonials />
      
      <DiamondDivider />
      
      {/* CTA Section - Final call to action */}
      <CTASection />
    </div>
  );
};

export default Home;

