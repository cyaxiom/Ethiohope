import React from "react";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import luminous from "../../../assets/images/services/EthiohopeService/luminous.png";
import luminousQuadrantbg from "../../../assets/images/services/EthiohopeService/luminousQuadrantbg.png";
import bitstamp from "../../../assets/images/services/EthiohopeService/bitstamp.png";
import bitstampbg from "../../../assets/images/services/EthiohopeService/bitstampbg.png";
import santander from "../../../assets/images/services/EthiohopeService/santander.png";
import santanderbg from "../../../assets/images/services/EthiohopeService/santanderbg.png";
import FirstQuadrant from "../../../assets/images/services/EthiohopeService/firstQuadrant.png";
import FirstQuadrantbg from "../../../assets/images/services/EthiohopeService/luminousQuadrantbg.png";
import Madrid from "../../../assets/images/services/EthiohopeService/madrid.png";
import Madridbg from "../../../assets/images/services/EthiohopeService/madridbg.png";
import largearth from "../../../assets/images/services/EthiohopeService/largearth.png";
import customerstories from "../../../assets/images/services/EthiohopeService/customerstories.svg";

const customerStories = [
   {
      id: "luminous",
      logo: luminous,
      image: luminousQuadrantbg,
      title: "Luminous enhances data security.",
      quote:
         "With Innomax's real-time threat detection, our sensitive data is more secure than ever. Their team implemented advanced security measures, ensuring we meet all compliance requirements.",
      name: "Mike Davis",
      role: "CTO at Luminous",
      stat1: { value: "30 min", label: "to detect and neutralize threats, from 3+ hours." },
      stat2: { value: "99.8%", label: "Enhanced data protection with real-time monitoring." },
   },
   {
      id: "bitstamp",
      logo: bitstamp,
      image: bitstampbg,
      title: "Bitstamp scales globally with secure systems.",
      quote:
         "Innomax helped us achieve faster scaling with zero downtime. Their monitoring tools keep our trading platform stable and secure.",
      name: "Sarah Kim",
      role: "Head of Infrastructure at Bitstamp",
      stat1: { value: "45%", label: "Faster deployment cycles." },
      stat2: { value: "99.9%", label: "Uptime maintained globally." },
   },
   {
      id: "santander",
      logo: santander,
      image: santanderbg,
      title: "Santander optimizes cloud security.",
      quote:
         "Innomax's threat detection and compliance automation have streamlined our operations and improved customer trust.",
      name: "Javier Lopez",
      role: "CISO at Santander",
      stat1: { value: "70%", label: "Reduction in false positives." },
      stat2: { value: "3x", label: "Faster incident resolution." },
   },
   {
      id: "FirstQuadrant",
      logo: FirstQuadrant,
      image: FirstQuadrantbg,
      title: "First Quadrant boosts performance and security.",
      quote:
         "Innomax's solutions have significantly improved our system performance while ensuring top-notch security for our clients.",
      name: "Emily Chen",
      role: "CTO at First Quadrant",
      stat1: { value: "50%", label: "Improved system performance." },
      stat2: { value: "99.7%", label: "Enhanced security compliance." },
   },
   {
      id: "Madrid",
      logo: Madrid,
      image: Madridbg,
      title: "Madrid Tech secures global operations.",
      quote:
         "Thanks to Innomax, our global operations are now more secure and efficient, allowing us to focus on innovation.",
      name: "Carlos Ruiz",
      role: "CIO at Madrid Tech",
      stat1: { value: "60%", label: "Reduction in security incidents." },
      stat2: { value: "2x", label: "Faster deployment times." },
   }
];

