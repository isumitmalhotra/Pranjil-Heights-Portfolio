import React from 'react';
import { Hero } from '../components/home/Hero';
import { CompanyIntro } from '../components/home/CompanyIntro';
import { ProductCategories } from '../components/home/ProductCategories';
import { FeaturesGrid } from '../components/home/FeaturesGrid';
import { DealerPartnershipCTA } from '../components/home/DealerPartnershipCTA';
import { Testimonials } from '../components/home/Testimonials';
import { CTASection } from '../components/home/CTASection';
import { SpotlightEffect } from '../components/ui/AnimatedBackground';

const Home = () => {
  return (
    <div className="relative bg-[#1B2A4A]">
      <SpotlightEffect />

      {/* Hero Section - Corporate brand statement */}
      <Hero />
      
      {/* Company Introduction - Who we are */}
      <CompanyIntro />
      
      {/* Product Categories - Clean category showcase */}
      <ProductCategories />
      
      {/* Features Grid - Why choose our products */}
      <FeaturesGrid />
      
      {/* Dealer Partnership - B2B focus */}
      <DealerPartnershipCTA />
      
      {/* Testimonials - Business partner quotes */}
      <Testimonials />
      
      {/* CTA Section - Final call to action */}
      <CTASection />
    </div>
  );
};

export default Home;

