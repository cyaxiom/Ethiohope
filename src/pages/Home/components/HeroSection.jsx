import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const images = [
  "/heroimgKids.png",
  "/LittleCoder.png",
  "/LittleCoder1.png",
  "/LittleCoder2.png"
];

const backgroundImages = [
  "/hero_bg_1.png",
  "/hero_bg_2.png",
  "/hero_bg_3.png"
];

const HeroSection = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Automatically cycle through images every 6 seconds for a smooth background transition
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Map the current index to background images
  const bgIndex = currentIndex % backgroundImages.length;

  return (
    <section className="relative min-h-[95vh] flex items-center justify-center pt-20 pb-20 px-4 md:px-12 overflow-hidden">
      {/* Background Carousel */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={bgIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('${backgroundImages[bgIndex]}')` }}
          />
        </AnimatePresence>
        {/* Persistent Dark Overlay for Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80 z-10"></div>
      </div>
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-20 w-full">
        {/* Left Text */}
        <div className="flex-1 text-center md:text-left text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <span className="inline-block px-5 py-2 mb-8 text-xs font-black tracking-[0.2em] uppercase bg-primary/20 border border-primary/40 rounded-full text-white backdrop-blur-md shadow-[0_0_15px_rgba(123,92,255,0.3)]">
              Transforming Future Creators
            </span>
            <h1 className="text-5xl md:text-8xl font-black mb-8 leading-[1.1] drop-shadow-2xl">
              Where Kids <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-accent animate-gradient-x">Build The Future</span>
            </h1>
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-8">
              <button 
                onClick={() => document.getElementById('popular-programs')?.scrollIntoView({ behavior: 'smooth' })}
                className="group relative px-12 py-5 bg-primary text-white font-black text-xl rounded-2xl shadow-[0_10px_30px_rgba(123,92,255,0.5)] transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden"
              >
                <span className="relative z-10">Explore Courses</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Right Foreground Carousel */}
        <div className="flex-1 relative flex justify-center items-center h-[500px] w-full max-w-lg">
           <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.8, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 1.1, x: -50 }}
              transition={{ duration: 0.8, ease: "anticipate" }}
              className="relative w-full h-full flex justify-center items-center"
            >
              {/* Decorative Glow */}
              <div className="absolute inset-0 bg-primary/30 rounded-full blur-[120px] animate-pulse"></div>
              
              <img
                src={images[currentIndex]}
                alt="Kids Coding"
                className="w-full max-w-sm relative z-10 drop-shadow-[0_20px_60px_rgba(0,0,0,0.5)] object-contain h-full"
              />
              
              {/* Floating glassmorphism cards */}
              <motion.div 
                animate={{ y: [0, -20, 0], rotate: [0, 2, 0] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="absolute top-10 right-0 backdrop-blur-xl bg-white/5 p-5 rounded-3xl shadow-2xl z-20 hidden sm:block border border-white/10"
              >
                <div className="flex items-center gap-4">
                  <div className="w-5 h-5 rounded-full bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.6)]"></div>
                  <span className="text-sm font-black text-white uppercase tracking-tighter">Live Session</span>
                </div>
              </motion.div>
              
              <motion.div 
                animate={{ y: [0, 20, 0], rotate: [0, -2, 0] }}
                transition={{ repeat: Infinity, duration: 5, delay: 1 }}
                className="absolute bottom-10 left-0 backdrop-blur-xl bg-white/5 p-5 rounded-3xl shadow-2xl z-20 hidden sm:block border border-white/10"
              >
                <div className="flex items-center gap-4">
                  <div className="w-5 h-5 rounded-full bg-primary shadow-[0_0_20px_rgba(123,92,255,0.6)]"></div>
                  <span className="text-sm font-black text-white uppercase tracking-tighter">Gamified UI</span>
                </div>
              </motion.div>
            </motion.div>
           </AnimatePresence>
           
           {/* Modern Slider Indicators */}
           <div className="absolute bottom-[-30px] flex gap-4">
             {images.map((_, i) => (
               <button
                 key={i}
                 onClick={() => setCurrentIndex(i)}
                 className={`h-2 transition-all duration-700 rounded-full ${currentIndex === i ? "bg-primary w-12" : "bg-white/20 w-4 hover:bg-white/50"}`}
                 aria-label={`Switch to slide ${i + 1}`}
               />
             ))}
           </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
