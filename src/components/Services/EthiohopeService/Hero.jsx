import React, { useEffect, useRef, useState } from 'react';
import Hero1 from '../../../assets/images/services/EthiohopeService/hero1.png';
import TopImage from '../../../assets/images/services/EthiohopeService/heroTop.png';
import LeftImage from '../../../assets/images/services/EthiohopeService/heroLeft.png';
import RightImage from '../../../assets/images/services/EthiohopeService/heroRight.png';
import styles from './styles/Hero.module.css';
import hero2 from '../../../assets/images/services/EthiohopeService/hero2.png';
import hero3 from '../../../assets/images/services/EthiohopeService/hero3.png';
import GlobeAnimation from './GlobeAnimation';
import { GoChevronRight } from "react-icons/go";
import { Link } from 'react-router-dom';

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
            className="relative min-h-screen justify-center overflow-hidden"
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
               className="absolute inset-0 w-full h-full pointer-events-none"
               aria-hidden="true"
            />
            {/* Decorative images - hide on small screens */}
            <div className="hidden md:block absolute top-0 left-0 right-0 z-10 pointer-events-none">
               <img src={TopImage} alt="Security top" className="w-full" />
            </div>
            <div className="hidden lg:block absolute left-0 z-10 pointer-events-none">
               <img src={LeftImage} alt="Security left" className="max-w-xs lg:max-w-sm" />
            </div>
            <div className="hidden lg:block absolute right-0 z-10 pointer-events-none">
               <img src={RightImage} alt="Security right" className="max-w-xs lg:max-w-sm" />
            </div>

            {/* Hero Content */}
            <div className="relative mx-auto md:max-w-4xl xl:max-w-6xl pt-36 px-6 min-h-[calc(100vh-60px)]">
               <div className="flex flex-col pb-8 text-center md:text-left justify-start">
                  <div className='flex justify-center md:justify-start'>
                     <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-4 leading-tight uppercase font-extrabold tracking-tight md:tracking-widest bg-gradient-to-b from-primary to-primary/80 bg-clip-text text-transparent">
                        {displayText}
                     </h1>
                  </div>
                  <div className="mt-4 lg:flex lg:justify-between lg:items-center md:items-start text-center lg:text-left">
                     <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 capitalize font-medium">
                        Protecting your organization's digital landscape from cyber risks.
                     </p>
                     <div className="mt-6 lg:mt-0">
                        <Link
                           to="/#/"
                           onClick={(e) => { e.preventDefault(); scrollToServices(); }}
                           className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground px-5 py-3 rounded-full shadow-lg hover:brightness-105 transition text-sm sm:text-base"
                           aria-label="Explore Solutions"
                        >
                           Explore Solutions
                           <GoChevronRight className="inline-block ml-1" />
                        </Link>
                     </div>
                  </div>
               </div>
            </div>
            <div className="relative bg-transparent p-8 md:p-10">
               <div className="mx-auto px-6 flex flex-col justify-between items-center">
                  {/* Replace static image with animated globe for GIF-like visual */}
                  <div className="w-full flex justify-center">
                     <div className="w-full">
                        <GlobeAnimation className="max-w-xl md:max-w-2xl lg:max-w-4xl" />
                     </div>
                  </div>
                  <img
                     src={hero2}
                     alt="Bottom decorative"
                     className="w-full mt-6 rounded-lg object-cover"
                  />
               </div>
            </div>
         </div>
      </>
   );
};

export default Hero;