// src/components/About/Contact/NewsLetter.jsx
import React from 'react';
import pdf from "../../../assets/images/contact/pdf.svg";

const Newsletter = () => {
   return (
      <section className="bg-[#0D0C2E] py-16">
         <div className="w-full  mx-auto px-6 items-start md:justify-between md:flex-row flex flex-col gap-4">
            {/* Newsletter Section */}
            <div className="text-white w-80">
               <h3 className="text-2xl font-bold mb-4 text-white">Subscribe newsletter</h3>
               <p className="text-gray-400 mb-6 leading-relaxed">
                  Pre-ICOs typically offer early access to the project's tokens before the main ICO.
               </p>
               <div className="flex max-w-full">
                  <input
                     type="email"
                     placeholder="coindox@gmail.com"
                     className="flex-1 p-4 bg-[#1D1D3E] rounded-l-xl border border-[#3C12D4]/50 focus:outline-none focus:border-[#3C12D4] text-white"
                  />
                  <button className="p-4 bg-gradient-to-r from-[#3C12D4] to-[#A855F7] rounded-r-xl hover:from-[#4a1cf0] hover:to-[#b366ff] transition-colors">
                     <span className="text-white font-bold">→</span>
                  </button>
               </div>
            </div>

            {/* Documents Section */}
            <div className="text-[#8E8E9F] ">
               <h3 className="text-2xl w-full flex md:justify-end font-bold mb-6 text-[#FFFFFF] ">Download Documents</h3>
               <div className="flex gap-2 flex-wrap">
                  <button className="block bg-[#1D1D3E] px-12 py-8 rounded-xl  hover:text-white border border-[#3C12D4]/30  text-center ">
                     <img src={pdf} alt="PDF Icon" className="inline-block w-7 mr-2" />
                     <span className="block text-sm font-semibold pt-4 uppercase">White Paper</span>
                  </button>
                  <button className="bg-[#1D1D3E] px-12 py-8 rounded-xl hover:text-white border border-[#3C12D4]/30  text-center">
                     <img src={pdf} alt="PDF Icon" className="inline-block w-7 mr-2" />
                     <span className="block text-sm font-semibold pt-4 uppercase">One Paper</span>
                  </button>
                  <button className="bg-[#1D1D3E] px-12 py-8 rounded-xl hover:text-white border border-[#3C12D4]/30  text-center">
                     <img src={pdf} alt="PDF Icon" className="inline-block w-7 mr-2" />
                     <span className="block text-sm font-semibold pt-4 uppercase">Privacy Policy</span>
                  </button>
                  <button className="bg-[#1D1D3E] px-12  py-8 rounded-xl hover:text-white border border-[#3C12D4]/30  text-center">
                     <img src={pdf} alt="PDF Icon" className="inline-block w-7 mr-2" />
                     <span className="block text-sm font-semibold pt-4 uppercase">Terms of Sale</span>
                  </button>
               </div>
            </div>
         </div>
      </section>
   );
};

export default Newsletter;