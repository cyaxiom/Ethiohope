import React from "react";
import { motion } from "framer-motion";

const HeroSection = () => {
  // Standard background for the section - using the EXACT same class as SpecialitiesSection
  const sectionBgClass = 'bg-muted/30 dark:bg-muted/60';
  
  return (
    <section className={`relative pt-20 pb-20 px-4 md:px-12 overflow-hidden ${sectionBgClass}`}>
      {/* Decorative gradients - similar to SpecialitiesSection */}
      <div className="absolute top-0 left-0 w-1/2 h-1/2 pointer-events-none z-0">
        <div className="w-72 h-72 rounded-full blur-3xl opacity-30 bg-blue-300 dark:bg-blue-700"></div>
      </div>
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 pointer-events-none z-0">
        <div className="w-72 h-72 rounded-full blur-3xl opacity-30 bg-purple-300 dark:bg-purple-700"></div>
      </div>
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
        {/* Left Text */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
            Coding Courses <span className="text-green-600 dark:text-green-400">For Kids</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto md:mx-0 mb-6">
            Ethiohope is an online coding platform that helps your kids learn
            coding in the most engaging way and improves their creativity.
            Explore courses based on age, skill level, and interest.
          </p>
          <button className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold shadow-md transition-all duration-300">
            Book Your Free Trial
          </button>
        </div>

        {/* Right Image */}
        <div>
          <motion.img
            src="/heroimgKids.png"
            alt="Kids Coding Hero"
            className="w-full max-w-md"
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
