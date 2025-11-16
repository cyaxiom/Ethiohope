import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "@provider/ThemeProvider/ThemeProvider";

import leftKid from "../assets/images/left-kid.png";
import rightKid from "../assets/images/right-kid.png";
import rightLogo from "../assets/images/right-logo.png";

export default function HeroSection() {
  const { isDark } = useTheme();

  return (
    <section className="relative pt-24 md:pt-28 pb-20 px-4 overflow-hidden bg-muted/30 dark:bg-muted/60">
      
      {/* floating images */}
      <motion.img
        src={rightLogo}
        alt="logo"
        className="absolute top-[120px] right-[80px] w-[120px] md:w-[150px] lg:w-[180px] pointer-events-none opacity-90"
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      <motion.img
        src={leftKid}
        alt="left kid"
        className="absolute top-[90px] left-[140px] md:left-[200px] w-[90px] md:w-[120px] lg:w-[140px] object-contain"
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 3.4, repeat: Infinity }}
      />

      <motion.img
        src={rightKid}
        alt="right kid"
        className="absolute bottom-[60px] right-[180px] md:right-[250px] w-[100px] md:w-[130px] lg:w-[150px] object-contain"
        animate={{ y: [0, -16, 0] }}
        transition={{ duration: 3.8, repeat: Infinity }}
      />

      {/* text center */}
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <h1 className={`text-4xl md:text-5xl font-extrabold leading-tight ${isDark ? "text-foreground" : "text-gray-900"}`}>
          The best place to{" "}
          <span className="text-[#7b5cff] italic font-extrabold">learn</span>{" "}
          and{" "}
          <span className="text-[#ffb22c] italic font-extrabold">play</span>{" "}
          for kids
        </h1>
        <p className={`mt-6 text-base md:text-lg max-w-md mx-auto ${isDark ? "text-muted-foreground" : "text-gray-600"}`}>
          Discover thousands of fun and interactive learning activities to
          support children's growth and learning process.
        </p>
      </div>
    </section>
  );
}
