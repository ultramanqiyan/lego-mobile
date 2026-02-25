import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { getTheme, createThemedStyles } from '../styles/colors';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [themeId, setThemeId] = useState('lego');
  const [theme, setTheme] = useState(getTheme('lego'));
  const [themedStyles, setThemedStyles] = useState(createThemedStyles(getTheme('lego')));

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedThemeId = await storage.getTheme();
      if (savedThemeId) {
        changeTheme(savedThemeId);
      }
    } catch (error) {
      console.error('Load theme failed:', error);
    }
  };

  const changeTheme = async (newThemeId) => {
    try {
      const newTheme = getTheme(newThemeId);
      setThemeId(newThemeId);
      setTheme(newTheme);
      setThemedStyles(createThemedStyles(newTheme));
      await storage.setTheme(newThemeId);
    } catch (error) {
      console.error('Change theme failed:', error);
    }
  };

  const value = {
    themeId,
    theme,
    themedStyles,
    changeTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
