import React from 'react';
import CoursePathsSection from './components/CoursePathsSection';
import CoursesSection from './components/CoursesSection';
import CTASection from './components/CTASection';
import FeaturesSection from './components/FeaturesSection';
import HeroSection from './components/HeroSection';
import ToolsSection from './components/ToolsSection';
import VideoSection from './components/VideoSection';
import WhyCodeSection from './components/WhyCoding';
React;

function KidsProgramming() {
  return (
    <div className="w-full overflow-x-hidden">
      <HeroSection />
      <VideoSection />
      <CoursesSection />
      <WhyCodeSection />
      <FeaturesSection />
      <ToolsSection />
      <CoursePathsSection />
      <CTASection />
    </div>
  );
}

export default KidsProgramming;
