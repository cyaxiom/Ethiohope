import React from 'react';
import Container from '@/components/ui/Container';

function PartnersSection() {
  return (
    <div className="py-20 flex justify-center items-center bg-muted/30 dark:bg-muted/60">
      <Container className="relative w-full max-w-4xl mx-auto rounded-3xl shadow-2xl px-6 pt-16 pb-10 bg-card border border-border overflow-hidden">
        {/* Background shape */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <svg width="700" height="350" viewBox="0 0 700 350" fill="none" className="mx-auto" style={{opacity:0.18}}>
            <ellipse cx="350" cy="175" rx="340" ry="160" fill="currentColor" className="text-muted" />
            <path d="M350 15a160 160 0 1 1 0 320a160 160 0 1 1 0-320z" fill="currentColor" className="text-muted" opacity="0.2" />
          </svg>
        </div>
        {/* Title & Subtitle */}
  <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-4 z-10 relative bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Our Partners and Investors</h2>
  <p className="text-lg text-center mb-10 max-w-2xl mx-auto z-10 relative text-muted-foreground">
          Trust is the foundation of our relationships – we're transparent, honest, and<br />
          dedicated to upholding the highest ethical standards.
        </p>
        {/* Infinitely scrolling logos - matches screenshot */}
  <div className="relative overflow-hidden mb-16 z-10">
          {/* First row of logos */}
          <div className="flex logo-slider">
            {/* Logo set 1 */}
            <div className="flex space-x-8 logo-slide">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary/60 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-primary-foreground font-bold text-2xl">LU</span>
              </div>
              <div className="w-16 h-16 flex items-center justify-center">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <path d="M20 0C8.954 0 0 8.954 0 20s8.954 20 20 20 20-8.954 20-20S31.046 0 20 0z" fill="#7C3AED" />
                  <path d="M26 20c0 3.314-2.686 6-6 6s-6-2.686-6-6 2.686-6 6-6 6 2.686 6 6z" fill="#F472B6" />
                </svg>
              </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-primary-foreground font-bold text-xl">LU</span>
              </div>
              <div className="w-16 h-16 flex items-center justify-center">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <path d="M20 0C8.954 0 0 8.954 0 20s8.954 20 20 20 20-8.954 20-20S31.046 0 20 0z" fill="#0EA5E9" />
                  <path d="M20 10l10 10-10 10-10-10z" fill="#FFFFFF" />
                </svg>
              </div>
                  <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-primary font-bold text-xl">LU</span>
              </div>
            </div>
            {/* Logo set 2 (duplicate for seamless loop) */}
            <div className="flex space-x-8 logo-slide">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary/60 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-primary-foreground font-bold text-2xl">LU</span>
              </div>
              <div className="w-16 h-16 flex items-center justify-center">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <path d="M20 0C8.954 0 0 8.954 0 20s8.954 20 20 20 20-8.954 20-20S31.046 0 20 0z" fill="#7C3AED" />
                  <path d="M26 20c0 3.314-2.686 6-6 6s-6-2.686-6-6 2.686-6 6-6 6 2.686 6 6z" fill="#F472B6" />
                </svg>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-primary-foreground font-bold text-xl">LU</span>
              </div>
              <div className="w-16 h-16 flex items-center justify-center">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <path d="M20 0C8.954 0 0 8.954 0 20s8.954 20 20 20 20-8.954 20-20S31.046 0 20 0z" fill="#0EA5E9" />
                  <path d="M20 10l10 10-10 10-10-10z" fill="#FFFFFF" />
                </svg>
              </div>
              <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-primary font-bold text-xl">LU</span>
              </div>
            </div>
          </div>
          {/* Second row of logos (moving in opposite direction) */}
          <div className="flex logo-slider-reverse mt-8">
            {/* Logo set 1 */}
            <div className="flex space-x-8 logo-slide">
              <div className="w-16 h-16 flex items-center justify-center">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <path d="M5 0h30c2.761 0 5 2.239 5 5v30c0 2.761-2.239 5-5 5H5c-2.761 0-5-2.239-5-5V5c0-2.761 2.239-5 5-5z" fill="#22D3EE" />
                  <path d="M20 10C14.477 10 10 14.477 10 20s4.477 10 10 10 10-4.477 10-10-4.477-10-10-10z" fill="#FFFFFF" />
                </svg>
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary/60 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-primary-foreground font-bold text-xl">LU</span>
              </div>
              <div className="w-16 h-16 flex items-center justify-center">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <path d="M0 10C0 4.477 4.477 0 10 0h20c5.523 0 10 4.477 10 10v20c0 5.523-4.477 10-10 10H10C4.477 40 0 35.523 0 30V10z" fill="#059669" />
                  <path d="M20 15l10 10H10l10-10z" fill="#FFFFFF" />
                </svg>
              </div>
              <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-primary font-bold text-xl">LU</span>
              </div>
              <div className="w-16 h-16 flex items-center justify-center">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <path d="M20 0C8.954 0 0 8.954 0 20s8.954 20 20 20 20-8.954 20-20S31.046 0 20 0z" fill="#F43F5E" />
                  <path d="M20 10v20M10 20h20" stroke="#FFFFFF" strokeWidth="4" />
                </svg>
              </div>
            </div>
            {/* Logo set 2 (duplicate for seamless loop) */}
            <div className="flex space-x-8 logo-slide">
              <div className="w-16 h-16 flex items-center justify-center">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <path d="M5 0h30c2.761 0 5 2.239 5 5v30c0 2.761-2.239 5-5 5H5c-2.761 0-5-2.239-5-5V5c0-2.761 2.239-5 5-5z" fill="#22D3EE" />
                  <path d="M20 10C14.477 10 10 14.477 10 20s4.477 10 10 10 10-4.477 10-10-4.477-10-10-10z" fill="#FFFFFF" />
                </svg>
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">LU</span>
              </div>
              <div className="w-16 h-16 flex items-center justify-center">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <path d="M0 10C0 4.477 4.477 0 10 0h20c5.523 0 10 4.477 10 10v20c0 5.523-4.477 10-10 10H10C4.477 40 0 35.523 0 30V10z" fill="#059669" />
                  <path d="M20 15l10 10H10l10-10z" fill="#FFFFFF" />
                </svg>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">LU</span>
              </div>
              <div className="w-16 h-16 flex items-center justify-center">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <path d="M20 0C8.954 0 0 8.954 0 20s8.954 20 20 20 20-8.954 20-20S31.046 0 20 0z" fill="#F43F5E" />
                  <path d="M20 10v20M10 20h20" stroke="#FFFFFF" strokeWidth="4" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        </Container>
        {/* Stats Section */}
  <div className="flex flex-col md:flex-row justify-center items-end gap-8 mt-10 z-10 relative">
          <div className="flex-1 text-center">
            <span className="text-5xl md:text-6xl font-extrabold text-green-400">+123M</span>
            <div className="w-24 h-2 bg-gradient-to-r from-blue-500 to-green-400 mx-auto my-2 rounded-full"></div>
            <span className="block text-2xl font-bold text-foreground">Clients</span>
          </div>
          <div className="flex-1 text-center">
            <span className="text-5xl md:text-6xl font-extrabold text-blue-400">+456K</span>
            <div className="w-24 h-2 bg-gradient-to-r from-green-400 to-blue-500 mx-auto my-2 rounded-full"></div>
            <span className="block text-2xl font-bold text-foreground">Partners</span>
          </div>
          <div className="flex-1 text-center">
            <span className="text-5xl md:text-6xl font-extrabold text-green-400">+789</span>
            <div className="w-24 h-2 bg-gradient-to-r from-blue-500 to-green-400 mx-auto my-2 rounded-full"></div>
            <span className="block text-2xl font-bold text-foreground">Customers</span>
          </div>
        </div>
        {/* Animation keyframes for floating logos */}
        <style>{`
          @keyframes slide {
            0% { transform: translateX(0); }
            100% { transform: translateX(-100%); }
          }
          @keyframes slide-reverse {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(0); }
          }
          .logo-slider {
            display: flex;
            width: 100%;
            overflow: hidden;
          }
          .logo-slider-reverse {
            display: flex;
            width: 100%;
            overflow: hidden;
          }
          .logo-slide {
            display: flex;
            animation: slide 20s linear infinite;
            min-width: 100%;
          }
          .logo-slider-reverse .logo-slide {
            animation: slide-reverse 15s linear infinite;
          }
        `}</style>
      </div>

  );
}

export default PartnersSection;
