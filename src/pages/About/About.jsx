import React from 'react';
import AboutUsSection from './components/AboutUsSection';
import CultureSection from './components/CultureSection';
import HeroSection from './components/HeroSection';
import NewsSection from './components/NewsSection';
import PartnersSection from './components/PartnersSection';
import TeamSection from './components/TeamSection';
import ValuesSection from './components/ValuesSection';
React;

// ...existing code...
function About() {
  return (
    <div className="w-full bg-background overflow-x-hidden">
      <HeroSection />
      <AboutUsSection />
      <ValuesSection />
      <PartnersSection />
      <CultureSection />
      <TeamSection />
      <NewsSection />
    </div>
  );
}

export default About;