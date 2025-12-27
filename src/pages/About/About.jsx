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


function AboutSummarySection() {
  return (
    <div className="w-full flex flex-col items-center justify-center py-12">
      <div className="w-full max-w-7xl px-4" style={{overflow: 'visible'}}>
        <div className="bg-gray-50 rounded-2xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Link to="/about" className="block">
          <div className="card bg-card p-8 rounded-2xl border-2 border-gray-100 min-h-[300px] cursor-pointer hover:border-primary transition-all duration-300 z-50 shadow-2xl overflow-hidden"
            style={{backgroundColor: '#ffffff', border: '2px solid rgba(31,41,55,0.06)', boxShadow: '0 30px 80px rgba(2,6,23,0.16)', marginBottom: '12px', outline: '4px dashed #ff00aa', background: '#fff'}}
            aria-label="About card">
            <div className="text-muted-foreground hover:text-primary text-3xl mb-4 transition-colors duration-300">🏢</div>
            <h3 className="text-2xl font-bold mb-4 text-foreground">About Us</h3>
            <p className="space-y-2 text-muted-foreground text-[14px] mb-4">Our inspiring story and core values that drive us forward</p>
            <div className="flex items-center text-muted-foreground text-sm mt-2"><span className="mr-2">🎖️</span>10+ Years Experience</div>
          </div>
        </Link>

        <Link to="/about/teams" className="block">
          <div className="card bg-card p-8 rounded-2xl border-2 border-gray-100 min-h-[300px] cursor-pointer hover:border-primary transition-all duration-300 z-50 shadow-2xl overflow-hidden"
            style={{backgroundColor: '#ffffff', border: '2px solid rgba(31,41,55,0.06)', boxShadow: '0 30px 80px rgba(2,6,23,0.16)', marginBottom: '12px', outline: '4px dashed #ff00aa', background: '#fff'}}
            aria-label="Team card">
            <div className="text-muted-foreground hover:text-primary text-3xl mb-4 transition-colors duration-300">👥</div>
            <h3 className="text-2xl font-bold mb-4 text-foreground">Team</h3>
            <p className="space-y-2 text-muted-foreground text-[14px] mb-4">Meet our talented professionals and experts</p>
            <div className="flex items-center text-muted-foreground text-sm mt-2"><span className="mr-2">🎖️</span>50+ Members</div>
          </div>
        </Link>

        <Link to="/about/contact" className="block">
          <div className="card bg-card p-8 rounded-2xl border-2 border-gray-100 min-h-[300px] cursor-pointer hover:border-primary transition-all duration-300 z-50 shadow-2xl overflow-hidden"
            style={{backgroundColor: '#ffffff', border: '2px solid rgba(31,41,55,0.06)', boxShadow: '0 30px 80px rgba(2,6,23,0.16)', marginBottom: '12px', outline: '4px dashed #ff00aa', background: '#fff'}}
            aria-label="Contact card">
            <div className="text-muted-foreground hover:text-primary text-3xl mb-4 transition-colors duration-300">📞</div>
            <h3 className="text-2xl font-bold mb-4 text-foreground">Contact</h3>
            <p className="space-y-2 text-muted-foreground text-[14px] mb-4">Get in touch with us for collaborations and inquiries</p>
            <div className="flex items-center text-muted-foreground text-sm mt-2"><span className="mr-2">🎖️</span>24/7 Support</div>
          </div>
        </Link>
          </div>
        </div>
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