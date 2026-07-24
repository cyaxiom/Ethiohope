import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, LogIn } from 'lucide-react';
import { useSelector } from 'react-redux';
import { navLinks } from '../../common/navLinks';
import UserProfileDropdown from './UserProfileDropdown';

import { profile_bg } from '../../assets/images/z-index.img';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [openSections, setOpenSections] = useState<Record<any, boolean>>({});
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef(0);
  const [drawerTop, setDrawerTop] = useState(0);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const authState = useSelector((state: any) => state.auth);
  const isLoggedIn = !!authState?.token && !!authState?.user;

  const navRef = useRef(null);

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

  const isNavActive = (path?: string) => {
    if (!path) return false;
    if (path === '/') return location.pathname === '/';
    // Exact match for /about so Contact (/about/contact) stays separate
    if (path === '/about') return location.pathname === '/about';
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 bg-[#0b1224]/90 backdrop-blur-xl border-b border-white/10 text-slate-100"
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
            <button
              aria-label="Open menu"
              onClick={(e) => {
                e.stopPropagation();
                setIsDrawerOpen(true);
              }}
              className="p-2 rounded-md bg-white/5 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/40 md:hidden border border-white/10 cursor-pointer"
            >
              <svg className="w-6 h-6 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-900/40">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="font-bold text-xl tracking-tight text-white">Ethiohope</span>
          </div>

          <ul className="hidden md:flex items-center space-x-1 text-slate-300 font-medium">
            {navLinks.map((link: any, index: number) => {
              const active = isNavActive(link.path);
              return (
                <li key={index} className="relative">
                  {link.path ? (
                    <Link
                      to={link.path}
                      className={`relative text-sm transition-colors duration-200 flex items-center px-3 py-2 rounded-lg ${
                        active ? 'text-white font-semibold' : 'hover:text-white'
                      }`}
                    >
                      {link.name}
                      {active && (
                        <span className="absolute left-3 right-3 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-blue-500 to-emerald-400" />
                      )}
                    </Link>
                  ) : (
                    <div className="text-sm hover:text-white transition-colors duration-200 flex items-center px-3 py-2 cursor-pointer">
                      {link.name}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={handleProfileClick}
                  aria-label="Open profile menu"
                  aria-expanded={isProfileDropdownOpen}
                  className="flex items-center justify-center w-10 h-10 transition-all duration-200 cursor-pointer"
                >
                  <img src={profile_bg} alt="" className="transition-transform duration-200 group-hover:scale-105" />
                  <User className="w-5 h-5 absolute text-white" />
                </button>
                <UserProfileDropdown isOpen={isProfileDropdownOpen} onClose={handleProfileDropdownClose} />
              </div>
            ) : (
              <Link
                to="/login"
                state={{ from: location.pathname }}
                className="px-6 py-2 text-sm font-bold flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-emerald-500 text-white shadow-md shadow-blue-900/30 hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </nav>

      <div aria-hidden={!isDrawerOpen}>
        <div
          className={`fixed inset-0 bg-black/60 z-50 transition-opacity ${
            isDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setIsDrawerOpen(false)}
        />

        <aside
          className={`fixed top-0 left-0 h-full w-72 bg-[#0b1224] border-r border-white/10 z-60 transform transition-transform duration-300 ${
            isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          aria-hidden={!isDrawerOpen}
          style={{ top: drawerTop || 0 }}
        >
          <div className="p-4 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="font-bold text-white">Ethiohope</span>
            </div>
            <button
              onClick={() => setIsDrawerOpen(false)}
              aria-label="Close menu"
              className="p-2 rounded-md hover:bg-white/5 text-slate-300"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="p-4 overflow-y-auto max-h-[calc(100vh-64px)]">
            <ul className="space-y-2">
              {navLinks.map((link: any, idx: number) => {
                const active = isNavActive(link.path);
                return (
                  <li key={idx}>
                    <div className="flex items-center justify-between">
                      {link.path && !link.dropdown ? (
                        <Link
                          to={link.path}
                          onClick={() => setIsDrawerOpen(false)}
                          className={`py-3 px-3 rounded-lg font-medium w-full text-left flex items-center justify-between gap-2 ${
                            active
                              ? 'bg-blue-500/15 text-white border border-blue-400/30'
                              : 'hover:bg-white/5 text-slate-200'
                          }`}
                        >
                          <span>{link.name}</span>
                          {active && (
                            <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-emerald-400 flex-shrink-0" />
                          )}
                        </Link>
                      ) : (
                        <button
                          onClick={() => toggleSection(idx)}
                          className="w-full text-left py-3 px-3 rounded-lg hover:bg-white/5 text-slate-200 font-medium"
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
                            className="block py-2 px-3 rounded-lg hover:bg-white/5 text-sm text-slate-400"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>
      </div>
    </>
  );
}
