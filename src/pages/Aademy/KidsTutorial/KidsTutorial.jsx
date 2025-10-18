import React from "react";

/* ---------- image imports ---------- */
import leftKid from "@images/left-kid.png";
import rightKid from "@images/right-kid.png";
import rightLogo from "@images/right-logo.png";
// import spiral from "@images/spiral.png";


export default function KidsTutorial() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans overflow-visible">
      <HeroSection />
    </div>
  );
}

/* ---------------- Hero Section ---------------- */
function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-24 md:pt-28 pb-20">
      {/* Background gradient */}
      <div className="absolute top-0 left-0 w-full h-[420px] bg-gradient-to-b from-white to-[#fdfbff]" />

      {/* Right decorative logo - slightly away from kid */}
      <img
  src={rightLogo}
  alt="decorative logo"
  className="absolute top-[120px] right-[80px] w-[120px] md:w-[150px] lg:w-[180px] opacity-90 brightness-110 contrast-125 pointer-events-none"
/>


      {/* Left Kid beside heading */}
      <img
        src={leftKid}
        alt="Left Kid"
        className="absolute top-[90px] left-[140px] md:left-[200px] w-[90px] md:w-[120px] lg:w-[140px] object-contain"
      />

      {/* Right Kid aligned right and balanced */}
      <img
        src={rightKid}
        alt="Right Kid"
        className="absolute bottom-[60px] right-[180px] md:right-[250px] w-[100px] md:w-[130px] lg:w-[150px] object-contain"
      />

      {/* Spiral just below the description */}
      {/* <img
        src={spiral}
        alt="spiral decorative pattern"
        className="absolute bottom-[150px] left-[50%] -translate-x-1/2 w-12 md:w-14 opacity-70"
      /> */}

      {/* ---------- Center Content ---------- */}
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

        {/* CTA buttons */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <a
            href="#features"
            className="inline-flex items-center gap-2 bg-[#7b5cff] hover:bg-[#6949e7] text-white px-6 py-3 rounded-full font-medium shadow-md transition"
          >
            <span>Get Started</span>
            <svg
              className="w-4 h-4 rotate-330"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </a>

          {/* <a
            href="#learn-more"
            className="text-sm text-gray-600 underline underline-offset-2"
          >
            Learn more
          </a> */}
        </div>

        {/* Feature tags
        <div className="mt-6 flex items-center justify-center gap-3">
          <span className="px-3 py-1 rounded-full bg-[#f5f3ff] text-[#6c5bd3] text-sm font-medium">
            Interactive
          </span>
          <span className="px-3 py-1 rounded-full bg-[#fff7e6] text-[#b77d1f] text-sm font-medium">
            Fun
          </span>
          <span className="px-3 py-1 rounded-full bg-[#e6f8ff] text-[#0077b6] text-sm font-medium">
            Safe
          </span>
        </div> */}
      </div>
    </section>
  );
}
