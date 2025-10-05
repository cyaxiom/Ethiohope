import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from "./GetInTouch.module.css";
import getIntouchicon from "../../../assets/images/contact/getIntouchicons.png";
import getIntouchicon2 from "../../../assets/images/contact/getIntouchicon2.png";
import getIntouchicon3 from "../../../assets/images/contact/getIntouchicon3.png";
import getIntouchicon4 from "../../../assets/images/contact/getIntouchicon4.png";
import getintouchBg from "../../../assets/images/contact/getintouchBg.png"

const GetInTouch = () => {
   const sectionRef = useRef(null);
   const icon1Ref = useRef(null);
   const icon2Ref = useRef(null);
   const icon3Ref = useRef(null);
   const icon4Ref = useRef(null);
   const rafId = useRef(null);

   useEffect(() => {
      let ticking = false;

      const calculateProgress = () => {
         if (!sectionRef.current) return 0;

         const section = sectionRef.current;
         const rect = section.getBoundingClientRect();
         const windowHeight = window.innerHeight;

         // Calculate progress based on section's position in viewport
         const sectionStart = windowHeight;
         const sectionEnd = -rect.height;
         const currentPosition = rect.top;

         let progress = (sectionStart - currentPosition) / (sectionStart - sectionEnd);
         return Math.max(0, Math.min(1, progress)); // Clamp between 0 and 1
      };

      const updateAnimations = () => {
         if (!ticking) {
            ticking = true;
            rafId.current = requestAnimationFrame(() => {
               const progress = calculateProgress();

               // Animate icons with GSAP
               const maxMovement = 100; // Original movement range
               gsap.to(icon1Ref.current, {
                  y: progress * maxMovement, // Down
                  duration: 0.8,
                  ease: "power1.out",
               });
               gsap.to(icon2Ref.current, {
                  y: -progress * maxMovement, // Up
                  duration: 0.8,
                  ease: "power1.out",
               });
               gsap.to(icon3Ref.current, {
                  x: -progress * maxMovement, // Left
                  duration: 0.8,
                  ease: "power1.out",
               });
               gsap.to(icon4Ref.current, {
                  x: progress * maxMovement, // Right
                  duration: 0.8,
                  ease: "power1.out",
               });

               ticking = false;
            });
         }
      };

      // Initial calculation
      updateAnimations();

      window.addEventListener('scroll', updateAnimations, { passive: true });
      window.addEventListener('resize', updateAnimations);

      return () => {
         if (rafId.current) {
            cancelAnimationFrame(rafId.current);
         }
         window.removeEventListener('scroll', updateAnimations);
         window.removeEventListener('resize', updateAnimations);
      };
   }, []);

   return (
      <section
         ref={sectionRef}
         className="relative h-[100vh] w-full bg-[#0B0B29] !pt-40 flex flex-col items-center justify-center text-white overflow-hidden"
         style={{
            backgroundImage: `url(${getintouchBg})`,
            backgroundColor: '#0B0B29',
            backgroundPosition: 'left',
            backgroundRepeat: 'no-repeat',
         }}
      >
         <div className="h-[50vh]  border-b w-full">
            {/* Animated Icons */}
            <img
               ref={icon1Ref}
               src={getIntouchicon}
               alt="icon1"
               className={`${styles.floatIcon} absolute top-1/5 left-1/14 w-20 hidden md:block`}
            />
            <img
               ref={icon2Ref}
               src={getIntouchicon3}
               alt="icon2"
               className={`${styles.floatIcon} absolute top-1/3 right-1/14 w-20 hidden md:block`}
            />
            <img
               ref={icon3Ref}
               src={getIntouchicon2}
               alt="icon3"
               className={`${styles.floatIcon} absolute bottom-1/4 left-1/6 w-24 hidden md:block`}
            />
            <img
               ref={icon4Ref}
               src={getIntouchicon4}
               alt="icon4"
               className={`${styles.floatIcon} absolute bottom-1/4 right-1/6 w-24 hidden md:block`}
            />

            {/* Title */}
            <div className="text-center mb-16 relative z-10">
               <h2 className="text-6xl font-bold mb-4">Get in touch</h2>
               <p className="text-gray-300 text-lg">
                  <a href="/">Home</a> - Contact Us
               </p>
            </div>
         </div>
      </section>
   );
};

export default GetInTouch;