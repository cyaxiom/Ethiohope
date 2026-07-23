import React from 'react';
import HeroSection from './components/HeroSection';
import VideoSection from './components/VideoSection';
import CoursesSection from './components/CoursesSection';
import WhyCodeSection from './components/WhyCoding';
import SpecialitiesSection from './components/SpecialitiesSection';
import FeaturesSection from './components/FeaturesSection';
import FromTheCrowd from './components/Article';

import Growth from '../../components/Home/Growth';
import Stats from '../../components/Home/Stats';

function Home() {
  return (
    <div className="w-full overflow-x-hidden pt-0 bg-[#070b16] text-slate-100">
      <HeroSection />
      <VideoSection />
      <CoursesSection />
      <WhyCodeSection />
      <SpecialitiesSection />
      
      {/* Newly added steps per request */}
      <Growth />
      <Stats />

      <FeaturesSection />
      <FromTheCrowd />
    </div>
  );
}

export default Home;
