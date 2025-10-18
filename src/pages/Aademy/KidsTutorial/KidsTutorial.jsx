import React from "react";

/* ---------- image imports ---------- */
import leftKid from "@images/left-kid.png";
import rightKid from "@images/right-kid.png";
import rightLogo from "@images/right-logo.png";
// import spiral from "@images/spiral.png";
import { ArrowRight } from "lucide-react";
import learningMaterial from "@images/learning-material.png";
import missionOne from "@images/mission-one.png";
import missionTwo from "@images/mission-two.png";
import missionThree from "@images/mission-three.png";
import missionFour from "@images/mission-four.png";
import blogOne from "@images/blog-one.png";
import blogTwo from "@images/blog-two.png";
import blogThree from "@images/blog-three.png";
import { Plus } from "lucide-react";



export default function KidsTutorial() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans overflow-visible">
      <HeroSection />
      <FeaturesSection />
      <LearningMaterials/>
      <MissionSection/>
      <BlogSection/>
      <FAQSection/>
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


// ************Learning materials section **********//





export  function LearningMaterials() {
  return (
    <section className="relative overflow-hidden py-24 md:py-28 bg-white">
      {/* ---------- Decorative Background Elements ---------- */}
      <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-purple-100 rounded-full blur-3xl opacity-50 -z-10" />
      <div className="absolute bottom-0 left-0 w-[180px] h-[180px] bg-yellow-100 rounded-full blur-3xl opacity-50 -z-10" />

      {/* ---------- Content Container ---------- */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 flex flex-col-reverse md:flex-row items-center justify-between gap-12">
        {/* ---------- Left Text Section ---------- */}
        <div className="md:w-1/2 text-center md:text-left space-y-6">
          <h2 className="text-3xl md:text-5xl font-bold leading-snug text-gray-900">
            The learning materials
            provided are{" "}
            <span className="relative inline-block">
              <span className="text-[#7b5cff] italic font-semibold relative z-10">
                enjoyable
              </span>
              <span className="absolute left-0 bottom-1 w-full h-3 bg-[#ffb22c] rounded-full -z-0 transform -rotate-2"></span>
            </span>
            <br /> for children
          </h2>

          <p className="text-gray-600 max-w-md mx-auto md:mx-0">
            Don’t worry! Your children will be having a fun time while learning
            with our materials that are easy to understand.
          </p>

          {/* ---------- CTA Button ---------- */}
          <a
            href="#learn-more"
            className="inline-flex items-center gap-3 border border-[#7b5cff] text-[#7b5cff] hover:bg-[#f4f0ff] px-6 py-3 rounded-full font-medium transition shadow-sm"
          >
            <span>Learn more</span>

            {/* Arrow with circular background */}
            <span className="relative flex items-center justify-center w-7 h-7 rounded-full bg-[#7b5cff]">
              <ArrowRight
                className="w-4 h-4 text-white transform rotate-[330deg]"
                strokeWidth={2.5}
              />
            </span>
          </a>
        </div>

        {/* ---------- Right Image Section ---------- */}
        <div className="md:w-1/2 flex justify-center relative">
          <img
            src={learningMaterial}
            alt="Children enjoying learning materials"
            className="w-full max-w-lg md:max-w-xl object-contain"
          />
        </div>
      </div>
    </section>
  );
}

// ******mission section *****//



export  function MissionSection() {
  const missions = [
    { name: "Kristin Watson", title: "Science Teacher", image: missionOne },
    { name: "Jenny Wilson", title: "Drawing Teacher", image: missionTwo },
    { name: "Jacob Jones", title: "Math Teacher", image: missionThree },
    { name: "Savannah Nguyen", title: "Reading Teacher", image: missionFour },
  ];

  return (
    <section className="relative py-24 bg-[#7b5cff]/5 text-gray-900 text-center overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <h2 className="text-3xl md:text-5xl font-bold leading-snug text-gray-900">
          We aim to help children <br />
          <span className="text-[#ffb22c] italic font-semibold">
            discover the joy of creative
          </span>{" "}
          <br />
          learning and grow into well-rounded individuals.
        </h2>

        {/* Teacher cards */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 justify-items-center">
          {missions.map((person, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center bg-white rounded-3xl shadow-md p-6 hover:shadow-lg transition"
            >
              <img
                src={person.image}
                alt={person.name}
                className="w-28 h-28 object-contain mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-800">
                {person.name}
              </h3>
              <p className="text-sm text-gray-500">{person.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


// ***********Blog section **********//



export  function BlogSection() {
  const blogs = [
    {
      title: "Learning with Games? Why not!",
      description: "Embrace the joy of games to enhance your learning experience!",
      image: blogOne,
    },
    {
      title: "10 Learning Game Ideas",
      description: "10 ideas for learning with for your kids to have fun.",
      image: blogTwo,
    },
    {
      title: "Fun Activities for Kids",
      description: "Want to do something outside from your laptop? Here are our recommendations.",
      image: blogThree,
    },
  ];

  return (
    <section className="py-24 bg-white text-gray-900">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        {/* Heading */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Read our <span className="text-[#7b5cff] italic font-semibold">blog</span>
          </h2>
          <a
            href="#"
            className="flex items-center gap-2 text-[#7b5cff] hover:underline font-medium mt-4 md:mt-0"
          >
            See all 
            {/* Arrow with circular background */}
            <span className="relative flex items-center justify-center w-7 h-7 rounded-full bg-[#7b5cff]">
              <ArrowRight
                className="w-4 h-4 text-white transform rotate-[330deg]"
                strokeWidth={2.5}
              />
            </span>
          </a>
        </div>

        {/* Blog Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {blogs.map((blog, idx) => (
            <div
              key={idx}
              className="bg-[#faf7ff] rounded-3xl shadow-sm hover:shadow-md transition overflow-hidden"
            >
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {blog.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{blog.description}</p>
                <a
                  href="#"
                  className="flex items-center gap-2 text-[#7b5cff] font-medium hover:underline"
                >
                  Learn more 
                  {/* Arrow with circular background */}
            <span className="relative flex items-center justify-center w-7 h-7 rounded-full bg-[#7b5cff]">
              <ArrowRight
                className="w-4 h-4 text-white transform rotate-[330deg]"
                strokeWidth={2.5}
              />
            </span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


// ***********FAQs section ************************//


export  function FAQSection() {
  const faqs = [
    {
      q: "What makes WonderKids different from other education platforms?",
    },
    {
      q: "How can I access WonderKids?",
    },
    {
      q: "What about the security of children’s data using this platform?",
    },
  ];

  return (
    <section className="relative py-24 bg-white text-gray-900">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
          Frequently <span className="text-[#7b5cff] italic font-semibold">asked</span> questions
        </h2>

        <div className="space-y-4">
          {faqs.map((item, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center bg-[#faf7ff] hover:bg-[#f3edff] transition rounded-full px-6 py-4 cursor-pointer shadow-sm"
            >
              <span className="text-gray-700 font-medium">{item.q}</span>
              <Plus className="w-5 h-5 text-[#7b5cff]" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
