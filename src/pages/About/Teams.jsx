                                                                                                                                                                                                                                
// cspell:words Linkedin Unsplash marquee CTA
import React from 'react';
import { useTheme } from '@provider/ThemeProvider/ThemeProvider';
import { Facebook, Instagram, Linkedin, Twitter, ArrowRight } from 'lucide-react';

// Full Team page inspired by reference design with moving side photos and structured flow

const Socials = ({ dark }) => (
  <div className="flex items-center gap-3 mt-4">
    <a
      href="#"
      className={`w-10 h-10 rounded-full flex items-center justify-center border transition-colors ${
        dark
          ? 'text-white border-gray-700 hover:bg-blue-500 hover:border-blue-500'
          : 'text-gray-700 border-gray-300 hover:bg-blue-500 hover:border-blue-500 hover:text-white'
      }`}
      aria-label="Twitter"
    >
      <Twitter className="w-4 h-4" />
    </a>
    <a
      href="#"
      className={`w-10 h-10 rounded-full flex items-center justify-center border transition-colors ${
        dark
          ? 'text-white border-gray-700 hover:bg-blue-600 hover:border-blue-600'
          : 'text-gray-700 border-gray-300 hover:bg-blue-600 hover:border-blue-600 hover:text-white'
      }`}
      aria-label="Facebook"
    >
      <Facebook className="w-4 h-4" />
    </a>
    <a
      href="#"
      className={`w-10 h-10 rounded-full flex items-center justify-center border transition-colors ${
        dark
          ? 'text-white border-gray-700 hover:bg-blue-700 hover:border-blue-700'
          : 'text-gray-700 border-gray-300 hover:bg-blue-700 hover:border-blue-700 hover:text-white'
      }`}
      aria-label="LinkedIn"
    >
      <Linkedin className="w-4 h-4" />
    </a>
    <a
      href="#"
      className={`w-10 h-10 rounded-full flex items-center justify-center border transition-colors ${
        dark
          ? 'text-white border-gray-700 hover:bg-purple-600 hover:border-purple-600'
          : 'text-gray-700 border-gray-300 hover:bg-purple-600 hover:border-purple-600 hover:text-white'
      }`}
      aria-label="Instagram"
    >
      <Instagram className="w-4 h-4" />
    </a>
  </div>
);

