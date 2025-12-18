import React, { useState } from "react";
import { useTheme } from "@provider/ThemeProvider/ThemeProvider";
import { Plus, Minus } from "lucide-react";
import { SectionContainer } from "@/components/ui/Container";
import { Heading, Text } from "@/components/ui/Typography";

export default function FAQSection() {
  const { isDark } = useTheme();
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
      q: "What about the security of children's data using this platform?",
      a: "We strictly follow child privacy and safety policies. Data is encrypted and never shared with third parties.",
    },
  ];

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-background">
      <SectionContainer sectionSpacing="xl" containerSize="md">
        <Heading variant="h2" className="text-center mb-12">
          Frequently <span className="text-[#7b5cff] italic font-semibold">asked</span> questions
        </Heading>

        <div className="space-y-4">
          {faqs.map((item, idx) => (
            <div 
              key={idx} 
              className={`rounded-2xl shadow-sm ${
                isDark 
                  ? "bg-card border border-border" 
                  : "bg-[#faf7ff]"
              }`}
            >
              <button
                onClick={() => handleToggle(idx)}
                className={`w-full flex justify-between items-center transition rounded-full px-6 py-4 cursor-pointer ${
                  isDark 
                    ? "hover:bg-[#7b5cff]/10" 
                    : "hover:bg-[#f3edff]"
                }`}
              >
                <span className={`font-medium text-left line-clamp-2 ${
                  isDark ? "text-foreground" : "text-gray-700"
                }`}>
                  {item.q}
                </span>
                {openIndex === idx ? (
                  <Minus className="w-5 h-5 text-[#7b5cff] flex-shrink-0 ml-4" />
                ) : (
                  <Plus className="w-5 h-5 text-[#7b5cff] flex-shrink-0 ml-4" />
                )}
              </button>

              {openIndex === idx && (
                <div className="px-6 pb-4">
                  <Text size="sm" className="line-clamp-4">
                    {item.a}
                  </Text>
                </div>
              )}
            </div>
          ))}
        </div>
      </SectionContainer>
    </section>
  );
}
