import React from 'react';
React;

const VideoSection = () => {
  return (
    <section className="relative pt-0 pb-16 px-4 overflow-hidden bg-background -mt-1">
      {/* No decorative gradients - matching CoursesSection style */}
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
              Online Coding Courses for Kids
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              This innovative coding platform teaches kids the basics of coding and enables them to develop creative skills, problem-solving abilities, and enhance their confidence.
            </p>
          </div>

          {/* Right Side - Video */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-lg">
              <div className="relative w-full h-0 pb-[56.25%] rounded-lg overflow-hidden shadow-2xl">
                <iframe 
                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                  src="https://www.youtube.com/embed/3vZgREKKsO8?si=irPbrR5-Z9uJ-NOR" 
                  title="YouTube video player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  referrerPolicy="strict-origin-when-cross-origin" 
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
