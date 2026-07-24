import React from 'react';

interface HeroBannerProps {
  title: string;
  description: string;
  ctaText: string;
  imageSrc?: string;
  onCtaClick?: () => void;
  className?: string;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ 
  title, 
  description, 
  ctaText, 
  imageSrc, 
  onCtaClick,
  className 
}) => {
  return (
    <div className={`relative bg-blue-500 rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg shadow-blue-200/50 flex flex-col md:flex-row items-center justify-between p-5 sm:p-8 md:p-12 mb-6 sm:mb-8 ${className}`}>
      <div className="z-10 text-white space-y-3 sm:space-y-4 md:max-w-md w-full">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight underline-offset-8 decoration-blue-200/20">{title}</h2>
        <p className="text-blue-50 text-sm md:text-base opacity-90 leading-relaxed font-medium">{description}</p>
        <button 
          onClick={onCtaClick}
          className="w-full sm:w-auto bg-white text-blue-600 px-6 py-3 rounded-2xl font-bold text-sm tracking-wide hover:bg-blue-50 hover:scale-105 active:scale-95 transition-all shadow-md"
        >
          {ctaText} →
        </button>
      </div>
      {imageSrc && (
        <div className="mt-6 md:mt-0 md:absolute md:right-8 md:bottom-0 z-0 h-40 sm:h-64 md:h-80 w-auto opacity-100 drop-shadow-2xl translate-y-2 sm:translate-y-4">
          <img 
            src={imageSrc} 
            alt="Hero Illustration" 
            className="h-full w-auto object-contain"
          />
        </div>
      )}
      
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400 opacity-20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
    </div>
  );
};

export default HeroBanner;
