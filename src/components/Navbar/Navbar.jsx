import React, { useState, useEffect, useRef } from 'react';
import {Link} from 'react-router-dom';
import { User, ChevronDown } from 'lucide-react';
import { dashboardLinks, navLinks } from '@common/navLinks';
import MegaNavbar from '@components/Navbar/MegaNavbar/MegaNavbar';
import UserProfileDropdown from '@components/Navbar/UserProfileDropdown';
import { ThemeToggle } from '@components/ThemeToggle/ThemeToggle';
import { ChevronDown, User } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

React

import {
  auth_btn_border,
  auth_btn_border_2,
  profile_bg,
} from '../../assets/images/z-index.img';
import { navLinks, dashboardLinks } from '@common/navLinks';
import MegaNavbar from '@components/Navbar/MegaNavbar/MegaNavbar';
import UserProfileDropdown from '@components/Navbar/UserProfileDropdown'; 

export default function Navbar() {
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



  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 shadow-lg transition-transform duration-300 ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        } ${
          isScrolled
            ? 'bg-background/80 backdrop-blur-md backdrop-saturate-150'
            : 'bg-background/50 backdrop-blur-sm'
        }`}
      >
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-7 h-7 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="text-foreground font-bold text-xl tracking-tight">
              Ethiohope
            </span>
          </div>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex space-x-6 text-foreground font-medium">
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
                    className="cursor-pointer text-sm hover:text-cyan-500 transition-colors duration-200 flex items-center py-2"
                  >
                    {link.name}
                  </Link>
                ) : (
                  <div className="cursor-pointer text-sm hover:text-cyan-500 transition-colors duration-200 flex items-center py-2">
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
                  links={dashboardLinks}
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
                    <User className="w-4 h-4 mr-2 text-cyan-400" />
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