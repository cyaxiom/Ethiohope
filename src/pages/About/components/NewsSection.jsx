import React from 'react';
import { Link } from 'react-router-dom';
React;

function NewsSection({ darkMode }) {
  return (
    <div className={`theme-bg-wrapper ${darkMode ? 'bg-[#000000]' : 'bg-gradient-to-br from-blue-50 via-green-50 to-white'} py-20 overflow-hidden` }>
  <h2 className={`text-4xl font-bold mb-6 text-center ${darkMode ? 'text-white' : 'text-black'}`}>Latest News</h2>
      <div className="flex items-center justify-center mb-12">
        <div className="h-2 w-2 rounded-full bg-[#7601d3] mr-2"></div>
        <div className="h-1 w-32 bg-gradient-to-r from-blue-500 via-green-400 to-blue-600"></div>
      </div>
  <p className={`text-xl text-center mb-16 ${darkMode ? 'text-white' : 'text-black'}`}>
        Read more about latest news and our special event
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="group">
            <div className="relative overflow-hidden rounded-xl mb-6">
              <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/80 to-transparent z-10"></div>
              <img 
                src={`https://source.unsplash.com/random/400x300?tech=${item}`}
                alt="News" 
                className="w-full h-40 md:h-48 lg:h-60 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-0 left-0 p-4 z-20">
                <p className={`text-sm uppercase font-bold mb-2 ${darkMode ? 'text-white' : 'text-black'}`}>HEADLINE</p>
                <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-black'}`}>
                  Sed imperdiet enim ligula, vitae viverra justo porta vel.
                </h3>
              </div>
            </div>
            <Link 
              to="/blog" 
              className="px-4 py-2 rounded bg-[#7601d3] text-white font-bold uppercase transition-colors hover:bg-blue-600 shadow-lg"
              style={{ background: 'linear-gradient(90deg, #7601d3 0%, #00ff99 100%)' }}
            >
              READ MORE
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NewsSection;
