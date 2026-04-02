import React from 'react';
import HeroSection from '../Aademy/KidsProgramming/components/HeroSection';
import VideoSection from '../Aademy/KidsProgramming/components/VideoSection';
import CoursesSection from '../Aademy/KidsProgramming/components/CoursesSection';
import WhyCodeSection from '../Aademy/KidsProgramming/components/WhyCoding';
import SpecialitiesSection from '../Aademy/KidsProgramming/components/SpecialitiesSection';
import ProjectsShowcaseSection from '../Aademy/KidsProgramming/components/ProjectsShowcaseSection';
import FeaturesSection from '../Aademy/KidsProgramming/components/FeaturesSection';
import CTASection from '../Aademy/KidsProgramming/components/CTASection';
import FromTheCrowd from '../Aademy/KidsProgramming/components/Article';

import Growth from '@components/Home/Growth';
import Stats from '@components/Home/Stats';

function Home() {
  return (
    <div className="w-full overflow-x-hidden pt-20 bg-muted/30 dark:bg-muted/60 text-foreground">
      <HeroSection />
      <VideoSection />
      <CoursesSection />
      <WhyCodeSection />
      <SpecialitiesSection />
      
      {/* Newly added steps per request */}
      <Growth />
      <Stats />

      <ProjectsShowcaseSection />
      <FeaturesSection />
      <CTASection />
      <FromTheCrowd />
    </div>
  );
}

export default Home;
