// src/components/About/Contact/ContactInfo.jsx
import React from "react";
import phoneCall from "../../../assets/images/contact/phoneCall.svg";
import mail from "../../../assets/images/contact/mail.svg";
import location from "../../../assets/images/contact/location.svg";
import { Card } from '@/components/ui/Card';

const ContactInfo = ({ darkMode }) => {
   return (
      <section className={`pt-2 flex flex-col max-[1024px]:px-20 max-[600px]:px-0 ${darkMode ? 'bg-[#0B0B29] text-white' : 'bg-gradient-to-br from-blue-50 via-green-50 to-white text-gray-800'
         }`}>
         {/* Contact Cards */}
         <div className="flex flex-col md:flex-row md:flex-wrap gap-5 w-full items-center px-6 justify-center">
            {/* Phone Number Section */}
            <Card className={`rounded-2xl px-12 py-8 pb-12 w-full md:w-[calc(50%-0.625rem)] custom-md:w-[calc(50%-0.625rem)] lg:w-[calc(33.333%-0.833rem)] ${darkMode ? 'bg-[#1D1D3E]' : 'bg-white border border-gray-200 shadow-lg'}`}>
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
                        +1 (945) 385-0556
                     </p>
                  </div>
               </div>
            </Card>

            {/* Mail Address Section */}
            <Card className={`rounded-2xl px-12 py-8 pb-12 w-full md:w-[calc(50%-0.625rem)] custom-md:w-[calc(50%-0.625rem)] lg:w-[calc(33.333%-0.833rem)] ${darkMode ? 'bg-[#1D1D3E]' : 'bg-white border border-gray-200 shadow-lg'}`}>
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
                        contact@ethiohope.com
                     </p>
                  </div>
               </div>
            </Card>

            {/* Location Section */}
            <Card className={`rounded-2xl px-12 py-8 pb-12 w-full md:w-[calc(50%-0.625rem)] custom-md:w-full lg:w-[calc(33.333%-0.833rem)] custom-md:max-w-[calc(50%-0.625rem)] custom-md:mx-auto ${darkMode ? 'bg-[#1D1D3E]' : 'bg-white border border-gray-200 shadow-lg'}`}>
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
                        USA
                     </p>
                  </div>
               </div>
            </Card>
         </div>

      </section>
   );
};

export default ContactInfo;