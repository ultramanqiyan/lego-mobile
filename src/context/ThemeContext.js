import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';

const ThemeContext = createContext(null);

const themes = {
  default: {
    id: 'default',
    name: '经典乐高',
    colors: {
      primary: '#FFD500',
      secondary: '#006CB7',
      accent: '#FF6B35',
      background: '#FFF8E7',
      backgroundLight: '#FFFEF5',
      surface: '#FFFFFF',
      text: '#333333',
      textLight: '#666666',
      textMuted: '#999999',
      error: '#E74C3C',
      success: '#27AE60',
      warning: '#F39C12',
      info: '#3498DB',
    },
  },
  immersive: {
    id: 'immersive',
    name: '沉浸故事',
    colors: {
      primary: '#1A1A2E',
      secondary: '#16213E',
      accent: '#0F3460',
      background: '#0F0F1A',
      backgroundLight: '#1A1A2E',
      surface: '#1A1A2E',
      text: '#FFFFFF',
      textLight: '#B0B0B0',
      textMuted: '#808080',
      error: '#E74C3C',
      success: '#27AE60',
      warning: '#F39C12',
      info: '#3498DB',
    },
  },
  gamified: {
    id: 'gamified',
    name: '游戏冒险',
    colors: {
      primary: '#9C27B0',
      secondary: '#E91E63',
      accent: '#FF4081',
      background: '#2D2D44',
      backgroundLight: '#3D3D54',
      surface: '#3D3D54',
      text: '#FFFFFF',
      textLight: '#B0B0B0',
      textMuted: '#808080',
      error: '#E74C3C',
      success: '#27AE60',
      warning: '#F39C12',
      info: '#3498DB',
    },
  },
};

export const ThemeProvider = ({ children }) => {
  const [themeId, setThemeId] = useState('default');
  const [theme, setTheme] = useState(themes.default);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedThemeId = await storage.getTheme();
      if (savedThemeId && themes[savedThemeId]) {
        changeTheme(savedThemeId);
      }
    } catch (error) {
      console.error('Load theme failed:', error);
    }
  };

  const changeTheme = async (newThemeId) => {
    try {
      const newTheme = themes[newThemeId] || themes.default;
      setThemeId(newThemeId);
      setTheme(newTheme);
      await storage.setTheme(newThemeId);
    } catch (error) {
      console.error('Change theme failed:', error);
    }
  };

  const value = {
    themeId,
    theme,
    themes: Object.values(themes),
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
