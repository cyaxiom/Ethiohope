import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { User, ChevronDown } from 'lucide-react';
import { dashboardLinks, navLinks } from '@common/navLinks';
import MegaNavbar from '@components/Navbar/MegaNavbar/MegaNavbar';
import UserProfileDropdown from '@components/Navbar/UserProfileDropdown';
import { ThemeToggle } from '@components/ThemeToggle/ThemeToggle';


import {
  auth_btn_border,
  auth_btn_border_2,
  profile_bg,
} from '../../assets/images/z-index.img';

export default function Navbar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [openSections, setOpenSections] = useState({});
  const [drawerTop, setDrawerTop] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef(0);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isLoggedIn] = useState(true);
  const [activeMegaNav, setActiveMegaNav] = useState(null);
  const [megaNavTimeout, setMegaNavTimeout] = useState(null);
  const navRef = useRef(null);
  const megaNavRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
        setIsProfileDropdownOpen(false);
        setActiveMegaNav(null);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
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
  }, [lastScrollY]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!navRef.current || !megaNavRef.current) return;

      const isOverNav = navRef.current.contains(e.target);
      const isOverMegaNav = megaNavRef.current.contains(e.target);

      if (!isOverNav && !isOverMegaNav && activeMegaNav) {
        handleDropdownLeave();
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [activeMegaNav]);

  const handleDropdownEnter = (index) => {
    setIsProfileDropdownOpen(false);

    // Clear any existing timeout
    if (megaNavTimeout) {
      clearTimeout(megaNavTimeout);
      setMegaNavTimeout(null);
    }

    // Set the active mega nav with a slight delay for better UX
    const timeout = setTimeout(() => {
      if (navLinks[index].dropdown) {
        setActiveMegaNav(navLinks[index]);
      }
    }, 150);

    setMegaNavTimeout(timeout);
  };

  const handleDropdownLeave = () => {
    // Set a timeout to close the mega nav after a short delay
    if (megaNavTimeout) {
      clearTimeout(megaNavTimeout);
    }

    const timeout = setTimeout(() => {
      setActiveMegaNav(null);
    }, 300);

    setMegaNavTimeout(timeout);
  };

  const handleMegaNavEnter = () => {
    // Clear the timeout when entering the mega nav to keep it open
    if (megaNavTimeout) {
      clearTimeout(megaNavTimeout);
      setMegaNavTimeout(null);
    }
  };

  const handleMegaNavLeave = () => {
    // Set a timeout to close the mega nav after leaving it
    const timeout = setTimeout(() => {
      setActiveMegaNav(null);
    }, 300);

    setMegaNavTimeout(timeout);
  };

  const handleProfileClick = () => {
    if (isLoggedIn) {
      setIsProfileDropdownOpen(!isProfileDropdownOpen);
      setActiveMegaNav(null);
    }
  };

  const handleProfileDropdownClose = () => {
    setIsProfileDropdownOpen(false);
  };

  const toggleSection = (idx) => {
    setOpenSections((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  useEffect(() => {
    const onMouseMove = (e) => {
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
        className={`fixed top-0 left-0 right-0 z-50 shadow-lg transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'} bg-white dark:bg-[#181A20] text-black dark:text-white'`}
        style={{
          backgroundColor: 'var(--header-bg, #fff)',
          color: '#181A20',
        }}
      >
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          {/* Left: hamburger + Logo */}
          <div className="flex items-center space-x-3">
            <button
              aria-label="Open menu"
              onClick={() => setIsDrawerOpen(true)}
              className="mr-2 p-2 rounded-md hover:bg-muted/50 focus:outline-none focus:ring-2 md:hidden"
            >
              <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Logo */}
            <div className="w-7 h-7 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm text-black dark:text-white">C</span>
            </div>
            <span className="text-foreground font-bold text-xl tracking-tight" style={{ color: '#181A20', fontWeight: 700 }}>
              Ethiohope
            </span>
          </div>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex space-x-6 text-foreground font-medium" style={{ color: '#181A20' }}>
            {navLinks.map((link, index) => (
              <li
                key={index}
                className="relative"
                onMouseEnter={() => handleDropdownEnter(index)}
                onMouseLeave={handleDropdownLeave}
              >
                {link.path ? (
                  <Link
                      to={link.path}
                      className="text-sm hover:text-primary transition-colors duration-200 flex items-center py-2"
                    >
                      <span className="flex items-center">
                        <span>{link.name}</span>
                        {link.name === 'Company' && <ChevronDown className="ml-2 w-4 h-4" />}
                      </span>
                    </Link>
                ) : (
                  <div className="text-sm hover:text-primary transition-colors duration-200 flex items-center py-2">
                    {link.name}
                    {link.dropdown && <ChevronDown className="ml-1 w-4 h-4" />}
                  </div>
                )}
              </li>
            ))}
          </ul>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Auth Button */}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={handleProfileClick}
                  className="flex items-center justify-center w-10 h-10 transition-all duration-200"
                >
                  <img
                    src={profile_bg}
                    alt=""
                    className="transition-transform duration-200 group-hover:scale-105"
                  />
                  <User className="w-5 h-5 absolute text-white" />
                </button>

                <UserProfileDropdown
                  links={[...dashboardLinks]}
                  isOpen={isProfileDropdownOpen}
                  onClose={handleProfileDropdownClose}
                />
              </div>
            ) : (
              <>
                <div className="relative w-24 h-10 flex items-center justify-center group">
                  <img
                    src={auth_btn_border}
                    alt=""
                    className="transition-transform duration-200 group-hover:scale-105"
                  />
                  <button className="absolute text-sm flex items-center text-white font-medium z-10 bg-transparent">
                    <User className="w-4 h-4 mr-2 text-primary" />
                    LOGIN
                  </button>
                </div>
                <div className="relative w-24 h-10 flex items-center justify-center group">
                  <img
                    src={auth_btn_border_2}
                    alt=""
                    className="transition-transform duration-200 group-hover:scale-105"
                  />
                  <button className="absolute text-sm flex items-center text-white font-medium z-10 bg-transparent">
                    SIGN UP
                  </button>
                </div>
              </>
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
          className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-[#0f1720] z-60 transform transition-transform duration-300 ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`}
          aria-hidden={!isDrawerOpen}
        >
          <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-7 h-7 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm text-black dark:text-white">C</span>
              </div>
              <span className="font-bold text-gray-900 dark:text-white">Ethiohope</span>
            </div>
            <button onClick={() => setIsDrawerOpen(false)} aria-label="Close menu" className="p-2 rounded-md hover:bg-muted/50">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="p-4 overflow-y-auto max-h-[calc(100vh-64px)]">
            <ul className="space-y-3">
              {navLinks.map((link, idx) => (
                <li key={idx}>
                  <div className="flex items-center justify-between">
                    {link.path && !link.dropdown ? (
                      <Link to={link.path} onClick={() => setIsDrawerOpen(false)} className="py-3 px-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-100 font-medium w-full text-left">
                        {link.name}
                      </Link>
                    ) : (
                      <button
                        onClick={() => toggleSection(idx)}
                        className="w-full text-left py-3 px-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-100 font-medium"
                      >
                        <span>{link.name}</span>
                      </button>
                    )}
                  </div>

                  {link.dropdown && (
                    <div className={`mt-2 pl-4 space-y-1 ${openSections[idx] ? 'block' : 'hidden'}`}>
                      {link.dropdown.map((sub, sidx) => (
                        <Link
                          key={sidx}
                          to={sub.path}
                          onClick={() => setIsDrawerOpen(false)}
                          className="block py-2 px-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 text-sm text-gray-800 dark:text-gray-100"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>

            <div className="mt-6 border-t pt-4 border-gray-100 dark:border-gray-800">
              <ThemeToggle />
            </div>
          </nav>
        </aside>
      </div>



      {/* Mega Navigation */}
      {activeMegaNav && (
        <div
          ref={megaNavRef}
          onMouseEnter={handleMegaNavEnter}
          onMouseLeave={handleMegaNavLeave}
          className="fixed top-16 left-0 right-0 z-40 transition-opacity duration-300"
          style={{
            pointerEvents: activeMegaNav ? 'auto' : 'none',
            opacity: activeMegaNav ? 1 : 0,
          }}
        >
          <MegaNavbar
            activeNavItem={activeMegaNav}
            navData={navLinks.find((link) => link.name === activeMegaNav.name)}
            onClose={() => setActiveMegaNav(null)}
          />
        </div>
      )}
    </>
  );
}