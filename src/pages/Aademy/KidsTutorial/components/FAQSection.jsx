import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      q: "What makes WonderKids different from other education platforms?",
      a: "WonderKids provides interactive learning with gamification and personalized content designed for children.",
    },
    {
      q: "How can I access WonderKids?",
      a: "You can access it from any device with internet — mobile, tablet, or desktop through our website or app.",
    },
    {
      q: "What about the security of children’s data using this platform?",
      a: "We strictly follow child privacy and safety policies. Data is encrypted and never shared with third parties.",
    },
  ];

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative py-24 bg-white text-gray-900">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
          Frequently <span className="text-[#7b5cff] italic font-semibold">asked</span> questions
        </h2>

        <div className="space-y-4">
          {faqs.map((item, idx) => (
            <div key={idx} className="bg-[#faf7ff] rounded-2xl shadow-sm">
              <div
                onClick={() => handleToggle(idx)}
                className="flex justify-between items-center hover:bg-[#f3edff] transition rounded-full px-6 py-4 cursor-pointer"
              >
                <span className="text-gray-700 font-medium">{item.q}</span>
                {openIndex === idx ? (
                  <Minus className="w-5 h-5 text-[#7b5cff]" />
                ) : (
                  <Plus className="w-5 h-5 text-[#7b5cff]" />
                )}
              </div>

              {openIndex === idx && (
                <div className="px-6 pb-4 text-gray-600 text-sm">{item.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
