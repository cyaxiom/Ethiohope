import React from 'react';
// Debug log to verify HMR/dev server is using this file
if (typeof window !== 'undefined') console.log('DEV: About.jsx loaded');
import AboutUsSection from './components/AboutUsSection';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import CultureSection from './components/CultureSection';
import HeroSection from './components/HeroSection';
import NewsSection from './components/NewsSection';
import PartnersSection from './components/PartnersSection';
import TeamSection from './components/TeamSection';
import ValuesSection from './components/ValuesSection';


// About summary cards removed and moved to the Company page

function About() {
  return (
    <div className="w-full overflow-x-hidden bg-muted/30 dark:bg-muted/60 pt-20">
      <HeroSection />
      <AboutSummarySection />
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