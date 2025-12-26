import React from 'react';
import AboutUsSection from './components/AboutUsSection';
import CultureSection from './components/CultureSection';
import HeroSection from './components/HeroSection';
import NewsSection from './components/NewsSection';
import PartnersSection from './components/PartnersSection';
import TeamSection from './components/TeamSection';
import ValuesSection from './components/ValuesSection';

function About() {
  return (
    <div className="w-full overflow-x-hidden bg-muted/30 dark:bg-muted/60 pt-20">
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