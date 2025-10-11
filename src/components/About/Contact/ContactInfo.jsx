// src/components/About/Contact/ContactInfo.jsx
import React from "react";
import phoneCall from "../../../assets/images/contact/phoneCall.svg";
import mail from "../../../assets/images/contact/mail.svg";
import location from "../../../assets/images/contact/location.svg";

const ContactInfo = ({ darkMode }) => {
   return (
      <section className={`pt-2 flex flex-col max-[1024px]:px-20 max-[600px]:px-0 ${darkMode ? 'bg-[#0B0B29] text-white' : 'bg-gradient-to-br from-blue-50 via-green-50 to-white text-gray-800'
         }`}>
         {/* Contact Cards */}
         <div className="flex flex-col md:flex-row md:flex-wrap gap-5 w-full items-center px-6 justify-center">
            {/* Phone Number Section */}
            <div className={`rounded-2xl px-12 py-8 pb-12 w-full md:w-[calc(50%-0.625rem)] custom-md:w-[calc(50%-0.625rem)] lg:w-[calc(33.333%-0.833rem)] ${darkMode
               ? 'bg-[#1D1D3E]'
               : 'bg-white border border-gray-200 shadow-lg'
               }`}>
               <div className="text-center md:text-left">
                  <div className="flex my-12 gap-4 items-center justify-center md:justify-start">
                     <div className={`w-14 h-14 rounded-full flex items-center justify-center ${darkMode
                        ? 'bg-[#1D1D3E] border border-[#3e3d65]'
                        : 'bg-blue-50 border border-blue-200'
                        }`}>
                        <img
                           src={phoneCall}
                           alt="Phone Icon"
                           className={darkMode ? '' : 'filter brightness-0'}
                        />
                     </div>
                     <h3 className="text-xl font-bold">Phone Number</h3>
                  </div>
                  <div className="flex flex-col gap-2 items-center md:items-start">
                     <p className={`text-2xl md:text-xl xl:text-3xl font-bold cursor-pointer hover:underline ${darkMode ? 'text-white' : 'text-blue-600'
                        }`}>
                        +(555) 123-4567
                     </p>
                     <p className={`text-2xl md:text-xl xl:text-3xl font-bold cursor-pointer hover:underline ${darkMode ? 'text-white' : 'text-blue-600'
                        }`}>
                        +(555) 987-6543
                     </p>
                  </div>
               </div>
            </div>

            {/* Mail Address Section */}
            <div className={`rounded-2xl px-12 py-8 pb-12 w-full md:w-[calc(50%-0.625rem)] custom-md:w-[calc(50%-0.625rem)] lg:w-[calc(33.333%-0.833rem)] ${darkMode
               ? 'bg-[#1D1D3E]'
               : 'bg-white border border-gray-200 shadow-lg'
               }`}>
               <div className="text-center md:text-left">
                  <div className="flex my-12 gap-4 items-center justify-center md:justify-start">
                     <div className={`w-14 h-14 rounded-full flex items-center justify-center ${darkMode
                        ? 'bg-[#1D1D3E] border border-[#3e3d65]'
                        : 'bg-green-50 border border-green-200'
                        }`}>
                        <img
                           src={mail}
                           alt="Mail Icon"
                           className={darkMode ? '' : 'filter brightness-0'}
                        />
                     </div>
                     <h3 className="text-xl font-bold">Mail Address</h3>
                  </div>
                  <div className="flex flex-col gap-2 items-center md:items-start">
                     <p className={`text-2xl md:text-xl xl:text-3xl font-bold cursor-pointer hover:underline ${darkMode ? 'text-white' : 'text-green-600'
                        }`}>
                        coindox@gmail.com
                     </p>
                     <p className={`text-2xl md:text-xl xl:text-3xl font-bold cursor-pointer hover:underline ${darkMode ? 'text-white' : 'text-green-600'
                        }`}>
                        info@gmail.com
                     </p>
                  </div>
               </div>
            </div>

            {/* Location Section */}
            <div className={`rounded-2xl px-12 py-8 pb-12 w-full md:w-[calc(50%-0.625rem)] custom-md:w-full lg:w-[calc(33.333%-0.833rem)] custom-md:max-w-[calc(50%-0.625rem)] custom-md:mx-auto ${darkMode
               ? 'bg-[#1D1D3E]'
               : 'bg-white border border-gray-200 shadow-lg'
               }`}>
               <div className="text-center md:text-left">
                  <div className="flex my-12 gap-4 items-center justify-center md:justify-start">
                     <div className={`w-14 h-14 rounded-full flex items-center justify-center ${darkMode
                        ? 'bg-[#1D1D3E] border border-[#3e3d65]'
                        : 'bg-purple-50 border border-purple-200'
                        }`}>
                        <img
                           src={location}
                           alt="Location Icon"
                           className={darkMode ? '' : 'filter brightness-0'}
                        />
                     </div>
                     <h3 className="text-xl font-bold">Our Location</h3>
                  </div>
                  <div className="flex flex-col gap-2 items-center md:items-start">
                     <p className={`text-2xl md:text-xl xl:text-3xl font-bold ${darkMode ? 'text-white' : 'text-purple-600'
                        }`}>
                        123 Main Street
                     </p>
                     <p className={`text-2xl md:text-xl xl:text-3xl font-bold ${darkMode ? 'text-white' : 'text-purple-600'
                        }`}>
                        Anytown, CA 98765
                     </p>
                  </div>
               </div>
            </div>
         </div>

         {/* Map Section */}
         <div className="max-w-full px-6 pb-8 mt-8">
            <div className="h-lvh rounded-2xl overflow-hidden border-2">
               <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3914.60918922887!2d38.76125207485697!3d9.030258290862423!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85f80bcb6a7f%3A0x8a5c92a68bb9ffb!2sAddis%20Ababa%20Science%20and%20Technology%20University!5e0!3m2!1sen!2set!4v1695845590000&style=feature:all|element:labels|visibility:off&style=feature:landscape|color:0x000000&style=feature:road|color:0x111111&style=feature:water|color:0x000000"
                  width="100%"
                  height="100%"
                  style={{
                     border: 0,
                     filter: darkMode
                        ? "invert(90%) hue-rotate(180deg) brightness(85%) contrast(120%)"
                        : "none"
                  }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
               ></iframe>
            </div>
         </div>
      </section>
   );
};

export default ContactInfo;