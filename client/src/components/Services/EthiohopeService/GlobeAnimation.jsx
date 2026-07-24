import React from 'react';

const GlobeAnimation = ({ className = 'max-w-md md:max-w-xl lg:max-w-2xl' }) => {
  return (
    <div className={`relative ${className} mx-auto`}>
      <div className="relative w-full" style={{ paddingTop: '36%' }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <style>{`
            /* Inspector-like DOM styles to match screenshot */
            .xb-hero { position: relative; width:100%; }
            .hero_wrap { max-width: 720px; margin: 0 auto; padding-top: 40px; }
            .shield-wrap { position: relative; width:100%; display:flex; align-items:center; justify-content:center; padding: 40px 0 20px; }
            .shield-img { width: 56%; max-width: 260px; }
            .rings-wrap { position: absolute; left: 50%; transform: translateX(-50%); bottom: -6%; width: 100%; height: 160px; pointer-events:none; }
            .ring-elem { position:absolute; left:50%; transform:translateX(-50%); border-radius:999px; }
            .ring-elem.r1{ width:300px;height:22px; bottom:36px; border:3px solid rgba(255,192,230,0.12); box-shadow:0 0 60px rgba(255,60,150,0.18), inset 0 -6px 14px rgba(0,0,0,0.6); }
            .ring-elem.r2{ width:380px;height:18px; bottom:58px; border:2px solid rgba(200,120,255,0.14); box-shadow:0 0 80px rgba(150,60,255,0.2); }
            .ring-elem.r3{ width:520px;height:36px; bottom:12px; border:4px solid rgba(255,140,220,0.14); box-shadow:0 0 120px rgba(255,100,200,0.22); }
            .ring-elem.r4{ width:220px;height:10px; bottom:86px; border-radius:999px; border:2px solid rgba(255,255,255,0.9); box-shadow:0 0 28px rgba(255,200,210,0.9); }
            @media (max-width:480px){ .shield-img{ width:68%; max-width:240px;} .ring-elem.r3{ width:420px;} .ring-elem.r2{ width:320px;} }
          `}</style>

          {/* Inspector-like markup: shield centered with rings beneath (DOM similar to inspector screenshot) */}
          <div className="xb-hero">
            <div className="hero_wrap">
              <div className="shield-wrap">
                {/* Shield SVG/image — using inline SVG to match neon look */}
                <div className="shield-img" aria-hidden>
                  <svg viewBox="0 0 120 150" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="g1" x1="0" x2="1">
                        <stop offset="0%" stopColor="#36d1dc" />
                        <stop offset="50%" stopColor="#3a3bff" />
                        <stop offset="100%" stopColor="#ff3fcf" />
                      </linearGradient>
                      <filter id="glo2" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="6" result="b" />
                        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                      </filter>
                    </defs>
                    <g filter="url(#glo2)">
                      <path d="M60 6 C78 20 95 22 102 34 V64 C102 102 82 128 60 148 C38 128 18 102 18 64 V34 C25 22 42 20 60 6 Z"
                        fill="url(#g1)" opacity="0.14" />
                      <path d="M60 12 C76 24 92 24 96 34 V64 C96 98 78 120 60 136 C42 120 24 98 24 64 V34 C28 24 44 24 60 12 Z"
                        fill="none" stroke="url(#g1)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
                    </g>
                    <g stroke="url(#g1)" strokeWidth="1.6" fill="none" strokeLinecap="round">
                      <path d="M60 46 C70 54 72 64 60 78" opacity="0.95" />
                      <path d="M54 48 C63 54 66 64 54 76" opacity="0.75" />
                      <path d="M48 52 C58 58 60 68 48 74" opacity="0.55" />
                      <path d="M66 50 C74 56 76 66 66 74" opacity="0.6" />
                    </g>
                  </svg>
                </div>

                {/* Rings container placed beneath shield to mimic inspector layout */}
                <div className="rings-wrap" aria-hidden>
                  <div className="ring-elem r3" />
                  <div className="ring-elem r2" />
                  <div className="ring-elem r1" />
                  <div className="ring-elem r4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobeAnimation;
