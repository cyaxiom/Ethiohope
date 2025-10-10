// src/components/About/Contact/ContactForm.jsx
import React, { useRef, useEffect, useState } from "react";
import contactleftside from "../../../assets/images/contact/contactleftside.png";
import contactrightside from "../../../assets/images/contact/contactrightside.png";
// import ContactformBg from "../../../assets/images/contact/contactFormBg.png";
// import bg from "../../../assets/images/contact/bg.png";

const ContactForm = () => {
   const sectionRef = useRef(null);
   const [scrollDirection, setScrollDirection] = useState('down');
   const [lastScrollY, setLastScrollY] = useState(0);

   useEffect(() => {
      let ticking = false;
      const handleScroll = () => {
         if (!ticking) {
            window.requestAnimationFrame(() => {
               const currentScrollY = window.scrollY;
               if (currentScrollY > lastScrollY) {
                  setScrollDirection('down');
               } else if (currentScrollY < lastScrollY) {
                  setScrollDirection('up');
               }
               setLastScrollY(currentScrollY);
               ticking = false;
            });
            ticking = true;
         }
      };
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
         window.removeEventListener('scroll', handleScroll);
      };
   }, [lastScrollY]);

   return (
      <section
         className=" max-w-full max-[1024px]:px-20 max-[600px]:px-0 bg-[#0B0B29]"
         ref={sectionRef}
        
      >
         
         <div className="relative rounded-xl mx-5  bg-[#1D1D3E]">
            {/* Side Images with smooth scroll animation */}
            <div className="hidden md:block lg:block xl:block"
            >
               <img
                  src={contactleftside}
                  alt="left decoration"
                  className="absolute -left-6 top-1/3 w-45"
                  style={{
                     transition: 'transform 1.6s cubic-bezier(0.55, 0, 0.1, 1)',
                     transform:
                        scrollDirection === 'down'
                           ? 'translateY(-16px)'
                           : 'translateY(16px)'
                  }}
               />

               <img
                  src={contactrightside}
                  alt="right decoration"
                  className="absolute -right-5 top-1/3 w-45"
                  style={{
                     transition: 'transform 3.6s cubic-bezier(0.55, 0, 0.1, 1)',
                     transform:
                        scrollDirection === 'down'
                           ? 'translateY(16px)'
                           : 'translateY(-16px)'
                  }}
               />
            </div>
            <div className="rounded-2xl p-8 md:p-12 max-w-4xl md:max-w-sm lg:max-w-2xl xl:max-w-4xl mx-auto relative z-1">
               <h3 className="text-3xl md:text-4xl font-bold mb-8 text-center text-white">Contact with Cyaxiom</h3>
               <form className="space-y-6  ">
                  <div className="grid lg:grid-cols-2 gap-6">
                     <input
                        type="text"
                        placeholder="Enter Name"
                        className="p-4 rounded-xl bg-[#0B0B29] text-white outline-none border  focus:border-[#3C12D4] transition-colors"
                     />
                     <input
                        type="email"
                        placeholder="Enter Mail"
                        className="p-4 rounded-xl bg-[#0B0B29] text-white outline-none border  focus:border-[#3C12D4] transition-colors"
                     />
                  </div>
                  <textarea
                     placeholder="Enter your message..."
                     rows="6"
                     className="w-full p-4 rounded-xl bg-[#0B0B29] text-white outline-none border  focus:border-[#3C12D4] transition-colors"
                  />
                  <div className="text-center">
                     <button
                        type="submit"
                        className="px-8 py-4 bg-gradient bg-[#3C12D4] rounded-xl text-white font-bold cursor-pointer transition-all transform"
                     >
                        Send Message
                     </button>
                  </div>
               </form>
            </div>
         </div>
      </section>
   );
};

export default ContactForm;