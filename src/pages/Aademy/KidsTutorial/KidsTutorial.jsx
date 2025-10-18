import React from "react";

/* ---------- image imports ---------- */
import leftKid from "@images/left-kid.png";
import rightKid from "@images/right-kid.png";
import rightLogo from "@images/right-logo.png";
// import spiral from "@images/spiral.png";
import { ArrowRight } from "lucide-react";


export default function KidsTutorial() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans overflow-visible">
      <HeroSection />
      <FeaturesSection />
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

         
        </div>

        
      </div>
    </section>
  );
}


//*****************fearures  section ************//



const FeaturesSection = () => {
  const features = [
    {
      title: "Fun Quiz",
      description:
        "Test your understanding with a short but fun quizzes!",
      icon: "📘",
      bg: "from-purple-100 to-purple-200",
      shape: "bg-purple-300/60"
    },
    {
      title: "Creative Activities",
      description:
        "Discover enjoyable activities such as coloring,crafting, and science.",
      icon: "💡",
       bg: "from-purple-400 to-purple-500 text-white",
       shape: "bg-yellow-200/70",
    },
    {
      title: "Learn with Games",
      description:
        "Learn something new while your kids playing games!",
      icon: "🎮",
      bg: "from-yellow-200 to-yellow-300",
      shape: "bg-pink-300/60",

    },
  ];

  return (
    <section className="relative py-20 bg-gradient-to-b from-[#FFF8F3] to-white overflow-hidden">
      {/* Background shapes */}
      <div className="absolute -top-10 -left-10 w-32 h-32 bg-yellow-200 rounded-full opacity-40 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-pink-200 rounded-full opacity-30 blur-2xl"></div>

      <div className="container mx-auto px-6 md:px-16">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Our <span className="text-purple-500">interactive</span> features
          </h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            We bring joy and creativity into learning. Each tutorial is designed
            to inspire curiosity and confidence in every child.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${feature.bg} rounded-3xl shadow-lg hover:shadow-xl transition-all p-8 text-center relative`}
            >

 {/* Zigzag circle background for icon */}
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div
                  className={`absolute inset-0 rounded-full ${feature.shape} animate-pulse`}
                  style={{
                    clipPath:
                      "polygon(50% 0%, 65% 10%, 80% 0%, 100% 15%, 90% 35%, 100% 50%, 90% 65%, 100% 85%, 80% 100%, 65% 90%, 50% 100%, 35% 90%, 20% 100%, 0% 85%, 10% 65%, 0% 50%, 10% 35%, 0% 15%, 20% 0%, 35% 10%)",
                  }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center text-4xl">
                  {feature.icon}
                </div>
              </div>


              
              <div className="text-5xl mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


