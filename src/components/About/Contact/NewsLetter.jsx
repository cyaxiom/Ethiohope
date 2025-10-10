// src/components/About/Contact/NewsLetter.jsx
import React, { useEffect, useRef } from 'react';
import pdf from "../../../assets/images/contact/pdf.svg";
import { HiOutlineCloudArrowDown } from "react-icons/hi2";
import getintouchicon5 from "../../../assets/images/contact/getIntouchicon5.png";
import { FaTelegramPlane, FaTwitter } from "react-icons/fa";
import { GrFacebookOption } from "react-icons/gr";
import { IoLogoTwitter } from "react-icons/io5";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import {Link} from 'react-router-dom'; 


const Newsletter = () => {
   const iconRef = useRef(null);
   const lastScrollY = useRef(0);
   const animationFrameId = useRef(null);

   useEffect(() => {
      const handleScroll = () => {
         if (animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current);
         }

         animationFrameId.current = requestAnimationFrame(() => {
            const currentScrollY = window.scrollY;
            const scrollDelta = currentScrollY - lastScrollY.current;
            const scrollSpeed = Math.min(Math.abs(scrollDelta) * 0.5, 100); // Limit max speed
            
            if (iconRef.current) {
               const currentTransform = window.getComputedStyle(iconRef.current).transform;
               let currentTranslateX = 0;
               
               // Parse current translateX value from transform matrix
               if (currentTransform && currentTransform !== 'none') {
                  const matrix = new DOMMatrixReadOnly(currentTransform);
                  currentTranslateX = matrix.m41;
               }
               
               // Calculate new position based on scroll direction and speed
               let newTranslateX = currentTranslateX;
               
               if (scrollDelta > 0) {
                  // Scrolling down - move to right
                  newTranslateX += scrollSpeed;
               } else if (scrollDelta < 0) {
                  // Scrolling up - move to left
                  newTranslateX -= scrollSpeed;
               }
               
               // Apply boundaries to prevent icon from moving too far
               const maxMovement = 20; // Maximum movement in pixels
               newTranslateX = Math.max(-maxMovement, Math.min(maxMovement, newTranslateX));
               
               iconRef.current.style.transform = `translateX(${newTranslateX}px)`;
            }
            
            lastScrollY.current = currentScrollY;
         });
      };

      // Throttled scroll event listener
      window.addEventListener('scroll', handleScroll, { passive: true });
      
      return () => {
         if (animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current);
         }
         window.removeEventListener('scroll', handleScroll);
      };
   }, []);

   return (
      <section className="w-full bg-[#0B0B29] bg-gradient-to-br from-[#0D0C2E] from-0% via-[#0D0C2E] via-5% to-[#0B0B29] to-5%  max-[1024px]:px-20 max-[600px]:px-0">
         <div className="flex justify-end max-[1200px]:hidden overflow-hidden pr-4">
            <img 
               ref={iconRef}
               src={getintouchicon5} 
               alt="Get in Touch Icon" 
               className="w-20 h-20 transition-transform duration-75 ease-linear" 
            />
         </div>
         <div className="w-full  px-6 items-start lg:justify-between lg:flex-row max-[1200px]:pt-10 flex flex-col gap-4">
            {/* Newsletter Section */}
            <div className="text-white w-80 ">
               <h3 className="text-2xl font-bold mb-15 text-white">Subscribe newsletter</h3>
               <p className="text-gray-400 mb-6 leading-relaxed">
                  Pre-ICOs typically offer early access to the project's tokens before the main ICO.
               </p>
               <div className="flex max-w-full rounded-xl bg-[#1D1D3E]">
                  <input
                     type="email"
                     placeholder="coindox@gmail.com"
                     className="flex-1 p-4 text-white border-none outline-none bg-transparent"
                  />
                  <button className="p-4 bg-[#3C12D4] rounded-xl cursor-pointer">
                     <FaTelegramPlane className='h-8 w-8' />
                  </button>
               </div>
            </div>

            {/* Documents Section */}
            <div className="text-[#8E8E9F] ">
               <h3 className="text-2xl w-full flex lg:justify-end font-bold mb-15 text-[#FFFFFF]">Download Documents</h3>
               <div className="flex gap-1.5 flex-wrap lg:justify-end">
                  <button className="block bg-[#1D1D3E] p-8 lg:p-6 xl:p-8 rounded-xl  hover:text-white   text-center ">
                     <img src={pdf} alt="PDF Icon" className="inline-block w-7 mr-2" />
                     <div className="flex items-center justify-center gap-1">
                        <HiOutlineCloudArrowDown className='w-5 h-5 mt-4' />
                        <span className="block text-sm font-semibold pt-4 uppercase">White Paper</span>
                     </div>
                  </button>
                  <button className="bg-[#1D1D3E] p-8 lg:p-6 xl:p-8 rounded-xl hover:text-white   text-center">
                     <img src={pdf} alt="PDF Icon" className="inline-block w-7 mr-2" />
                     <div className="flex items-center justify-center gap-1">
                        <HiOutlineCloudArrowDown className='w-5 h-5 mt-4' />
                        <span className="block text-sm font-semibold pt-4 uppercase">One Paper</span>
                     </div>
                  </button>
                  <button className="bg-[#1D1D3E] p-8 lg:p-6 xl:p-8 rounded-xl hover:text-white   text-center">
                     <img src={pdf} alt="PDF Icon" className="inline-block w-7 mr-2" />
                     <div className="flex items-center justify-center gap-1">
                        <HiOutlineCloudArrowDown className='w-5 h-5 mt-4' />
                        <span className="block text-sm font-semibold pt-4 uppercase">Privacy Policy</span>
                     </div>
                  </button>
                  <button className="bg-[#1D1D3E] p-8 lg:p-6 xl:p-8 rounded-xl hover:text-white   text-center">
                     <img src={pdf} alt="PDF Icon" className="inline-block w-7 mr-2" />
                     <div className="flex items-center justify-center gap-1">
                        <HiOutlineCloudArrowDown className='w-5 h-5 mt-4' />
                        <span className="block text-sm font-semibold pt-4 uppercase">Terms of Sale</span>
                     </div>
                  </button>
               </div>
            </div>
         </div>
         <div className="w-full  px-6 py-8 flex max-[468px]:flex-col   max-[468px]:items-start ">
            <Link to='/' className="flex items-center space-x-3 cursor-pointer">
               <div className="w-7 h-7 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">C</span>
               </div>
               <span className="text-foreground font-bold text-xl tracking-tight">
                  Ethiohope
               </span>
            </Link>
            <div className="flex space-x-2 mt-4 text-white text-xl w-full justify-end max-[468px]:justify-start">
               <span className="p-3 bg-[#1D1D3E] rounded-lg cursor-pointer hover:bg-[#3C12D4] inline-flex items-center justify-center">
                  <GrFacebookOption className="w-4 h-4" />
               </span>
               <span className="p-3 bg-[#1D1D3E] rounded-lg cursor-pointer hover:bg-[#3C12D4] inline-flex items-center justify-center">
                  <IoLogoTwitter className="w-4 h-4" />
               </span>
               <span className="p-3 bg-[#1D1D3E] rounded-lg cursor-pointer hover:bg-[#3C12D4] inline-flex items-center justify-center">
                  <FaInstagram className="w-4 h-4" />
               </span>
               <span className="p-3 bg-[#1D1D3E] rounded-lg cursor-pointer hover:bg-[#3C12D4] inline-flex items-center justify-center">
                  <FaLinkedinIn className="w-4 h-4" />
               </span>
               <span className="p-3 bg-[#1D1D3E] rounded-lg cursor-pointer hover:bg-[#3C12D4] inline-flex items-center justify-center">
                  <FaTelegramPlane className="w-4 h-4" />
               </span>

            </div>
         </div>
      </section>
   );
};

export default Newsletter;