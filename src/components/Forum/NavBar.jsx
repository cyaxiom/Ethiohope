import { Bell, ChevronDown } from 'lucide-react';
import React, { use } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CirclePlus } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { Check } from 'lucide-react';

const NavBar = ({ user }) => {
  //get the current location
  const location = useLocation();
  const navigate = useNavigate();

  //capitalize the first letter of each word in the last segment of the path
  const title = location.pathname
    .split('/')
    .filter(Boolean)
    .pop()
    .toLowerCase();
  const pathMap = {
    forum: 'Questions',
    tags: 'Mostly used tags',
    ranking: 'Commumity Contributors',
    'my-questions': 'Your Questions',
    'my-answers': 'Your Answers',
    likes: 'Your likes and Votes',
  };

  return (
    <div className="sticky top-0 z-50 bg-background">
      <nav className="flex justify-between items-center px-20 py-6 shadow-md">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3">
          <div className="w-7 h-7 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">C</span>
          </div>
          <span className="text-foreground font-bold text-xl tracking-tight">
            Ethiohope
          </span>
        </Link>

        {/* Optional title */}
        {title && (
          <span className="text-2xl font-semibold text-foreground">
            {pathMap[title]}
          </span>
        )}
        {/* Right side */}
        <div className="flex items-center gap-4">
          {!user ? (
            <>
              <Link
                to="/community/forum/register"
                className={`${
                  location.pathname === '/community/forum/register' &&
                  'bg-orange-500 text-white  rounded-md hover:bg-orange-600'
                } px-4 py-2 text-blue-600 hover:underline transition-colors duration-300`}
              >
                Register
              </Link>
              <Link
                to="/community/forum/login"
                className={`${
                  location.pathname === '/community/forum/login' &&
                  'bg-orange-500 text-white  rounded-md hover:bg-orange-600'
                } px-4 py-2 text-blue-600 hover:underline transition-colors duration-300`}
              >
                Login
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-8">
              <Link
                to="/community/forum/my-questions?type=create"
                className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 flex items-center"
              >
                <CirclePlus size={16} className="text-white opacity-80" />
                <span className="ml-2">Ask Question</span>
              </Link>

              {/* Notifications */}
              <div className="relative">
                <span className="material-icons text-gray-600">
                  <Bell />
                </span>
                {user.notifications > 0 && (
                  <span className="absolute -top-1 -right-2 bg-orange-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {user.notifications}
                  </span>
                )}
              </div>

              {/* Avatar dropdown */}
              <div
                onClick={() => navigate('/community/forum/profile')}
                className="flex items-center gap-1 cursor-pointer hover:scale-105 active:scale-100 transition-all"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full cursor-pointer border-2 border-orange-400"
                />
                <ChevronDown size={10} className="text-gray-600" />
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
