import React from 'react';
import { useTheme } from '@provider/ThemeProvider/ThemeProvider';
import { BsMoonStarsFill } from 'react-icons/bs';
import { MdSunny } from 'react-icons/md';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={
        `p-2 rounded-lg transition-colors ` +
        (theme === 'light'
          ? 'bg-secondary hover:bg-accent text-black'
          : 'bg-card hover:bg-accent text-yellow-300 border border-border shadow-md')
      }
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <span>
          <BsMoonStarsFill className="w-6 h-6" />
        </span>
      ) : (
        <span>
          <MdSunny className="w-6 h-6" />
        </span>
      )}
    </button>
  );
};


