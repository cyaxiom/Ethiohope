import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, LogIn } from 'lucide-react';
import { useSelector } from 'react-redux';
import { dashboardLinks, navLinks } from '../../common/navLinks';
import UserProfileDropdown from './UserProfileDropdown';

import {
  auth_btn_border,
  auth_btn_border_2,
  profile_bg,
} from '../../assets/images/z-index.img';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [openSections, setOpenSections] = useState<Record<any, boolean>>({});
  const [drawerTop, setDrawerTop] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  
  // Real implementation of authentication state using Redux
  const authState = useSelector((state: any) => state.auth);
  const isLoggedIn = !!authState?.token && !!authState?.user;

  const navRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    return () => window.removeEventListener('scroll', throttledHandleScroll);
  }, []);

  const handleProfileClick = () => {
    if (isLoggedIn) {
      setIsProfileDropdownOpen(!isProfileDropdownOpen);
    }
  };

  const handleProfileDropdownClose = () => {
    setIsProfileDropdownOpen(false);
  };

  const toggleSection = (idx: any) => {
    setOpenSections((prev: any) => ({ ...prev, [idx]: !prev[idx] }));
  };

  useEffect(() => {
    const onMouseMove = (e: any) => {
      if (!isDragging) return;
      const newTop = e.clientY - dragStartRef.current;
      setDrawerTop(Math.max(0, Math.min(newTop, window.innerHeight - 120)));
    };

    const onMouseUp = () => {
      if (isDragging) setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging]);




  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 shadow-md bg-white text-black`}
        style={{
          backgroundColor: 'var(--header-bg, #fff)',
          color: '#181A20',
        }}
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Left: hamburger (mobile) + Logo + Ethiohope text */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
            <button
              aria-label="Open menu"
              onClick={(e) => {
                e.stopPropagation();
                setIsDrawerOpen(true);
              }}
              className="p-2 rounded-md bg-white/80 hover:bg-muted/50 focus:outline-none focus:ring-2 md:hidden border border-border shadow cursor-pointer"
            >
              <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="w-7 h-7 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm text-black">C</span>
            </div>
            <span className="text-foreground font-bold text-xl tracking-tight" style={{ color: '#181A20', fontWeight: 700 }}>
              Ethiohope
            </span>
          </div>

          {/* Navigation: only visible on md+ */}
          <ul className="hidden md:flex space-x-6 text-foreground font-medium" style={{ color: '#181A20' }}>
            {navLinks.map((link: any, index: number) => (
              <li
                key={index}
                className="relative"
              >
                {link.path ? (
                  <Link
                      to={link.path}
                      className="text-sm hover:text-primary transition-colors duration-200 flex items-center py-2"
                    >
                      <span className="flex items-center">
                        <span>{link.name}</span>
                      </span>
                    </Link>
                ) : (
                  <div className="text-sm hover:text-primary transition-colors duration-200 flex items-center py-2 cursor-pointer">
                    {link.name}
                  </div>
                )}
              </li>
            ))}
          </ul>

          {/* Right Side: always visible, profile icon always shown */}
          <div className="flex items-center space-x-4">
            {/* Profile icon or Login Link conditionally rendered */}
            {isLoggedIn ? (
              <div className="relative cursor-pointer" onClick={handleProfileClick}>
                <div className="flex items-center justify-center w-10 h-10 transition-all duration-200">
                  <img
                    src={profile_bg}
                    alt=""
                    className="transition-transform duration-200 group-hover:scale-105"
                  />
                  <User className="w-5 h-5 absolute text-white" />
                </div>

                <UserProfileDropdown
                  isOpen={isProfileDropdownOpen}
                  onClose={handleProfileDropdownClose}
                />
              </div>
            ) : (
              <Link 
                to="/login"
                state={{ from: location.pathname }}
                className="px-4 py-2 text-sm font-semibold flex items-center gap-2 rounded-full border border-gray-200 hover:bg-gray-100 transition-colors text-black"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Left-side Drawer Overlay + Panel */}
      <div aria-hidden={!isDrawerOpen}>
        {/* overlay */}
        <div
          className={`fixed inset-0 bg-black/40 z-50 transition-opacity ${isDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setIsDrawerOpen(false)}
        />

        {/* drawer panel */}
        <aside
          className={`fixed top-0 left-0 h-full w-72 bg-white z-60 transform transition-transform duration-300 ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`}
          aria-hidden={!isDrawerOpen}
        >
          <div className="p-4 flex items-center justify-between border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-7 h-7 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm text-black">C</span>
              </div>
              <span className="font-bold text-gray-900">Ethiohope</span>
            </div>
            <button onClick={() => setIsDrawerOpen(false)} aria-label="Close menu" className="p-2 rounded-md hover:bg-muted/50">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="p-4 overflow-y-auto max-h-[calc(100vh-64px)]">
            <ul className="space-y-3">
              {navLinks.map((link: any, idx: number) => (
                <li key={idx}>
                  <div className="flex items-center justify-between">
                    {link.path && !link.dropdown ? (
                      <Link to={link.path} onClick={() => setIsDrawerOpen(false)} className="py-3 px-3 rounded-md hover:bg-gray-50 text-gray-800 font-medium w-full text-left">
                        {link.name}
                      </Link>
                    ) : (
                      <button
                        onClick={() => toggleSection(idx)}
                        className="w-full text-left py-3 px-3 rounded-md hover:bg-gray-50 text-gray-800 font-medium"
                      >
                        <span>{link.name}</span>
                      </button>
                    )}
                  </div>

                      {link.dropdown && (
                        <div className={`mt-2 pl-4 space-y-1 ${openSections[idx] ? 'block' : 'hidden'}`}>
                          {link.dropdown.map((sub: any, sidx: number) => (
                        <Link
                          key={sidx}
                          to={sub.path}
                          onClick={() => setIsDrawerOpen(false)}
                          className="block py-2 px-3 rounded-md hover:bg-gray-50 text-sm text-gray-800"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>

            </nav>
        </aside>
      </div>



    </>
  );
}