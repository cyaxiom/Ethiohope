import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const DASHBOARD_THEME_KEY = 'ethiohope-dashboard-theme';

export const ThemeProvider = ({ children }) => {
  const [dashboardTheme, setDashboardTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light';
    return localStorage.getItem(DASHBOARD_THEME_KEY) || 'light';
  });

  useEffect(() => {
    // Keep the public site on light; dashboard theme is scoped to DashboardLayout.
    document.documentElement.classList.remove('dark');
  }, []);

  useEffect(() => {
    localStorage.setItem(DASHBOARD_THEME_KEY, dashboardTheme);
  }, [dashboardTheme]);

  const toggleDashboardTheme = useCallback(() => {
    setDashboardTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const value = {
    // Public / legacy (forum, contact) — stay light
    theme: 'light',
    isDark: false,
    toggleTheme: toggleDashboardTheme,
    // Dashboard-only dark/light
    dashboardTheme,
    isDashboardDark: dashboardTheme === 'dark',
    toggleDashboardTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
