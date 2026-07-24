import React from 'react';
import { ArrowRight } from 'lucide-react';

export const LearnMoreButton = ({ 
  href = "#", 
  text = "Learn more", 
  className = "",
  onClick 
}) => {
  return (
    <a
      href={href}
      onClick={onClick}
      className={`group inline-flex items-center gap-3 border border-[#7b5cff] 
                 text-[#7b5cff] px-6 py-3 rounded-full font-medium 
                 transition-all duration-300 shadow-sm 
                 hover:bg-[#7b5cff] hover:text-white 
                 hover:shadow-md hover:scale-105 ${className}`}
    >
      <span>{text}</span>
      <span className="relative flex items-center justify-center w-7 h-7 
                       rounded-full bg-[#7b5cff] transition-colors
                       group-hover:bg-white">
        <ArrowRight
          className="w-4 h-4 text-white group-hover:text-[#7b5cff] 
                     transform rotate-[330deg] transition-colors"
          strokeWidth={2.5}
        />
      </span>
    </a>
  );
};

export default LearnMoreButton;
