import { useTheme } from '@provider/ThemeProvider/ThemeProvider';
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
  const { isDark } = useTheme();

  return (
    <div className="w-full overflow-x-hidden">
      <HeroSection darkMode={isDark} />
      <AboutUsSection darkMode={isDark} />
      <ValuesSection darkMode={isDark} />
      <PartnersSection darkMode={isDark} />
      <CultureSection darkMode={isDark} />
      <TeamSection darkMode={isDark} />
      <NewsSection darkMode={isDark} />
    </div>
  );
}

export default About;