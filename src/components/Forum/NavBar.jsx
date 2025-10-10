import {
  BarChart,
  Bell,
  ChevronDown,
  Heart,
  HomeIcon,
  List,
  MessageSquare,
  Tag,
  User,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { CirclePlus } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { ThemeToggle } from '@components/ThemeToggle/ThemeToggle';
import React from 'react';
import { useTheme } from '@provider/ThemeProvider/ThemeProvider';
import { BsMoonStarsFill } from 'react-icons/bs';
import { MdSunny } from 'react-icons/md';

const NavBar = ({ user }) => {
  //get the current location
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [showMobileMenu, setShowMobileMenu] = React.useState(false);
  const isLoggedIn = !!user;

  //function to toggle mobile menu
  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

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
    <div className="sticky w-full top-0  z-50 bg-background bg-red-400">
      <nav className="flex w-full justify-between items-center px-2 md:px-20 py-6 shadow-md">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3">
          <div
            className={`w-7 h-7 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center`}
          >
            <span className="text-white font-bold text-sm">C</span>
          </div>
          <span className="text-foreground font-bold text-xl tracking-tight">
            Ethiohope
          </span>
        </Link>

        {/* Optional title */}
        {title && (
          <span className="text-2xl hidden lg:flex font-semibold text-foreground">
            {pathMap[title]}
          </span>
        )}
        {/* Right side */}
        <div className="flex items-center gap-4">
          {!user ? (
            <div className="flex gap-4 ml-10">
              <Link
                to="/community/forum/register"
                className={`${
                  location.pathname === '/community/forum/register' &&
                  `bg-orange-500 text-white  rounded-md hover:bg-orange-600`
                } px-2 py-1 md:px-4 md:py-2 ${
                  isDark ? 'text-blue-200' : 'text-blue-600'
                } hover:underline transition-colors duration-300`}
              >
                Register
              </Link>
              <Link
                to="/community/forum/login"
                className={`${
                  location.pathname === '/community/forum/login' &&
                  'bg-orange-500 text-white  rounded-md hover:bg-orange-600'
                } px-2 py-1 md:px-4 md:py-2 ${
                  isDark ? 'text-blue-200' : 'text-blue-600'
                } hover:underline transition-colors duration-300`}
              >
                Login
              </Link>
            </div>
          ) : (
            <>
              <div className="hidden md:flex items-center gap-8">
                <Link
                  to="/community/forum/my-questions?type=create"
                  className={`${
                    isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-orange-500'
                  } text-white px-4 py-2 rounded-md flex items-center`}
                >
                  <CirclePlus size={16} className="text-white opacity-80" />
                  <span className="ml-2">Ask Question</span>
                </Link>

                {/* Notifications */}
                <div className="relative">
                  <span
                    className={`material-icons ${
                      isDark ? 'text-white' : 'text-gray-600'
                    }`}
                  >
                    <Bell />
                  </span>
                  {user.notifications > 0 && (
                    <span
                      className={`absolute -top-1 -right-2 ${
                        isDark ? 'bg-gray-800' : 'bg-orange-500'
                      } text-white text-xs w-5 h-5 flex items-center justify-center rounded-full`}
                    >
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
                    className={`w-12 h-12 rounded-full cursor-pointer border-2 ${
                      isDark ? 'border-gray-600' : 'border-orange-500'
                    }`}
                  />
                  <ChevronDown
                    size={10}
                    className={`${isDark ? 'text-white' : 'text-gray-600'}`}
                  />
                </div>
                {/* theme toggle */}
                <ThemeToggle />
              </div>
              <div className="md:hidden">
                <button onClick={toggleMobileMenu} className="p-2">
                  {showMobileMenu ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-6 w-6 ${
                        isDark ? 'text-white' : 'text-gray-800'
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-6 w-6 ${
                        isDark ? 'text-white' : 'text-gray-800'
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  )}
                </button>
                {showMobileMenu && (
                  <MobileRightNav
                    onClose={() => setShowMobileMenu(false)}
                    user={user}
                    isLoggedIn={isLoggedIn}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </nav>
    </div>
  );
};

const MobileRightNav = ({ user, isLoggedIn, onClose }) => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const navRef = React.useRef();

  const [activeMenu, setActiveMenu] = React.useState('Questions');

  // close if clicked outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const menu = [
    {
      name: 'Questions',
      icon: <List className="w-5 h-5 text-muted-foreground" />,
      link: './',
    },
    {
      name: 'Tags',
      icon: <Tag className="w-5 h-5 text-muted-foreground" />,
      link: './tags',
    },
    {
      name: 'Ranking',
      icon: <BarChart className="w-5 h-5 text-muted-foreground" />,
      link: './ranking',
    },
  ];
  const personalNav = [
    {
      name: 'Your questions',
      icon: <User className="w-5 h-5 text-muted-foreground" />,
      link: './my-questions',
    },
    {
      name: 'Your answers',
      icon: <MessageSquare className="w-5 h-5 text-muted-foreground" />,
      link: './my-answers',
    },
    {
      name: 'Your likes & votes',
      icon: <Heart className="w-5 h-5 text-muted-foreground" />,
      link: './likes',
    },
  ];

  return (
    <div
      ref={navRef}
      className="border-l w-[250px] fixed right-0 bottom-0 top-20 bg-amber-200 border-border bg-background flex flex-col"
    >
      {/* Top Section */}
      <div className="p-6">
        {/* Menu */}
        <p className="text-xs font-semibold mb-3 text-muted-foreground tracking-wider">
          MENU
        </p>
        <nav className="flex flex-col space-y-2">
          {menu.map((item, idx) => (
            <Link
              key={idx}
              to={item.link}
              className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition ${
                activeMenu === item.name ? 'bg-muted' : ''
              }`}
              onClick={() => setActiveMenu(item.name)}
            >
              {item.icon}
              <span className="text-sm">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Divider */}
      <hr className="border-t border-border mx-6" />

      {/* Personal Nav */}
      {isLoggedIn && (
        <>
          <div className="p-6">
            <div className="text-xs font-semibold mb-3 text-muted-foreground tracking-wider">
              PERSONAL NAVIGATOR
            </div>
            <nav className="flex flex-col space-y-2">
              {
                /* Personal nav items */
                personalNav.map((item, idx) => (
                  <Link
                    key={idx}
                    to={item.link}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition ${
                      activeMenu === item.name ? 'bg-muted' : ''
                    }`}
                    onClick={() => setActiveMenu(item.name)}
                  >
                    {item.icon}
                    <span className="text-sm">{item.name}</span>
                  </Link>
                ))
              }
            </nav>
          </div>
          {/* profile nav */}
          <div className="p-6">
            <div className="text-xs font-semibold mb-3 text-muted-foreground tracking-wider">
              Profile
            </div>
            <Link
              to="./profile"
              className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition ${
                activeMenu === 'Profile' ? 'bg-muted' : ''
              }`}
              onClick={() => setActiveMenu('Profile')}
            >
              <User />
              <span>Profile</span>
            </Link>
          </div>

          {/* social account */}
          <div className="mt-auto border-t border-border p-6 flex gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground">
              GitHub
            </a>
            <a href="#" className="hover:text-foreground">
              Instagram
            </a>
            <a href="#" className="hover:text-foreground">
              Facebook
            </a>
          </div>
        </>
      )}
    </div>
  );
};

export default NavBar;
