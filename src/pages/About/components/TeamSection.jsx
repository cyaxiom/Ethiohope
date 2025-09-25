import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
React;

function TeamSection() {
  return (
    <div className="py-20 bg-[#000000]">
      <h2 className="text-4xl font-bold text-white mb-12 text-center bg-gradient-to-r from-blue-500 to-green-400 bg-clip-text text-transparent">Meet Our Dynamic Team</h2>
      <div className="flex items-center justify-center my-4">
        <div className="h-2 w-2 rounded-full bg-[#7601d3] mr-2"></div>
        <div className="h-1 w-32 bg-gradient-to-r from-blue-500 to-green-400"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
        {/* Team Member 1 */}
        <div className="group">
          <div className="relative overflow-hidden rounded-3xl mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-green-400/30 group-hover:opacity-80 transition-opacity z-10"></div>
            <div className="absolute left-0 bottom-0 z-20 p-8">
              <h3 className="text-3xl font-bold text-white">John Doe</h3>
              <p className="text-xl text-green-400">Founder & CEO</p>
            </div>
            <div className="absolute top-0 right-0 flex gap-2 p-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
              <a href="#" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-blue-500 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-blue-500 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-blue-500 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-blue-500 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
            <img 
              src="https://res.cloudinary.com/skyrev/image/upload/v1692613792/bungalion/avatars/male8_iodxvm.png" 
              alt="John Doe" 
              className="w-full h-60 md:h-72 lg:h-80 object-cover"
            />
          </div>
          <p className="text-white/70">
            Cras convallis lacus orci, tristique tincidunt magna consequat in. 
            In vel pulvinar est, at euismod libero. Quisque ut metus sit amet augue rutrum feugiat.
          </p>
        </div>
        {/* Team Member 2 */}
        <div className="group">
          <div className="relative overflow-hidden rounded-3xl mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-green-400/30 group-hover:opacity-80 transition-opacity z-10"></div>
            <div className="absolute left-0 bottom-0 z-20 p-8">
              <h3 className="text-3xl font-bold text-white">Jane Doe</h3>
              <p className="text-xl text-blue-400">Founder & CEO</p>
            </div>
            <div className="absolute top-0 right-0 flex gap-2 p-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
              <a href="#" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-blue-500 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-blue-500 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-blue-500 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-blue-500 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
            <img 
              src="https://res.cloudinary.com/skyrev/image/upload/v1692613791/bungalion/avatars/female7_lrelgs.png" 
              alt="Jane Doe" 
              className="w-full h-60 md:h-72 lg:h-80 object-cover"
            />
          </div>
          <p className="text-white/70">
            In vel pulvinar est, at euismod libero. Quisque ut metus sit amet augue rutrum feugiat.
          </p>
        </div>
        {/* Team Member 3 */}
        <div className="group">
          <div className="relative overflow-hidden rounded-3xl mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-green-400/30 group-hover:opacity-80 transition-opacity z-10"></div>
            <div className="absolute left-0 bottom-0 z-20 p-8">
              <h3 className="text-3xl font-bold text-white">Alex Smith</h3>
              <p className="text-xl text-green-400">Founder & CEO</p>
            </div>
            <div className="absolute top-0 right-0 flex gap-2 p-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
              <a href="#" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-blue-500 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-blue-500 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-blue-500 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-blue-500 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
            <img 
              src="https://res.cloudinary.com/skyrev/image/upload/v1692613792/bungalion/avatars/male6_wqwcnu.png" 
              alt="Alex Smith" 
              className="w-full h-60 md:h-72 lg:h-80 object-cover"
            />
          </div>
          <p className="text-white/70">
            In vel pulvinar est, at euismod libero. Quisque ut metus sit amet augue rutrum feugiat.
          </p>
        </div>
        {/* Team Member 4 */}
        <div className="group">
          <div className="relative overflow-hidden rounded-3xl mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-green-400/30 group-hover:opacity-80 transition-opacity z-10"></div>
            <div className="absolute left-0 bottom-0 z-20 p-8">
              <h3 className="text-3xl font-bold text-white">Michael Brown</h3>
              <p className="text-xl text-blue-400">Founder & CEO</p>
            </div>
            <div className="absolute top-0 right-0 flex gap-2 p-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
              <a href="#" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-blue-500 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-blue-500 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-blue-500 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-blue-500 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
            <img 
              src="https://res.cloudinary.com/skyrev/image/upload/v1692613792/bungalion/avatars/male5_g1j5oi.png" 
              alt="Michael Brown" 
              className="w-full h-60 md:h-72 lg:h-80 object-cover"
            />
          </div>
          <p className="text-white/70">
            Cras convallis lacus orci, tristique tincidunt magna consequat in.
          </p>
        </div>
        <div className=" inset-0 flex items-center justify-center">
          <Link 
            to="/about/teams" 
            className="px-6 py-3 bg-[#7601d3] hover:bg-blue-600 text-white rounded-md font-medium transition-colors flex items-center shadow-lg"
          >
            Join Now! →
          </Link>
        </div>
      </div>
      {/* Team Grid Image (commented out for brevity) */}
    </div>
  );
}

export default TeamSection;
