import React, { useEffect, useRef, useState } from 'react';
import Hero1 from '../../../assets/images/services/EthiohopeService/hero1.png';
import TopImage from '../../../assets/images/services/EthiohopeService/heroTop.png';
import LeftImage from '../../../assets/images/services/EthiohopeService/heroLeft.png';
import RightImage from '../../../assets/images/services/EthiohopeService/heroRight.png';
import { FaArrowRight } from 'react-icons/fa';
import styles from './styles/Hero.module.css';
import hero2 from '../../../assets/images/services/EthiohopeService/hero2.png';
import hero3 from '../../../assets/images/services/EthiohopeService/hero3.png';

const Hero = () => {
   const canvasRef = useRef(null);
   const [displayText, setDisplayText] = useState('');
   const fullText = "Securing";

   useEffect(() => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      let animationFrameId;

      // Set canvas size
      const resizeCanvas = () => {
         canvas.width = canvas.offsetWidth;
         canvas.height = canvas.offsetHeight;
      };

      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);

      // Create stars with independent movement patterns
      const stars = [];
      const starCount = 300;

      class Star {
         constructor() {
            this.reset();
            // Random starting position
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
         }

         reset() {
            // Base position (center of movement area)
            this.baseX = Math.random() * canvas.width;
            this.baseY = Math.random() * canvas.height;

            // Movement parameters
            this.angle = Math.random() * Math.PI * 2;
            this.radius = Math.random() * 15 + 5; // Movement radius
            this.speed = Math.random() * 0.02 + 0.01; // Rotation speed

            // Visual properties
            this.size = Math.random() * 1.5 + 0.5;
            this.baseOpacity = Math.random() * 0.4 + 0.2;
            this.opacity = this.baseOpacity;

            // Pulsing animation
            this.pulseSpeed = Math.random() * 0.03 + 0.02;
            this.pulseDirection = 1;
            this.pulsePhase = Math.random() * Math.PI * 2;

            // Current position
            this.x = this.baseX + Math.cos(this.angle) * this.radius;
            this.y = this.baseY + Math.sin(this.angle) * this.radius;
         }

         update() {
            // Update angle for circular motion
            this.angle += this.speed;

            // Calculate new position around base point
            this.x = this.baseX + Math.cos(this.angle) * this.radius;
            this.y = this.baseY + Math.sin(this.angle) * this.radius;

            // Pulsing opacity effect
            this.pulsePhase += this.pulseSpeed;
            this.opacity = this.baseOpacity + Math.sin(this.pulsePhase) * 0.2;

            // Reset if star goes too far off screen
            if (this.x < -50 || this.x > canvas.width + 50 ||
               this.y < -50 || this.y > canvas.height + 50) {
               this.reset();
            }
         }

         draw(ctx) {
            ctx.save();
            ctx.globalAlpha = Math.max(0, this.opacity); // Ensure opacity doesn't go negative

            // Draw star with glow effect
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();

            // Add subtle glow
            if (this.opacity > 0.3) {
               ctx.beginPath();
               ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
               const gradient = ctx.createRadialGradient(
                  this.x, this.y, this.size,
                  this.x, this.y, this.size * 2
               );
               gradient.addColorStop(0, `rgba(100, 200, 255, ${this.opacity * 0.3})`);
               gradient.addColorStop(1, 'rgba(100, 200, 255, 0)');
               ctx.fillStyle = gradient;
               ctx.fill();
            }

            ctx.restore();
         }
      }

      // Initialize stars
      for (let i = 0; i < starCount; i++) {
         stars.push(new Star());
      }

      // Animation function
      const animate = () => {
         ctx.clearRect(0, 0, canvas.width, canvas.height);

         // Update and draw stars
         stars.forEach(star => {
            star.update();
            star.draw(ctx);
         });

         animationFrameId = requestAnimationFrame(animate);
      };

      animate();

      // Clean up
      return () => {
         cancelAnimationFrame(animationFrameId);
         window.removeEventListener('resize', resizeCanvas);
      };
   }, []);


   useEffect(() => {
      let currentIndex = 0;
      const typingInterval = setInterval(() => {
         if (currentIndex <= fullText.length) {
            setDisplayText(fullText.slice(0, currentIndex));
            currentIndex++;
         } else {
            clearInterval(typingInterval);
         }
      }, 60);

      return () => clearInterval(typingInterval);
   }, []);


   const scrollToServices = () => {
      const servicesSection = document.getElementById('services-section');
      if (servicesSection) {
         servicesSection.scrollIntoView({ behavior: 'smooth' });
      }
   };

   return (

      <>
         <div
            className="relative min-h-screen  overflow-hidden"
            style={{
               backgroundImage: `url(${Hero1})`,
               backgroundSize: 'cover',
               backgroundPosition: 'center',
               backgroundRepeat: 'no-repeat',
            }}

         >
            {/* Animated stars background */}
            <canvas
               ref={canvasRef}
               className="absolute inset-0 w-full h-full"
            />


            {/* Top  Image */}
            <div className="absolute top-0 left-0 right-0 z-10 ">
               <img
                  src={TopImage}
                  alt="Security icon"
                  className=""
               />
            </div>

            {/*  left  Image */}
            <div className="absolute  !left-0 z-10  ">
               <img
                  src={LeftImage}
                  alt="Security icon"
                  className=" "
               />
            </div>

            {/*  Right  Image */}
            <div className="absolute right-0 z-10  ">
               <img
                  src={RightImage}
                  alt="Security icon"
                  className=""
               />
            </div>





            {/* Hero Content */}
            <div className="relative mx-auto md:max-w-4xl xl:max-w-6xl !pt-[180px] px-6 min-h-[calc(100vh-80px)]">
               <div className="flex flex-col  justify-start">
                  <div className='flex justify-start'>
                     <h1 className="text-[80px] md:text-[120px] lg:text-[140px] xl:text-[180px] mb-6 leading-tight uppercase font-medium tracking-[0.2em] inline-block bg-gradient-to-b from-white to-[#292152] bg-clip-text text-transparent font-stretch-ultra-condensed"

                     >
                        {displayText}

                     </h1>
                  </div>
                  <div className='lg:flex lg:justify-between  lg:items-center '>
                     <p className="lg:text-3xl md:text-2xl xl:text-4xl text-gray-300 mb-8 max-w-2xl capitalize font-medium ">
                        Your Organization's Digital Landscape From Cyber Risks
                     </p>
                     <button
                        onClick={scrollToServices}
                        className={`text-white relative cursor-pointer flex justify-around items-center  font-semibold py-3 px-8   transition-all duration-300 transform hover:scale-105 z-50   ${styles.ctaButton}`}
                     >
                        <span> Explore Solutions</span> <FaArrowRight className="inline-block ml-2" />
                     </button>
                  </div>
               </div>
            </div>
            <div className="relative bg-transparent py-8">
               <div className="mx-auto  px-6 flex flex-col  justify-between items-center -">
                  <img
                     src={hero3}
                     alt="Bottom image 1"
                     className="max-w-4xl"
                  />
                  <img
                     src={hero2}
                     alt="Bottom image 2"
                     className="w-full  "
                  />
               </div>
            </div>
         </div>



      </>
   );
};

export default Hero;