export default function CustomerStories() {
   const [activeIndex, setActiveIndex] = useState(0);
   const globeRef = useRef(null);

   useEffect(() => {
      gsap.to(globeRef.current, {
         rotateY: 360,
         duration: 40,
         repeat: -1,
         ease: "linear",
         transformOrigin: "center center",
      });
   }, []);

   const nextStory = () =>
      setActiveIndex((prev) => (prev + 1) % customerStories.length);
   const prevStory = () =>
      setActiveIndex(
         (prev) => (prev - 1 + customerStories.length) % customerStories.length
      );

   const activeStory = customerStories[activeIndex];

   return (
      <section className="relative min-h-screen flex flex-col justify-evenly items-center bg-[#010315] overflow-hidden text-white px-6 py-16">
         {/* Rotating globe */}
         <div className="absolute inset-0 flex justify-center items-center">
            <motion.img
               ref={globeRef}
               src={largearth}
               alt="Rotating Globe"
               className="w-[700px] opacity-50 object-contain"
            />
         </div>

         {/* Header */}
         <div className="relative z-10 text-center mb-10">
            <div className="inline-block mb-6 ">
               <span className="px-3 py-1 bg-[#151727] rounded-full flex justify-between gap-2 border border-[#6e6c75] text-sm">
                  <img src={customerstories} alt="" />
                  Customer stories
               </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold">
               Our Amazing Customers.
            </h2>
         </div>

         {/* Story Card */}
         <motion.div
            key={activeStory.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 bg-[#0E1025]/80 backdrop-blur-md border border-[#24263C] rounded-xl flex flex-col md:flex-row w-full max-w-6xl overflow-hidden"
         >
            {/* Left: image */}
            <div className="md:w-1/2 relative">
               <img
                  src={activeStory.image}
                  alt={activeStory.title}
                  className="w-full h-full object-cover"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent p-6 flex flex-col justify-end">
                  <p className="text-sm uppercase tracking-wide text-gray-300 mb-2">
                     Customer Story
                  </p>
                  <img src={activeStory.logo} alt={activeStory.id} className="w-32 mb-2" />
                  <h3 className="text-lg font-semibold">{activeStory.title}</h3>
               </div>
            </div>

            {/* Right: text */}
            <div className="md:w-1/2 p-8 flex flex-col justify-center">
               <p className="text-lg leading-relaxed text-gray-200 mb-6">
                  “{activeStory.quote}”
               </p>

               <div className="mb-8">
                  <p className="font-semibold">{activeStory.name}</p>
                  <p className="text-gray-400 text-sm">{activeStory.role}</p>
               </div>

               <div className="grid grid-cols-2 gap-8 text-center md:text-left">
                  <div>
                     <p className="text-3xl font-bold text-white">
                        {activeStory.stat1.value}
                     </p>
                     <p className="text-sm text-gray-400">{activeStory.stat1.label}</p>
                  </div>
                  <div>
                     <p className="text-3xl font-bold text-white">
                        {activeStory.stat2.value}
                     </p>
                     <p className="text-sm text-gray-400">{activeStory.stat2.label}</p>
                  </div>
               </div>
            </div>

            {/* Navigation Arrows */}
            <button
               onClick={prevStory}
               className="absolute left-4 top-1/2 -translate-y-1/2 bg-purple-700/30 hover:bg-purple-700/50 text-white p-3 rounded-full"
            >
               <FaChevronLeft />
            </button>
            <button
               onClick={nextStory}
               className="absolute right-4 top-1/2 -translate-y-1/2 bg-purple-700/30 hover:bg-purple-700/50 text-white p-3 rounded-full"
            >
               <FaChevronRight />
            </button>
         </motion.div>

         {/* Bottom company logos (selectors) */}
         <div className="relative z-10 flex flex-wrap justify-center items-center gap-10 mt-16">
            {customerStories.map((story, index) => (
               <button
                  key={story.id}
                  onClick={() => setActiveIndex(index)}
                  className={`transition-all ${index === activeIndex
                     ? "opacity-100 scale-110 border-b-2 border-purple-500"
                     : "opacity-50 hover:opacity-80"
                     }`}
               >
                  <img src={story.logo} alt={story.id} className="h-8" />
               </button>
            ))}
         </div>
      </section>
   );
}
