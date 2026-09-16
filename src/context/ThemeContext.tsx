import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { ThemeMode, DashboardDensity, AccentColor } from '../types/profile';

interface ThemeContextType {
  theme: ThemeMode;
  resolvedTheme: 'dark' | 'light';
  density: DashboardDensity;
  accent: AccentColor;
  setTheme: (theme: ThemeMode) => void;
  setDensity: (density: DashboardDensity) => void;
  setAccent: (accent: AccentColor) => void;
  toggleTheme: () => void;
}

const THEME_STORAGE_KEY = 'zenith_theme_mode';
const DENSITY_STORAGE_KEY = 'zenith_density_mode';
const ACCENT_STORAGE_KEY = 'zenith_accent_color';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    return (localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode) || 'dark';
  });

  const [density, setDensityState] = useState<DashboardDensity>(() => {
    return (localStorage.getItem(DENSITY_STORAGE_KEY) as DashboardDensity) || 'comfortable';
  });

  const [accent, setAccentState] = useState<AccentColor>(() => {
    return (localStorage.getItem(ACCENT_STORAGE_KEY) as AccentColor) || 'emerald';
  });

  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>('dark');

  // Compute resolved theme for 'system'
  useEffect(() => {
    const updateTheme = () => {
      let resolved: 'dark' | 'light' = 'dark';
      if (theme === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        resolved = prefersDark ? 'dark' : 'light';
      } else {
        resolved = theme;
      }
      setResolvedTheme(resolved);
      document.documentElement.setAttribute('data-theme', resolved);
    };

    updateTheme();

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => updateTheme();
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [theme]);

  // Apply density
  useEffect(() => {
    document.documentElement.setAttribute('data-density', density);
  }, [density]);

  // Apply accent
  useEffect(() => {
    document.documentElement.setAttribute('data-accent', accent);
  }, [accent]);

  const setTheme = useCallback((newTheme: ThemeMode) => {
    setThemeState(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
  }, []);

  const setDensity = useCallback((newDensity: DashboardDensity) => {
    setDensityState(newDensity);
    localStorage.setItem(DENSITY_STORAGE_KEY, newDensity);
  }, []);

  const setAccent = useCallback((newAccent: AccentColor) => {
    setAccentState(newAccent);
    localStorage.setItem(ACCENT_STORAGE_KEY, newAccent);
  }, []);

  const toggleTheme = useCallback(() => {
    const nextTheme: ThemeMode = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  }, [resolvedTheme, setTheme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        density,
        accent,
        setTheme,
        setDensity,
        setAccent,
        toggleTheme
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
