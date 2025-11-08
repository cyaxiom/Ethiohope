import React from "react";
import leftKid from "../assets/images/left-kid.png";
import rightKid from "../assets/images/right-kid.png";
import rightLogo from "../assets/images/right-logo.png";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-24 md:pt-28 pb-20">
      <div className="absolute top-0 left-0 w-full h-[420px] bg-gradient-to-b from-white to-[#fdfbff]" />

      <img
        src={rightLogo}
        alt="decorative logo"
        className="absolute top-[120px] right-[80px] w-[120px] md:w-[150px] lg:w-[180px] opacity-90 brightness-110 contrast-125 pointer-events-none"
      />
      <img
        src={leftKid}
        alt="Left Kid"
        className="absolute top-[90px] left-[140px] md:left-[200px] w-[90px] md:w-[120px] lg:w-[140px] object-contain"
      />
      <img
        src={rightKid}
        alt="Right Kid"
        className="absolute bottom-[60px] right-[180px] md:right-[250px] w-[100px] md:w-[130px] lg:w-[150px] object-contain"
      />

      <div className="relative z-10 max-w-3xl mx-auto text-center px-6 md:px-12">
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900">
          The best place to{" "}
          <span className="text-[#7b5cff] italic font-extrabold">learn</span>{" "}
          and{" "}
          <span className="text-[#ffb22c] italic font-extrabold">play</span>{" "}
          for kids
        </h1>
        <p className="mt-6 text-gray-600 text-base md:text-lg max-w-md mx-auto">
          Discover thousands of fun and interactive learning activities to
          support children’s growth and learning process.
        </p>
      </div>
    </section>
  );
}
