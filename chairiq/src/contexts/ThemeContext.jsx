import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme && ['light', 'dark', 'system']?.includes(storedTheme)) {
        return storedTheme;
      }
    }
    // New visitors default to dark — the ChairIQ signature theme
    return 'dark';
  });
  const [resolvedTheme, setResolvedTheme] = useState('dark');

  // Detect system preference
  const getSystemTheme = () => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)')?.matches ? 'dark' : 'light';
    }
    return 'light';
  };

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme && ['light', 'dark', 'system']?.includes(storedTheme)) {
      setTheme(storedTheme);
    } else {
      // New visitors default to dark — the ChairIQ signature theme
      setTheme('dark');
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    const root = window.document?.documentElement;
    const effectiveTheme = theme === 'system' ? getSystemTheme() : theme;
    
    setResolvedTheme(effectiveTheme);
    
    // Remove both classes first
    root.classList?.remove('light', 'dark');
    
    // Add the effective theme class
    root.classList?.add(effectiveTheme);
    
    // Store preference
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const newSystemTheme = mediaQuery?.matches ? 'dark' : 'light';
      setResolvedTheme(newSystemTheme);
      const root = window.document?.documentElement;
      root.classList?.remove('light', 'dark');
      root.classList?.add(newSystemTheme);
    };

    mediaQuery?.addEventListener('change', handleChange);
    return () => mediaQuery?.removeEventListener('change', handleChange);
  }, [theme]);

  const toggleTheme = (newTheme) => {
    if (['light', 'dark', 'system']?.includes(newTheme)) {
      setTheme(newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};