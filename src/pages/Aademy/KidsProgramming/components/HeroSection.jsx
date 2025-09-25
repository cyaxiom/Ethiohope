import React from 'react';
React;
const HeroSection = () => {
    const heroimg="/heroimgKids.png"
  return (
    <section className="pt-20 pb-16 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <div className="text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
              Coding Courses
              <br />
              <span className="text-primary">For Kids</span>
            </h1>
            
            <p className="text-lg md:text-xl mb-8 text-muted-foreground leading-relaxed">
              Ethiohope is an online coding platform 
              that helps your kids to learn coding 
              in the most engaging way and 
              thus improve their creativity.
            </p>
            
            <p className="text-base md:text-lg mb-8 text-muted-foreground font-medium">
              Get instructor-led online coding classes
              for kids now.
            </p>
            
            <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-300 shadow-lg hover:shadow-xl">
              Book Your Free Trial
            </button>
          </div>

          {/* Right Side - Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md lg:max-w-lg">
              <img 
                src={heroimg} 
                alt="Kid learning coding" 
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;