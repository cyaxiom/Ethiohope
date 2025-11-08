import React from 'react';
React;
function CultureSection({ darkMode }) {
  return (
    <div className={`theme-bg-wrapper ${darkMode ? 'bg-[#000000]' : 'bg-gradient-to-br from-blue-50 via-green-50 to-white'} relative py-20` }>
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold bg-gradient-to-r from-blue-500 via-green-400 to-blue-400 text-transparent bg-clip-text mb-4">
            CULTURE
          </h1>
          <div className="flex items-center justify-center my-4">
            <div className="h-2 w-2 rounded-full bg-[#7601d3] mr-2"></div>
            <div className="h-1 w-32 bg-gradient-to-r from-blue-500 to-green-400"></div>
          </div>
          <h2 className={`text-4xl md:text-5xl font-bold mb-12 text-center ${darkMode ? 'text-white' : 'text-black'}`}>
            We're A Diverse Family Of Creative Minds
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <img 
              src="https://res.cloudinary.com/skyrev/image/upload/v1692613886/bungalion/photos/l15_scwgwc.jpg" 
              alt="Culture" 
              className="w-full h-72 object-cover rounded-xl"
            />
            <img 
              src="https://res.cloudinary.com/skyrev/image/upload/v1692613887/bungalion/photos/l22_z1thos.jpg" 
              alt="Culture" 
              className="w-full h-72 object-cover rounded-xl"
            />
            <img 
              src="https://res.cloudinary.com/skyrev/image/upload/v1692613894/bungalion/photos/p17_cwy0yc.jpg" 
              alt="Culture" 
              className="w-full h-72 object-cover rounded-xl"
            />
          </div>
          <div className={`md:flex md:gap-8 p-6 md:p-10 rounded-3xl shadow-xl ${darkMode ? 'bg-gradient-to-r from-blue-600 via-green-500 to-blue-400 border border-white/10 backdrop-blur-sm' : 'bg-white/80 border border-blue-100'}` }>
            <div className="md:w-1/2 text-left">
              <h3 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-black'}`}>
                Our culture is the heartbeat of our success
              </h3>
              <p className={`text-lg mb-6 ${darkMode ? 'text-white' : 'text-black'}`}>
                We believe in a workplace where each team member's strengths are celebrated, 
                where learning is a constant, and where passion fuels every project
              </p>
            </div>
            <div className="md:w-1/2 text-left">
              <p className={`text-lg ${darkMode ? 'text-white' : 'text-black'}`}>
                Unlock the full potential of your brand with our comprehensive range of services. 
                From creative design and strategic marketing to cutting-edge development and beyond, 
                we offer a holistic approach that ensures your brand's impact resonates across every touchpoint.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CultureSection;
