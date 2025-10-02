import React from 'react';

const specialties = [
  {
    title: 'Space for Ideas',
    desc: 'We encourage creative thinking and provide a nurturing environment for kids to explore and express their ideas freely.'
  },
  {
    title: 'Engaging Curriculum',
    desc: 'Our curriculum is designed to be interactive and fun, making learning enjoyable and effective for every child.'
  },
  {
    title: 'Professional Approach & Tools',
    desc: 'We use industry-standard tools and a professional approach to ensure kids gain real-world skills and experience.'
  }
];

const differentiators = [
  {
    title: 'One to One Training',
    desc: 'Learn from the industry experts. Our personalized training ensures every child gets the attention and guidance they need to excel.'
  },
  {
    title: 'Courses Designed By Alumnus of IIT, NIT & IIM',
    desc: 'Our courses are crafted by top minds from premier institutes, ensuring high quality and relevance in every lesson.'
  },
  {
    title: 'EthioHope Certification',
    desc: 'Earn a certification that is recognized and valued, giving your child a head start in their coding journey.'
  }
];

function SpecialitiesSection() { 
  
  // Standard background for the section - using a gradient that works well in both modes
  const sectionBgClass = 'bg-muted/30 dark:bg-muted/60';
  
  // LEFT Card: Modified for a light greenish gradient in light mode
  const leftCardBgClass = 'bg-gradient-to-br from-green-50 via-teal-50 to-white dark:bg-blue-950/70 border border-border';
  
  // RIGHT Card: A standard card background
  const rightCardBgClass = 'bg-card dark:bg-card/90 border border-border';

  // Gradient Text (Main Headings)
  const mainGradientText = 'bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-500 text-transparent bg-clip-text';
  
  // Gradient Text (Subheadings)
  const subGradientText = 'bg-gradient-to-r from-purple-500 via-blue-400 to-green-400 text-transparent bg-clip-text';

  return (
    <section
      className={`relative py-20 px-4 md:px-12 overflow-hidden ${sectionBgClass}`}
    >
      {/* Decorative gradients updated to use theme-aware classes */}
      {/* Top Left Decoration */}
      <div className="absolute top-0 left-0 w-1/2 h-1/2 pointer-events-none z-0">
        <div className="w-72 h-72 rounded-full blur-3xl opacity-30 bg-blue-300 dark:bg-blue-700"></div>
      </div>
      {/* Bottom Right Decoration */}
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 pointer-events-none z-0">
        <div className="w-72 h-72 rounded-full blur-3xl opacity-30 bg-purple-300 dark:bg-purple-700"></div>
      </div>

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 md:gap-12 items-stretch rounded-3xl p-4 md:p-12 relative z-10">
        
        {/* Left Side: Our Specialities (Now with greenish gradient in light mode) */}
        <div className={`md:w-1/2 flex flex-col justify-center rounded-2xl p-6 md:p-10 shadow-xl ${leftCardBgClass}`}>
          <h2 className={`text-4xl md:text-5xl font-bold mb-8 ${mainGradientText}`}>
            Our Specialities
          </h2>
          {specialties.map((item, idx) => (
            <div key={idx} className="mb-8 last:mb-0">
              <h3 className={`text-2xl font-bold mb-2 ${subGradientText}`}>
                {item.title}
              </h3>
              <p className="text-lg text-muted-foreground">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Right Side: What Differentiates Us */}
        <div className={`md:w-1/2 flex flex-col justify-center rounded-2xl p-6 md:p-10 shadow-xl ${rightCardBgClass}`}>
          <h2 className={`text-4xl md:text-5xl font-bold mb-8 ${mainGradientText}`}>
            What Differentiates Us
          </h2>
          {differentiators.map((item, idx) => (
            <div key={idx} className="mb-8 last:mb-0">
              <h3 className={`text-2xl font-bold mb-2 ${subGradientText}`}>
                {item.title}
              </h3>
              <p className="text-lg text-muted-foreground">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SpecialitiesSection;