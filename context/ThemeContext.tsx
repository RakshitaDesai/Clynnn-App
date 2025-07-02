import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

export interface Theme {
  // Background colors
  background: string[];
  backgroundLocations: number[];
  surface: string[];
  surfaceSecondary: string[];
  
  // Text colors
  text: string;
  textSecondary: string;
  textTertiary: string;
  
  // Primary colors
  primary: string;
  primaryLight: string;
  primaryDark: string;
  
  // Status colors
  success: string;
  error: string;
  warning: string;
  info: string;
  
  // UI elements
  border: string;
  borderLight: string;
  card: string[];
  tabBar: string;
  shadow: string;
}

const lightTheme: Theme = {
  // Light theme - Fresh, clean, eco-friendly feeling
  // Perfect for daytime use, outdoor activities, and users who prefer bright environments
  background: ['#FFFFFF', '#FFFFFF', '#FFFFFF'], // Pure white background
  backgroundLocations: [0, 0.5, 1],
  surface: ['rgba(76, 175, 80, 0.08)', 'rgba(102, 187, 106, 0.04)'], // Subtle green tint
  surfaceSecondary: ['rgba(76, 175, 80, 0.12)', 'rgba(102, 187, 106, 0.06)'],
  
  text: '#1B5E20', // Dark green for high contrast
  textSecondary: '#2E7D32', // Medium green
  textTertiary: '#4CAF50', // Lighter green
  
  primary: '#4CAF50', // Vibrant green
  primaryLight: '#66BB6A',
  primaryDark: '#388E3C',
  
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FF9800',
  info: '#2196F3',
  
  border: 'rgba(76, 175, 80, 0.2)',
  borderLight: 'rgba(76, 175, 80, 0.1)',
  card: ['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)'],
  tabBar: '#FFFFFF',
  shadow: 'rgba(76, 175, 80, 0.3)',
};

const darkTheme: Theme = {
  // Dark theme - Deep, mysterious, premium feeling
  // Perfect for evening use, indoor environments, and users who prefer low-light interfaces
  background: ['#0A1F0F', '#0D2818', '#1B3B1F'], // Deep dark green gradient
  backgroundLocations: [0, 0.5, 1],
  surface: ['rgba(102, 187, 106, 0.15)', 'rgba(129, 199, 132, 0.08)'], // Subtle green glow
  surfaceSecondary: ['rgba(102, 187, 106, 0.2)', 'rgba(129, 199, 132, 0.1)'],
  
  text: '#E8F5E8', // Very light green-tinted white
  textSecondary: 'rgba(232, 245, 232, 0.8)', // Semi-transparent light green
  textTertiary: 'rgba(232, 245, 232, 0.6)', // More transparent
  
  primary: '#66BB6A', // Bright green that pops in dark
  primaryLight: '#81C784',
  primaryDark: '#4CAF50',
  
  success: '#66BB6A',
  error: '#EF5350',
  warning: '#FFA726',
  info: '#42A5F5',
  
  border: 'rgba(102, 187, 106, 0.3)',
  borderLight: 'rgba(102, 187, 106, 0.15)',
  card: ['rgba(27, 94, 32, 0.4)', 'rgba(46, 125, 50, 0.2)'],
  tabBar: '#1B5E20',
  shadow: 'rgba(102, 187, 106, 0.4)',
};

type ThemeMode = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  isDark: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>('auto');

  // Determine if dark theme should be active
  const isDark = themeMode === 'auto' 
    ? systemColorScheme === 'dark' 
    : themeMode === 'dark';

  // Get current theme based on mode
  const theme = isDark ? darkTheme : lightTheme;

  const toggleTheme = () => {
    setThemeMode(prev => {
      if (prev === 'auto') return 'light';
      if (prev === 'light') return 'dark';
      return 'auto';
    });
  };

  const value: ThemeContextType = {
    theme,
    themeMode,
    isDark,
    setThemeMode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};