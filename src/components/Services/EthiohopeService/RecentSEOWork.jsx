import React from "react";
import seosectionimg from '../../../assets/images/services/EthiohopeService/seosectionimg.png';
import styles from './styles/Hero.module.css';
import {
   FaNetworkWired,
   FaCloud,
   FaDatabase,
   FaShieldAlt,
   FaIndustry,
} from "react-icons/fa";
import { GoChevronRight } from 'react-icons/go';

const ResentSEOSection = () => {
   const scrollToServices = () => {
      const servicesSection = document.getElementById('services-section');
      if (servicesSection) {
         servicesSection.scrollIntoView({ behavior: 'smooth' });
      }
   };
   return (
      <section className="relative mx-8 bg-[#010315] text-white py-20 overflow-hidden">
         {/* Section Header */}
         <div className="text-center mb-16">
            <span className="text-sm tracking-widest text-center flex justify-center items-center rounded-2xl border-amber-50 text-white">
               <FaDatabase className='text-blue-400' />
               Services
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-3">
               Our Recent SEO Work
            </h2>
         </div>

         {/* Main Container */}
         <div className="relative w-full flex flex-col justify-center items-center min-h-screen">
            {/* Background Image */}
            <div
               className="absolute -inset-20 "
               style={{
                  backgroundImage: `url(${seosectionimg})`,
                  backgroundPosition: 'bottom',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'auto 450px',
                  opacity: 0.8, // Optional: adjust opacity to make cards more readable
               }}
            ></div>

            {/* Top 3 Cards */}
            <div className="relative w-full grid grid-cols-1 lg:grid-cols-3 gap-4 px-6 mx-auto mb-10 z-20">
               {/* Card 1 */}
               <div className="bg-[#080A1B] p-8 rounded-2xl border border-[#1f1f3a] min-h-[300px] cursor-pointer hover:border-blue-400 transition-all duration-300 z-30">
                  <div className="text-[#B6B7BC] hover:text-[#2F157D] text-3xl mb-4 transition-colors duration-300">
                     <FaNetworkWired />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Secure Your Network</h3>
                  <ul className="space-y-2 text-[#99b2cb] text-[14px]">
                     <li className="flex items-start">
                        <span className="text-white mr-2">✦</span>
                        Consistently Secure the Enterprise.
                     </li>
                     <li className="flex items-start">
                        <span className="text-white mr-2">✦</span>
                        Apply AI inline to prevent evasive.
                     </li>
                     <li className="flex items-start">
                        <span className="text-white mr-2">✦</span>
                        Simplify network security operations.
                     </li>
                     <li className="flex items-start">
                        <span className="text-white mr-2">✦</span>
                        Adopt Zero Trust across the network.
                     </li>
                     <li className="flex items-start">
                        <span className="text-white mr-2">✦</span>
                        Simplify with AI-Powered SASE.
                     </li>
                  </ul>
               </div>

               {/* Card 2 */}
               <div className="bg-[#080A1B] p-8 rounded-2xl border border-[#1f1f3a] min-h-[320px] cursor-pointer hover:border-blue-400 transition-all duration-300 z-30">
                  <div className="text-[#B6B7BC] hover:text-[#2F157D] text-3xl mb-4 transition-colors duration-300">
                     <FaCloud />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Secure Your Cloud</h3>
                  <ul className="space-y-2 text-[#99b2cb] text-[14px]">
                     <li className="flex items-start">
                        <span className="text-white mr-2">✦</span>
                        End-to-End Cloud Security.
                     </li>
                     <li className="flex items-start">
                        <span className="text-white mr-2">✦</span>
                        Real-Time Threat Detection.
                     </li>
                     <li className="flex items-start">
                        <span className="text-white mr-2">✦</span>
                        Identity & Access Management.
                     </li>
                     <li className="flex items-start">
                        <span className="text-white mr-2">✦</span>
                        Data Encryption & Privacy.
                     </li>
                     <li className="flex items-start">
                        <span className="text-white mr-2">✦</span>
                        Compliance & Governance.
                     </li>
                  </ul>
               </div>

               {/* Card 3 */}
               <div className="bg-[#080A1B] p-8 rounded-2xl border border-[#1f1f3a] min-h-[320px] cursor-pointer hover:border-blue-400 transition-all duration-300 z-30">
                  <div className="text-[#B6B7BC] hover:text-[#2F157D] text-3xl mb-4 transition-colors duration-300">
                     <FaDatabase />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Data Source Identification</h3>
                  <ul className="space-y-2 text-[#99b2cb] text-[14px]">
                     <li className="flex items-start">
                        <span className="text-white mr-2">✦</span>
                        Accelerate Threat Detection.
                     </li>
                     <li className="flex items-start">
                        <span className="text-white mr-2">✦</span>
                        Automate Security Processes.
                     </li>
                     <li className="flex items-start">
                        <span className="text-white mr-2">✦</span>
                        Streamline Incident Response.
                     </li>
                     <li className="flex items-start">
                        <span className="text-white mr-2">✦</span>
                        Attack Surface Management.
                     </li>
                     <li className="flex items-start">
                        <span className="text-white mr-2">✦</span>
                        Integrated Security Monitoring.
                     </li>
                  </ul>
               </div>
            </div>

            {/* Bottom Section */}
            <div className="relative w-full grid justify-between px-6 gap-4 lg:grid-cols-3 z-20 grid-cols-1">
               {/* Left Card */}
               <div className="bg-[#080A1B] p-8 rounded-2xl border border-[#1f1f3a] min-h-[300px] cursor-pointer hover:border-blue-400 transition-all duration-300 z-30">
                  <div className="text-[#B6B7BC] hover:text-[#2F157D] text-3xl mb-4 transition-colors duration-300">
                     <FaShieldAlt />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Threat Intel & Response</h3>
                  <ul className="space-y-2 text-[#99b2cb] text-[14px]">
                     <li className="flex items-start">
                        <span className="text-white mr-2">✦</span>
                        Let our experts be of your team.
                     </li>
                     <li className="flex items-start">
                        <span className="text-white mr-2">✦</span>
                        Move from reactive to proactive.
                     </li>
                     <li className="flex items-start">
                        <span className="text-white mr-2">✦</span>
                        Get world-class threat intelligence.
                     </li>
                     <li className="flex items-start">
                        <span className="text-white mr-2">✦</span>
                        Every second counts when attack.
                     </li>
                     <li className="flex items-start">
                        <span className="text-white mr-2">✦</span>
                        Make our experience your experience.
                     </li>
                  </ul>
               </div>

               {/* Empty div for grid spacing */}
               <div className="z-30"></div>

               {/* Right Card */}
               <div className="bg-[#080A1B] p-8 rounded-2xl border border-[#1f1f3a] min-h-[320px] cursor-pointer hover:border-blue-400 transition-all duration-300 z-30">
                  <div className="text-[#B6B7BC] hover:text-[#2F157D] text-3xl mb-4 transition-colors duration-300">
                     <FaIndustry />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Solutions By Industry</h3>
                  <ul className="space-y-2 text-[#99b2cb] text-[14px]">
                     <li className="flex items-start">
                        <span className="text-white mr-2">✦</span>
                        Public sector
                     </li>
                     <li className="flex items-start">
                        <span className="text-white mr-2">✦</span>
                        Financial services
                     </li>
                     <li className="flex items-start">
                        <span className="text-white mr-2">✦</span>
                        Manufacturing
                     </li>
                     <li className="flex items-start">
                        <span className="text-white mr-2">✦</span>
                        Small & medium business solutions
                     </li>
                     <li className="flex items-start">
                        <span className="text-white mr-2">✦</span>
                        Healthcare
                     </li>
                  </ul>
               </div>
            </div>
         </div>

         {/* CTA */}
         <div className="flex justify-center mt-10 relative z-10">
            <button
               onClick={scrollToServices}
               className={`text-white ... max-md:mx-auto ${styles.ctaButton} flex gap-8 items-center justify-center`}
            >
               <span className="block">Get started now</span>
               <GoChevronRight className="inline-block ml-2 justify-end" />
            </button>
         </div>
      </section>
   );
};

export default ResentSEOSection;