import React from "react";
import { useRef, useEffect } from "react";
import { motion, useMotionValue } from "framer-motion";
import {
   FaShoppingCart,
   FaBitcoin,
   FaTruck,
   FaCogs,
   FaHeartbeat,
   FaUniversity,
} from "react-icons/fa";
import { MdEnergySavingsLeaf } from "react-icons/md";
import { GiTeacher, GiFactory, GiTechnoHeart } from "react-icons/gi";
import about from "../../../assets/images/services/EthiohopeService/about.svg";
import { GoChevronRight } from "react-icons/go";
import { Link } from "react-router-dom";
import ctaImg1 from "../../../assets/images/services/EthiohopeService/ctaImg1.svg";
import ctaImg2 from "../../../assets/images/services/EthiohopeService/ctaImg2.svg";


const industries = [
   { title: "Manufacturing", icon: <GiFactory size={50} /> },
   { title: "Crypto", icon: <FaBitcoin size={50} /> },
   { title: "Logistics", icon: <FaTruck size={50} /> },
   { title: "Technology", icon: <GiTechnoHeart size={50} /> },
   { title: "Finance", icon: <FaCogs size={50} /> },
   { title: "Healthcare", icon: <FaHeartbeat size={50} /> },
   { title: "Government", icon: <FaUniversity size={50} /> },
   { title: "E-Commerce", icon: <FaShoppingCart size={50} /> },
   { title: "Energy", icon: <MdEnergySavingsLeaf size={50} /> },
   { title: "Education", icon: <GiTeacher size={50} /> },
];

export default function IndustriesSection() {
   const containerRef = useRef(null);
   const x = useMotionValue(0);

   // Width of one full loop (card width + gap)
   const CARD_WIDTH = 260;
   const GAP = 24;
   const LOOP_WIDTH = (CARD_WIDTH + GAP) * industries.length;

   // Enhanced infinite loop logic
   useEffect(() => {
      const unsubscribe = x.on("change", (latest) => {
         if (latest <= -LOOP_WIDTH) {
            x.set(latest + LOOP_WIDTH);
         } else if (latest >= 0) {
            x.set(latest - LOOP_WIDTH);
         }
      });
      return () => unsubscribe();
   }, [x, LOOP_WIDTH]);

   // Create seamless loop with 3 copies
   const loopIndustries = [...industries, ...industries, ...industries];
   const scrollToServices = () => {
      const servicesSection = document.getElementById("services-section");
      if (servicesSection) {
         servicesSection.scrollIntoView({ behavior: "smooth" });
      }
   };
   return (
      <section className="bg-[#010315] py-20 text-center text-white overflow-hidden">
         <div className="inline-block mb-6 ">
            <span className="px-3 py-1 bg-[#151727] rounded-full flex justify-between gap-2 border border-[#6e6c75] text-sm">
               <img src={about} alt="" />
               Industries we work
            </span>
         </div>

         <h2 className="text-5xl font-bold mt-4">
            Serving Diverse Industries
         </h2>

         {/* Infinite Drag Scroll Container */}
         <div
            ref={containerRef}
            className="relative mt-12 overflow-hidden"
         >
            <motion.div
               className="flex gap-6 px-6 w-max"
               style={{ x }}
               drag="x"
               dragElastic={0.1}
               dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
               whileTap={{ cursor: "grabbing" }}
            >
               {loopIndustries.map((item, index) => (
                  <motion.div
                     key={index}
                     className="w-[400px] h-[220px] flex flex-col justify-center items-center rounded-2xl 
                         bg-gradient-to-b from-[#343140] to-[#1A1440] 
                         border border-gray-700 
                         hover:from-[#1A1440] hover:to-[#1A2B70]"
                  // whileHover={{ scale: 1.05 }}
                  // whileTap={{ scale: 0.95 }}
                  >
                     <div className="text-purple-300 text-2xl mb-3">{item.icon}</div>
                     <h3 className="font-semibold text-white text-3xl justify-bottom">{item.title}</h3>
                  </motion.div>
               ))}
            </motion.div>
         </div>

         <Link to="/#/">
            <div
               style={{
                  backgroundImage: `url("${ctaImg2}")`,
                  backgroundPosition: "center",
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  fontSize: "20px",
                  width: "280px",
                  height: "160px",
                  transition: "background-image 300ms ease",
               }}
               className="flex justify-center mt-1 mx-auto relative z-10 hover:bg-contain hover:bg-left hover:bg-no-repeat"
               onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundImage = `url("${ctaImg1}")`;
               }}
               onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundImage = `url("${ctaImg2}")`;
               }}
            >
               <button
                  onClick={scrollToServices}
                  className="text-white max-md:mx-auto flex gap-10 items-center cursor-pointer py-4 pl-6 justify-center"
               >
                  <span className="block text-center pl-4">Get started now</span>
                  <GoChevronRight className="inline-block ml-2 justify-end" />
               </button>
            </div>
         </Link>
      </section>
   );
}