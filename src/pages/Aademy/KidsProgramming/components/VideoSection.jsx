import React from 'react';
React;
const VideoSection = () => {
  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
              Online Coding courses for kids
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              This innovative coding platform teaches kids the basics of coding and enables them to develop creative skills, problem-solving skills and enhance their confidence.
            </p>
          </div>

          {/* Right Side - Video */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-lg">
              <div className="relative w-full h-0 pb-[56.25%] rounded-lg overflow-hidden shadow-lg">
                <iframe 
                  className="absolute top-0 left-0 w-full h-full"
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