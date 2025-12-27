import React from 'react';
import AboutUsSection from './components/AboutUsSection';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import CultureSection from './components/CultureSection';
import HeroSection from './components/HeroSection';
import NewsSection from './components/NewsSection';
import PartnersSection from './components/PartnersSection';
import TeamSection from './components/TeamSection';
import ValuesSection from './components/ValuesSection';


function AboutSummarySection() {
  return (
    <div className="w-full flex flex-col items-center justify-center py-12">
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          <Link to="/about" className="block">
            <Card className="bg-card p-8 rounded-2xl border border-border min-h-[160px] cursor-pointer hover:border-primary hover:shadow-lg transition-all duration-300">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4">🏢</span>
            <h3 className="text-2xl font-bold">About Us</h3>
          </div>
          <p className="text-gray-500 mb-4">Our inspiring story and core values that drive us forward</p>
          <div className="flex items-center text-gray-400 text-sm mt-2"><span className="mr-2">🎖️</span>10+ Years Experience</div>
            </Card>
          </Link>
        <Link to="/about/teams" className="block">
          <Card className="bg-card p-8 rounded-2xl border border-border min-h-[160px] cursor-pointer hover:border-primary hover:shadow-lg transition-all duration-300">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4">👥</span>
            <h3 className="text-2xl font-bold">Team</h3>
          </div>
          <p className="text-gray-500 mb-4">Meet our talented professionals and experts</p>
          <div className="flex items-center text-gray-400 text-sm mt-2"><span className="mr-2">🎖️</span>50+ Members</div>
          </Card>
        </Link>
        <Link to="/about/contact" className="block">
          <Card className="bg-card p-8 rounded-2xl border border-border min-h-[160px] cursor-pointer hover:border-primary hover:shadow-lg transition-all duration-300">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4">📞</span>
            <h3 className="text-2xl font-bold">Contact</h3>
          </div>
          <p className="text-gray-500 mb-4">Get in touch with us for collaborations and inquiries</p>
          <div className="flex items-center text-gray-400 text-sm mt-2"><span className="mr-2">🎖️</span>24/7 Support</div>
          </Card>
        </Link>
      </div>
    </div>
  );
}

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