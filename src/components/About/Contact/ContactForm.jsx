// src/components/About/Contact/ContactForm.jsx
import React from "react";
import contactleftside from "../../../assets/images/contact/contactleftside.png";
import contactrightside from "../../../assets/images/contact/contactrightside.png";
import ContactformBg from "../../../assets/images/contact/contactFormBg.png";
import formBgs from "../../../assets/images/contact/formBgs.png";

const ContactForm = () => {
   return (
      <section
         className="py-7 "
         style={{
            backgroundImage: `url(${formBgs})`,
            backgroundPosition: "top",
         }}
         >
         <div className="relative max-w-7xl border rounded-xl mx-auto  px-6 bg-[#1D1D3E]">
            {/* Side Images */}
            <img
               src={contactleftside}
               alt="left decoration"
               className="absolute left-0 top-1/3 w-40"   // was w-24
               initial={{ opacity: 0, x: -40 }}
               whileInView={{ opacity: 1, x: 0 }}
               transition={{ duration: 1 }}
               viewport={{ once: true, amount: 0.3 }}
            />

            <img
               src={contactrightside}
               alt="right decoration"
               className="absolute right-0 top-1/3 w-40"   // was w-24
               initial={{ opacity: 0, x: 40 }}
               whileInView={{ opacity: 1, x: 0 }}
               transition={{ duration: 1 }}
               viewport={{ once: true, amount: 0.3 }}
            />


            <div className=" rounded-2xl p-8 md:p-12 max-w-4xl mx-auto relative z-1">
               <h3 className="text-3xl md:text-4xl font-bold mb-8 text-center text-white">Contact with Coindox</h3>
               <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
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