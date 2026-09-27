import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);

/**
 * Role-Aware Individual Theme Provider
 * Supports independent, persistent Light/Dark theme modes for each role:
 * - Restaurant Partner
 * - NGO Shelter Portal
 * - Consumer Marketplace
 * - Volunteer Rider App
 * - Super Admin Control Tower
 */
export function ThemeProvider({ children }) {
  const [roleThemes, setRoleThemes] = useState(() => ({
    restaurant: localStorage.getItem('foodrescue_theme_restaurant') || 'light',
    ngo: localStorage.getItem('foodrescue_theme_ngo') || 'light',
    consumer: localStorage.getItem('foodrescue_theme_consumer') || 'light',
    volunteer: localStorage.getItem('foodrescue_theme_volunteer') || 'dark',
    admin: localStorage.getItem('foodrescue_theme_admin') || 'dark'
  }));

  const toggleRoleTheme = (role) => {
    setRoleThemes((prev) => {
      const current = prev[role] || 'light';
      const next = current === 'light' ? 'dark' : 'light';
      localStorage.setItem(`foodrescue_theme_${role}`, next);
      return {
        ...prev,
        [role]: next
      };
    });
  };

  const getRoleTheme = (role) => {
    return roleThemes[role] || 'light';
  };

  return (
    <ThemeContext.Provider value={{ roleThemes, toggleRoleTheme, getRoleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
