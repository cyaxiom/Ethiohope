import { useState } from 'react';
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Home,
  Search,
  List,
  Tag,
  BarChart,
  User,
  MessageSquare,
  Heart,
} from 'lucide-react';

export default function Sidebar({ isLoggedIn }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [activeMenu, setActiveMenu] = useState('Questions');

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
    <div className="border-r border-border bg-background flex flex-col">
      {/* Top Section */}
      <div className="p-6">
        {/* Search */}
        <div className="relative mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="w-full p-2 pr-10 text-sm border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Search className="w-4 h-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Menu */}
        <div className="text-xs font-semibold mb-3 text-muted-foreground tracking-wider">
          MENU
        </div>
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
}
