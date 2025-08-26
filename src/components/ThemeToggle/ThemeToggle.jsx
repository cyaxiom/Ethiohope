import React from 'react';
import { useTheme } from '@provider/ThemeProvider/ThemeProvider';
import { BsMoonStarsFill } from 'react-icons/bs';
import { MdSunny } from 'react-icons/md';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-secondary hover:bg-accent transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <span>
          <BsMoonStarsFill />
        </span>
      ) : (
        <span>
          <MdSunny />
        </span>
      )}
    </button>
  );
};
