import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { FaRobot, FaBitcoin, FaShieldAlt, FaFireAlt, FaBolt, FaGlobe } from "react-icons/fa";
import { FaLocationArrow } from "react-icons/fa6";

export default function ClientSection() {
   const ref = useRef(null);
   const { scrollYProgress } = useScroll({
      target: ref,
      offset: ["start end", "end start"],
   });

   // Scroll-based motion effects
   const effectiveY = useTransform(scrollYProgress, [0, 1], [-60, 0]);
   const effectiveX = useTransform(scrollYProgress, [0, 1], [-60, 0]);
   const securityY = useTransform(scrollYProgress, [0, 1], [60, 0]);
   const securityX = useTransform(scrollYProgress, [0, 1], [60, 0]);

   const logosTop = [
      { name: "Sitemark", icon: <FaBolt /> },
      { name: "Bitstamp", icon: <FaBitcoin /> },
      { name: "FirstQuadrant", icon: <FaFireAlt /> },
      { name: "IGNITION", icon: <FaShieldAlt /> },
      { name: "Madrid", icon: <FaGlobe /> },
      { name: "Bitget", icon: <FaShieldAlt /> },
   ];

   const logosBottom = [
      { name: "SiteGPT", icon: <FaRobot /> },
      { name: "Ultra", icon: <FaBolt /> },
      { name: "SOLANA", icon: <FaFireAlt /> },
      { name: "Starwox", icon: <FaGlobe /> },
      { name: "Triplai", icon: <FaShieldAlt /> },
      { name: "ionz", icon: <FaRobot /> },
   ];

   return (
      <section
         ref={ref}
         className="relative w-full overflow-hidden py-10 bg-[#010315] text-white"
      >
         {/* Background gradient */}
         <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050517] to-[#050517]/80 pointer-events-none" />

         {/* Top sliding logos - moving left */}
         <div className="absolute top-1/3 w-full overflow-hidden">
            <div
               className="flex space-x-8 opacity-20"
               style={{
                  animation: 'slideLeft 20s linear infinite'
               }}
            >
               {[...logosTop, ...logosTop].map((item, i) => (
                  <div
                     key={`top-${i}`}
                     className="flex items-center gap-2 px-6 py-3 bg-[#0b0b1f] border border-[#3D3A48] rounded-2xl min-w-[150px] justify-center flex-shrink-0"
                  >
                     <span className="text-lg text-gray-300">{item.icon}</span>
                     <span className="font-medium text-2xl text-gray-400">{item.name}</span>
                  </div>
               ))}
            </div>
            <style>{`
               @keyframes slideLeft {
               0% { transform: translateX(0); }
               100% { transform: translateX(-50%); }
               }
               `}
            </style>
         </div>

         {/* Bottom sliding logos - moving right */}
         <div className="absolute top-2/3 w-full overflow-hidden">
            <div
               className="flex space-x-8 opacity-20"
               style={{
                  animation: 'slideRight 20s linear infinite'
               }}
            >
               {[...logosBottom, ...logosBottom].map((item, i) => (
                  <div
                     key={`bottom-${i}`}
                     className="flex items-center gap-2 px-6 py-3 bg-[#0b0b1f] border border-[#3D3A48] rounded-2xl min-w-[150px] justify-center flex-shrink-0"
                  >
                     <span className="text-lg text-gray-300">{item.icon}</span>
                     <span className="font-medium text-2xl text-gray-400">{item.name}</span>
                  </div>
               ))}
            </div>
            <style>{`
               @keyframes slideRight {
               0% { transform: translateX(-50%); }
               100% { transform: translateX(0); } }
               `}
            </style>
         </div>

         {/* Center Text with Diagonal Motion */}
         <div className="relative z-10 flex justify-center items-center min-h-[150px]">
            <div className="relative w-xl justify-center mx-auto flex flex-col items-center text-center z-10 min-h-[50px]">
               {/* Blur Background - subtle like the image */}
               <div className="absolute inset-0 bg-[#010315]/10 backdrop-blur-sm" />

               <motion.div
                  style={{
                     y: effectiveY,
                     x: effectiveX
                  }}
                  className="bg-[#0d0d2b] border border-[#2a2a4a] px-4 py-1 rounded-lg text-sm text-gray-300 shadow-lg flex items-center gap-2 absolute left-4 top-4 md:left-8 md:top-8 z-20"
               >
                  <span>Effective service</span>
                  <FaLocationArrow className="text-purple-400 text-xs" />
               </motion.div>

               {/* Main heading - smaller and centered */}
               <div className="w-full max-w-md h-50 flex items-center justify-center text-center text-xl md:text-3xl font-semibold z-20 relative">
                  <span className="text-purple-400">300K Clients</span> worldwide
               </div>

               {/* Fast security - comes from bottom-right */}
               <motion.div
                  style={{
                     y: securityY,
                     x: securityX
                  }}
                  className="bg-[#0d0d2b] border border-[#2a2a4a] px-4 py-1 rounded-lg text-sm text-gray-300 shadow-lg flex items-center gap-2 absolute right-4 bottom-4 md:right-8 md:bottom-8 z-20"
               >
                  <FaLocationArrow className="text-green-400 text-xs" />
                  <span>Fast security</span>
               </motion.div>
            </div>
         </div>
      </section>
   );
}