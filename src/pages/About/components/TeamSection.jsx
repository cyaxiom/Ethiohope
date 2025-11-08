import { Facebook, Instagram, Linkedin, Minus, Plus, Star, Twitter } from 'lucide-react';
import React from 'react';
React;

function TeamSection({ darkMode }) {
  const teamMembers = [
    {
      name: "Yevhen Oleksiy",
      position: "Blockchain Architect",
      image: "https://res.cloudinary.com/skyrev/image/upload/v1692613792/bungalion/avatars/male8_iodxvm.png",
      socials: {
        twitter: "#",
        facebook: "#",
        linkedin: "#",
        instagram: "#"
      }
    },
    {
      name: "Pavlo Fedor",
      position: "Founder & CEO",
      image: "https://res.cloudinary.com/skyrev/image/upload/v1692613791/bungalion/avatars/female7_lrelgs.png",
      socials: {
        twitter: "#",
        facebook: "#",
        linkedin: "#",
        instagram: "#"
      }
    },
    {
      name: "Serhii Anatolii",
      position: "Marketing Manger",
      image: "https://res.cloudinary.com/skyrev/image/upload/v1692613792/bungalion/avatars/male6_wqwcnu.png",
      socials: {
        twitter: "#",
        facebook: "#",
        linkedin: "#",
        instagram: "#"
      }
    },
    {
      name: "Ivan Petrov",
      position: "Blockchain Engineer",
      image: "https://res.cloudinary.com/skyrev/image/upload/v1692613792/bungalion/avatars/male5_g1j5oi.png",
      socials: {
        twitter: "#",
        facebook: "#",
        linkedin: "#",
        instagram: "#"
      }
    }
  ];

  return (
    <div className={`theme-bg-wrapper ${darkMode ? 'bg-[#000000]' : 'bg-gray-50'} py-20`}>
      <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-blue-500 to-green-400 bg-clip-text text-transparent">Meet Our Dynamic Team</h2>
      <div className="flex items-center justify-center my-4">
        <div className="h-2 w-2 rounded-full bg-[#7601d3] mr-2"></div>
        <div className="h-1 w-32 bg-gradient-to-r from-blue-500 to-green-400"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 px-4">
        {/* Team Member Cards */}
        {teamMembers.map((member, index) => (
          <div key={index} className="group relative">
            {/* Top-left corner accent for all cards */}
            <div className="absolute top-0 left-0 w-20 h-20 bg-blue-500 z-10" style={{
              clipPath: "polygon(0 0, 0% 100%, 100% 0)"
            }}></div>
            
            <div className={`${darkMode ? 'bg-[#000000] border-gray-800' : 'bg-white border-gray-200'} border relative`} style={{
                clipPath: "polygon(0% 0%, 100% 0%, 100% 86%, 86% 100%, 0% 100%, 0% 0%)",
                borderRadius: "24px"
              }}>
              {/* Rating */}
              <div className={`absolute top-4 right-4 flex items-center ${darkMode ? 'text-white' : 'text-gray-800'} z-20`}>
                <Star className="w-5 h-5 text-blue-500 fill-blue-500 mr-1" />
                <span className="text-lg">5.0</span>
              </div>
              
              {/* Image Container */}
              <div className="p-6 pb-0">
                <div className={`rounded-full overflow-hidden w-40 h-40 mx-auto mb-4 border-4 ${darkMode ? 'border-gray-900' : 'border-gray-100'}`}>
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6 text-center">
                <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-1`}>{member.name}</h3>
                <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-4`}>{member.position}</p>
                
                {/* Social Icons */}
                <div className="group/social mb-4">
                  {/* All Social Icons Container (Hidden by default, shown on hover) */}
                  <div className="flex justify-center items-center gap-2 opacity-0 scale-95 group-hover/social:opacity-100 group-hover/social:scale-100 transition-all duration-300 ease-in-out mb-2 h-10">
                    <a href={member.socials.twitter} className={`w-10 h-10 rounded-full flex items-center justify-center ${darkMode ? 'text-white border-gray-700' : 'text-gray-700 border-gray-300'} border transform transition-all duration-200 hover:scale-110 hover:bg-blue-400 hover:border-blue-400 hover:text-white`}>
                      <Twitter className="w-5 h-5" />
                    </a>
                    <a href={member.socials.facebook} className={`w-10 h-10 rounded-full flex items-center justify-center ${darkMode ? 'text-white border-gray-700' : 'text-gray-700 border-gray-300'} border transform transition-all duration-200 hover:scale-110 hover:bg-blue-600 hover:border-blue-600 hover:text-white`}>
                      <Facebook className="w-5 h-5" />
                    </a>
                    <a href={member.socials.instagram} className={`w-10 h-10 rounded-full flex items-center justify-center ${darkMode ? 'text-white border-gray-700' : 'text-gray-700 border-gray-300'} border transform transition-all duration-200 hover:scale-110 hover:bg-purple-600 hover:border-purple-600 hover:text-white`}>
                      <Instagram className="w-5 h-5" />
                    </a>
                    <a href={member.socials.linkedin} className={`w-10 h-10 rounded-full flex items-center justify-center ${darkMode ? 'text-white border-gray-700' : 'text-gray-700 border-gray-300'} border transform transition-all duration-200 hover:scale-110 hover:bg-blue-700 hover:border-blue-700 hover:text-white`}>
                      <Linkedin className="w-5 h-5" />
                    </a>
                  </div>
                  
                  {/* Button with Plus/Minus toggle */}
                  <div className="flex justify-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${darkMode ? 'text-white border-gray-700 bg-blue-100/20' : 'text-gray-700 border-gray-300 bg-blue-50/50'} border group-hover/social:bg-blue-500 group-hover/social:text-white cursor-pointer transition-all duration-300`}>
                      <Plus className="w-5 h-5 block group-hover/social:hidden transition-opacity duration-200" />
                      <Minus className="w-5 h-5 hidden group-hover/social:block transition-opacity duration-200" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {/* Join Now button removed as it doesn't appear in the screenshot */}
      </div>
      {/* You can uncomment and add this back if needed */}
      {/* <div className="flex items-center justify-center mt-10">
        <Link 
          to="/about/teams" 
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors flex items-center shadow-lg"
        >
          View Full Team →
        </Link>
      </div> */}
    </div>
  );
}

export default TeamSection;
