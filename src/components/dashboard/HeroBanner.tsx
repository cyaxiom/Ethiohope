import React from 'react';

interface HeroBannerProps {
  title: string;
  description: string;
  ctaText: string;
  imageSrc: string;
  className?: string;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ 
  title, 
  description, 
  ctaText, 
  imageSrc, 
  className 
}) => {
  return (
    <div className={`relative bg-blue-500 rounded-3xl overflow-hidden shadow-lg shadow-blue-200/50 flex flex-col md:flex-row items-center justify-between p-8 md:p-12 mb-8 ${className}`}>
      <div className="z-10 text-white space-y-4 md:max-w-md">
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight underline-offset-8 decoration-blue-200/20">{title}</h2>
        <p className="text-blue-50 text-sm md:text-base opacity-90 leading-relaxed font-medium">{description}</p>
        <button className="bg-white text-blue-600 px-6 py-3 rounded-2xl font-bold text-sm tracking-wide hover:bg-blue-50 hover:scale-105 active:scale-95 transition-all shadow-md">
          {ctaText} →
        </button>
      </div>
      <div className="mt-8 md:mt-0 md:absolute md:right-8 md:bottom-0 z-0 h-64 md:h-80 w-auto opacity-100 drop-shadow-2xl translate-y-4">
        <img 
          src={imageSrc} 
          alt="Hero Illustration" 
          className="h-full w-auto object-contain"
        />
      </div>
      
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400 opacity-20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
    </div>
  );
};

export default HeroBanner;
