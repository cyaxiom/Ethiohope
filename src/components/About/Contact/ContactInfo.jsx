// src/components/About/Contact/ContactInfo.jsx
import React from "react";
import phoneCall from "../../../assets/images/contact/phoneCall.svg";
import mail from "../../../assets/images/contact/mail.svg";
import location from "../../../assets/images/contact/location.svg";

const ContactInfo = () => {
   return (
      <section className="bg-[#0B0B29] text-white">
         <div className="grid md:grid-cols-3 gap-8 max-w-screen mx-auto px-6">
            <div className="bg-gradient-to-br bg-[#1D1D3E] rounded-2xl p-8   ">
               <div className="text-center pr-6">
                  <div className="flex my-12 items-center">
                     <div className="ml-15 mr-7 mb-4 w-15 h-15 rounded-full bg-[#1D1D3E] border border-[#3e3d65] flex items-center justify-center">
                        <img
                           src={phoneCall}
                           alt="Phone Icon"
                        />
                     </div>
                     <h3 className="text-xl font-bold mb-4">Phone Number</h3>
                  </div>
                  <p className="text-3xl cursor-pointer hover:underline">+(555) 123-4567</p>
                  <p className="text-3xl cursor-pointer hover:underline">+(555) 987-6543</p>
               </div>
            </div>

            <div className="bg-gradient-to-br bg-[#1D1D3E] rounded-2xl p-8 pb-10  ">
               <div className="text-center">
                  <div className="flex my-12 items-center">
                     <div className="mx-7 mb-4 w-15 h-15 rounded-full bg-[#1D1D3E] border border-[#3e3d65] flex items-center justify-center">
                        <img
                           src={mail}
                           alt="Mail Icon"
                        />
                     </div>
                     <h3 className="text-xl font-bold mb-4">Mail Address</h3>
                  </div>
                  <div className="flex flex-col gap-2  items-center">
                  <p className="text-3xl cursor-pointer hover:underline ">coindox@gmail.com</p>
                  <p className="text-3xl cursor-pointer hover:underline">info@gmail.com</p>
                  </div>
               </div>
            </div>

            <div className="bg-gradient-to-br bg-[#1D1D3E] rounded-2xl p-8">
               <div className="text-center">
                  <div className="flex my-12 items-center">
                     <div className="mx-7 mb-4 w-15 h-15 rounded-full bg-[#1D1D3E] border border-[#3e3d65] flex items-center justify-center">
                        <img
                           src={location}
                           alt="Location Icon"
                        />
                     </div>
                     <h3 className="text-xl font-bold mb-4">Our Location</h3>
                  </div>
                  <p className="text-3xl">123 Main Street</p>
                  <p className="text-3xl">Anytown, CA 98765</p>
               </div>
            </div>
         </div>

         {/* Map Section */}
         <div className="max-w-full mx-auto px-6  mt-8">
            <div className="h-lvh rounded-2xl overflow-hidden ">
               <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3914.60918922887!2d38.76125207485697!3d9.030258290862423!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85f80bcb6a7f%3A0x8a5c92a68bb9ffb!2sAddis%20Ababa%20Science%20and%20Technology%20University!5e0!3m2!1sen!2set!4v1695845590000&style=feature:all|element:labels|visibility:off&style=feature:landscape|color:0x000000&style=feature:road|color:0x111111&style=feature:water|color:0x000000"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) brightness(85%) contrast(120%)" }}
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