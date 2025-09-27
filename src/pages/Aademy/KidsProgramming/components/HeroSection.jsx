import React from 'react';
import { motion } from 'framer-motion';
import image1 from '../assets/image.png';
import image2 from '../assets/image copy.png';
import image5 from '../assets/image copy 4.png';
React;

const HeroSection = () => {
  const heroimg = "/heroimgKids.png";

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden py-32 bg-gradient-to-br from-blue-50 via-green-50 to-white">
      {/* Floating Images (Left + Center only) */}
      <img
        src={image1}
        alt="Floating 1"
        className="absolute top-8 left-8 w-24 h-24 z-30"
        style={{ filter: 'drop-shadow(0 0 24px #60a5fa)' }}
      />
      <img
        src={image2}
        alt="Floating 2"
        className="absolute bottom-8 left-8 w-20 h-20 z-30"
        style={{ filter: 'drop-shadow(0 0 24px #34d399)' }}
      />
      <img
        src={image5}
        alt="Floating Center"
        className="absolute top-1/2 left-1/2 w-20 h-20 z-30"
        style={{
          transform: 'translate(-50%,-50%)',
          filter: 'drop-shadow(0 0 24px #fbbf24)'
        }}
      />

      {/* Color Overlays */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-br from-blue-400/20 via-green-300/10 to-transparent mix-blend-multiply"></div>
        <div className="absolute top-1/3 left-1/3 w-32 h-32 rounded-full bg-yellow-300/20 blur-2xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-40 container mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
        {/* Left Text */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="w-full md:w-1/2 text-left"
        >
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-green-500 to-green-700">
            Coding Courses
            <br />
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">For Kids</span>
          </h1>

          <p className="text-lg md:text-xl mb-6 text-muted-foreground leading-relaxed">
            Ethiohope is an online coding platform that helps your kids learn coding in the most engaging way and improve their creativity.
          </p>

          <p className="text-base md:text-lg mb-8 text-muted-foreground font-medium">
            Get instructor-led online coding classes for kids now.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg transition-all duration-300"
          >
            Book Your Free Trial
          </motion.button>
        </motion.div>

        {/* Right Hero Image */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, repeatType: "loop" }}
          className="w-full md:w-1/2 flex justify-center md:justify-end"
        >
          <div className="relative w-full max-w-md md:max-w-lg rounded-xl overflow-hidden shadow-2xl">
            <img
              src={heroimg}
              alt="Kid learning coding"
              className="w-full h-auto object-contain"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
