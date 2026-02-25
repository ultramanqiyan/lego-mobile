import { StyleSheet } from 'react-native';
import { COLORS, THEMES } from '../utils/constants';

const baseTheme = {
  colors: {
    primary: COLORS.legoYellow,
    secondary: COLORS.legoBlue,
    accent: COLORS.legoOrange,
    background: COLORS.background,
    surface: COLORS.white,
    text: COLORS.text,
    textLight: COLORS.textLight,
    error: COLORS.error,
    success: COLORS.success,
  },
};

const themes = {
  lego: {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: COLORS.legoYellow,
      secondary: COLORS.legoBlue,
    },
  },
  fairy: {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: '#FF69B4',
      secondary: '#DDA0DD',
      background: '#FFF0F5',
    },
  },
  scifi: {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: '#00D4FF',
      secondary: '#7B68EE',
      background: '#0A0A1A',
      text: '#FFFFFF',
      surface: '#1A1A2E',
    },
  },
  nature: {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: '#4CAF50',
      secondary: '#8BC34A',
      background: '#F1F8E9',
    },
  },
  gamified: {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: '#9C27B0',
      secondary: '#E91E63',
      background: '#1A1A2E',
      text: '#FFFFFF',
      surface: '#2D2D44',
    },
  },
  immersive: {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: '#1A1A2E',
      secondary: '#16213E',
      background: '#0F0F1A',
      text: '#FFFFFF',
      surface: '#1A1A2E',
    },
  },
};

export const getTheme = (themeId) => {
  return themes[themeId] || themes.lego;
};

export const createThemedStyles = (theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    surface: {
      backgroundColor: theme.colors.surface,
    },
    text: {
      color: theme.colors.text,
    },
    textLight: {
      color: theme.colors.textLight,
    },
    primary: {
      backgroundColor: theme.colors.primary,
    },
    primaryText: {
      color: theme.colors.primary,
    },
    secondary: {
      backgroundColor: theme.colors.secondary,
    },
    secondaryText: {
      color: theme.colors.secondary,
    },
  });
};

export default themes;