function Teams() {
  const { isDark } = useTheme();

  // Gallery images for the moving side photos rows
  const gallery1 = [
    'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1573497161161-d3f8943d8f37?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1200&auto=format&fit=crop',
  ];
  const gallery2 = [
    'https://images.unsplash.com/photo-1556767576-cf01c4b1c8f9?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1531379410502-63bfe8cdaf6f?q=80&w=1200&auto=format&fit=crop',
  ];

  const spotlight = {
    name: 'John Doe',
    role: 'Founder & CEO',
    desc:
      "We lead with empathy and engineering excellence—building reliable products, mentoring teams, and turning ideas into impact.",
    image:
      'https://images.unsplash.com/photo-1607556114526-058f5efdf49e?q=80&w=1000&auto=format&fit=crop',
  };

  const featurePairs = [
    {
      name: 'John Doe',
      role: 'Founder & CEO',
      desc:
        'We focus on clarity, fast iteration, and measurable outcomes for our users.',
      image:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop',
    },
    {
      name: 'John Doe',
      role: 'Founder & CEO',
      desc:
        'We focus on clarity, fast iteration, and measurable outcomes for our users.',
      image:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop',
    },
    {
      name: 'John Doe',
      role: 'Founder & CEO',
      desc: 'We collaborate across disciplines to solve complex problems pragmatically.',
      image:
        'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=800&auto=format&fit=crop',
    },
    {
      name: 'John Doe',
      role: 'Founder & CEO',
      desc: 'We collaborate across disciplines to solve complex problems pragmatically.',
      image:
        'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=800&auto=format&fit=crop',
    },
  ];

  const peopleGrid = [
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1544005313-ff5e9f5460cb?q=80&w=800&auto=format&fit=crop',
  ];

  return (
    <div className="w-full overflow-x-hidden">
      {/* Inline styles for marquee/animation to avoid external CSS changes */}
      <style>
        {`
        @keyframes scrollLeft { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes scrollRight { from { transform: translateX(-50%); } to { transform: translateX(0); } }
        .marquee { display: flex; width: 200%; }
        .marquee.animate-left { animation: scrollLeft 30s linear infinite; }
        .marquee.animate-right { animation: scrollRight 30s linear infinite; }
        .marquee-item { width: 360px; height: 220px; }
        @media (max-width: 640px) { .marquee-item { width: 280px; height: 180px; } }
        /* CTA animated button styles */
        .btn-glow { position: relative; }
        .btn-glow::before { content: ""; position: absolute; inset: -2px; border-radius: 9999px; background: linear-gradient(90deg,#60a5fa,#34d399,#a78bfa,#f472b6,#60a5fa); background-size: 300% 300%; filter: blur(10px); opacity: 0.55; transition: opacity .3s ease, transform .3s ease; z-index: 0; animation: glowPulse 6s ease-in-out infinite alternate; }
        .btn-glow:hover::before { opacity: 0.9; }
        @keyframes glowPulse { 0% { transform: scale(1); background-position: 0% 50%; } 100% { transform: scale(1.03); background-position: 100% 50%; } }
        .btn-shine { position: relative; overflow: hidden; }
        .btn-shine::after { content: ""; position: absolute; top: 0; left: -150%; width: 40%; height: 100%; background: linear-gradient(120deg,transparent,rgba(255,255,255,0.35),transparent); transform: skewX(-20deg); transition: left .6s ease; }
        .btn-shine:hover::after { left: 200%; }
        .btn-content { position: relative; z-index: 1; }
      `}
      </style>

      {/* Hero/Header with background TEAM text */}
      <section
        className={`relative pt-24 pb-16 ${
          isDark ? 'bg-[#0b0a2a]' : 'bg-gradient-to-br from-blue-50 via-green-50 to-white'
        }`}
      >
        {/* Background decorative big TEAM text */}
        <div className="absolute inset-0 flex items-start justify-center select-none pointer-events-none">
          <div
            className={`mt-10 text-[18vw] font-extrabold tracking-tight ${
              isDark ? 'text-white/5' : 'text-black/5'
            }`}
            style={{ lineHeight: 0.8 }}
          >
            TEAM
          </div>
        </div>

        {/* Floating blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute -bottom-24 -right-16 w-96 h-96 rounded-full bg-purple-500/20 blur-3xl" />
        </div>

        <div className="relative container mx-auto px-6">
          <h1
            className={`text-4xl md:text-6xl font-extrabold text-center ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            Meet Our Dynamic Team
          </h1>
          <div className="flex justify-center mt-4">
            <div className="h-2 w-24 rounded-full bg-gradient-to-r from-blue-400 to-pink-300" />
          </div>
          <p className={`max-w-4xl mx-auto text-center mt-6 text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Together, we're more than a team. We're a family driven by a shared mission to create
            exceptional solutions and deliver unparalleled service to our clients.
          </p>
        </div>

        {/* Moving side photos (two rows, opposite directions) */}
        <div className="relative mt-14 space-y-6">
          {/* Row 1 */}
          <div className="overflow-hidden">
            <div className="marquee animate-left">
              {[...gallery1, ...gallery1].map((src, i) => (
                <div
                  key={`g1-${i}`}
                  className={`marquee-item mx-3 rounded-3xl overflow-hidden border ${
                    isDark ? 'border-white/10' : 'border-black/10'
                  } shadow-lg`}
                >
                  <img src={src} alt="Team gallery" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
          {/* Row 2 */}
          <div className="overflow-hidden">
            <div className="marquee animate-right">
              {[...gallery2, ...gallery2].map((src, i) => (
                <div
                  key={`g2-${i}`}
                  className={`marquee-item mx-3 rounded-3xl overflow-hidden border ${
                    isDark ? 'border-white/10' : 'border-black/10'
                  } shadow-lg`}
                >
                  <img src={src} alt="Team gallery" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section title like reference */}
      <section className={`${isDark ? 'bg-[#0b0a2a]' : 'bg-white'} pt-20 pb-10`}>
        <div className="container mx-auto px-6">
          <h2 className={`text-3xl md:text-5xl font-bold text-center ${isDark ? 'text-white' : 'text-black'}`}>
            Meet Our Dynamic Team
          </h2>
          <div className="flex justify-center mt-4">
            <div className="h-2 w-24 rounded-full bg-gradient-to-r from-blue-400 to-pink-300" />
          </div>
        </div>
      </section>

      {/* Spotlight leader section */}
      <section className={`${isDark ? 'bg-[#0b0a2a]' : 'bg-white'} py-10`}>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left image blob */}
            <div className="flex justify-center lg:justify-start">
              <div className="relative">
                <div className="absolute -inset-6 rounded-[48px] bg-gradient-to-tr from-blue-500 via-cyan-400 to-purple-500 opacity-60 blur-2xl" />
                <div className="relative bg-gradient-to-br from-blue-500 to-cyan-500 p-[6px] rounded-[48px] w-[320px] md:w-[420px]">
                  <div className={`rounded-[44px] ${isDark ? 'bg-[#0b0a2a]' : 'bg-white'} p-2`}>
                    <img
                      src={spotlight.image}
                      alt={spotlight.name}
                      className="w-full h-full object-cover rounded-[40px]"
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Right content */}
            <div>
              <h3 className={`text-4xl md:text-5xl font-extrabold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {spotlight.name}
              </h3>
              <p className={`text-xl font-semibold mt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {spotlight.role}
              </p>
              <p className={`mt-4 max-w-2xl ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{spotlight.desc}</p>
              <Socials dark={isDark} />
            </div>
          </div>
        </div>
      </section>

      {/* Two-column featured rows (2 rows) */}
      <section className={`${isDark ? 'bg-[#0b0a2a]' : 'bg-white'} py-12`}>
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
          {featurePairs.map((p, idx) => (
            <div key={idx} className="flex items-center gap-6">
              <div className="shrink-0">
                <div className="p-[3px] rounded-full bg-gradient-to-br from-blue-500 via-pink-500 to-purple-600">
                  <div className={`w-40 h-40 rounded-full overflow-hidden ${isDark ? 'bg-[#0b0a2a]' : 'bg-white'}`}>
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
              <div>
                <h4 className={`text-3xl font-extrabold ${isDark ? 'text-white' : 'text-gray-900'}`}>{p.name}</h4>
                <p className={`font-semibold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{p.role}</p>
                <p className={`mt-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{p.desc}</p>
                <Socials dark={isDark} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Avatar grid (simple cards) */}
      <section className={`${isDark ? 'bg-[#0b0a2a]' : 'bg-white'} py-8`}> 
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {peopleGrid.map((src, i) => (
              <div key={i} className="text-center">
                <div className="flex justify-center">
                  <div className="p-[3px] rounded-full bg-gradient-to-br from-blue-500 via-pink-500 to-purple-600">
                    <div className={`w-32 h-32 rounded-full overflow-hidden ${isDark ? 'bg-[#0b0a2a]' : 'bg-white'}`}>
                      <img src={src} alt="Team member" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
                <h5 className={`mt-5 text-2xl font-extrabold ${isDark ? 'text-white' : 'text-gray-900'}`}>John Doe</h5>
                <p className={`${isDark ? 'text-white' : 'text-gray-900'}`}>Founder & CEO</p>
                <div className="flex items-center justify-center gap-4 mt-4">
                  <Facebook className={`${isDark ? 'text-white/80' : 'text-gray-700/80'}`} />
                  <Linkedin className={`${isDark ? 'text-white/80' : 'text-gray-700/80'}`} />
                  <Twitter className={`${isDark ? 'text-white/80' : 'text-gray-700/80'}`} />
                  <Instagram className={`${isDark ? 'text-white/80' : 'text-gray-700/80'}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Join Now */}
      <section className={`${isDark ? 'bg-[#0b0a2a]' : 'bg-gray-50'} py-16`}>
        <div className="container mx-auto px-6">
          <div
            className={`rounded-[36px] p-1 ${
              isDark ? 'bg-gradient-to-r from-blue-500 via-cyan-400 to-pink-500' : 'bg-gradient-to-r from-blue-400 via-cyan-300 to-pink-400'
            }`}
          >
            <div className={`rounded-[32px] px-6 md:px-16 py-12 ${isDark ? 'bg-[#0b0a2a]' : 'bg-white'}`}>
              <h3 className={`text-3xl md:text-4xl font-extrabold text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Join us on this exciting journey, as we innovate, create, and thrive together.
              </h3>
              <div className="flex justify-center mt-8">
                <a
                  href="/about/contact"
                  className="group relative inline-flex items-center justify-center px-8 py-3 rounded-full btn-glow btn-shine overflow-hidden"
                >
                  <span className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></span>
                  <span className="btn-content relative font-semibold text-white flex items-center gap-2 px-2">
                    JOIN NOW
                    <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Teams;
