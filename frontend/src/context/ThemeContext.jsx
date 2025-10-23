// src/context/ThemeContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

// Crear el contexto
const ThemeContext = createContext();

// Hook personalizado para usar el contexto
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe usarse dentro de un ThemeProvider');
  }
  return context;
};

// Temas disponibles
export const themes = {
  light: {
    name: 'light',
    displayName: 'Claro',
    colors: {
      primary: '#3B82F6',
      secondary: '#64748B',
      accent: '#10B981',
      background: '#FFFFFF',
      surface: '#F8FAFC',
      text: '#1F2937',
      textSecondary: '#6B7280',
      border: '#E5E7EB',
      error: '#EF4444',
      warning: '#F59E0B',
      success: '#10B981',
      info: '#3B82F6',
    },
  },
  dark: {
    name: 'dark',
    displayName: 'Oscuro',
    colors: {
      primary: '#60A5FA',
      secondary: '#94A3B8',
      accent: '#34D399',
      background: '#111827',
      surface: '#1F2937',
      text: '#F9FAFB',
      textSecondary: '#D1D5DB',
      border: '#374151',
      error: '#F87171',
      warning: '#FBBF24',
      success: '#34D399',
      info: '#60A5FA',
    },
  },
};

// Provider del contexto de tema
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(themes.light);

  // Inicializar tema desde localStorage o preferencia del sistema
  useEffect(() => {
    const initializeTheme = () => {
      // Verificar localStorage primero
      const savedTheme = localStorage.getItem('theme');
      
      if (savedTheme) {
        const isDark = savedTheme === 'dark';
        setIsDarkMode(isDark);
        setCurrentTheme(isDark ? themes.dark : themes.light);
      } else {
        // Usar preferencia del sistema
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDarkMode(prefersDark);
        setCurrentTheme(prefersDark ? themes.dark : themes.light);
      }
    };

    initializeTheme();
  }, []);

  // Escuchar cambios en la preferencia del sistema
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      // Solo cambiar si no hay preferencia guardada
      const savedTheme = localStorage.getItem('theme');
      if (!savedTheme) {
        setIsDarkMode(e.matches);
        setCurrentTheme(e.matches ? themes.dark : themes.light);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Función para alternar tema
  const toggleTheme = () => {
    const newIsDarkMode = !isDarkMode;
    setIsDarkMode(newIsDarkMode);
    setCurrentTheme(newIsDarkMode ? themes.dark : themes.light);
    localStorage.setItem('theme', newIsDarkMode ? 'dark' : 'light');
  };

  // Función para establecer tema específico
  const setTheme = (themeName) => {
    const isDark = themeName === 'dark';
    setIsDarkMode(isDark);
    setCurrentTheme(isDark ? themes.dark : themes.light);
    localStorage.setItem('theme', themeName);
  };

  // Función para obtener color del tema actual
  const getColor = (colorName) => {
    return currentTheme.colors[colorName] || colorName;
  };

  // Función para obtener clases CSS del tema
  const getThemeClasses = () => {
    return {
      background: isDarkMode ? 'bg-gray-900' : 'bg-white',
      surface: isDarkMode ? 'bg-gray-800' : 'bg-gray-50',
      text: isDarkMode ? 'text-white' : 'text-gray-900',
      textSecondary: isDarkMode ? 'text-gray-300' : 'text-gray-600',
      border: isDarkMode ? 'border-gray-700' : 'border-gray-200',
      input: isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900',
      card: isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
      button: {
        primary: isDarkMode 
          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
          : 'bg-blue-600 hover:bg-blue-700 text-white',
        secondary: isDarkMode 
          ? 'bg-gray-700 hover:bg-gray-600 text-white border-gray-600' 
          : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300',
        danger: isDarkMode 
          ? 'bg-red-600 hover:bg-red-700 text-white' 
          : 'bg-red-600 hover:bg-red-700 text-white',
        success: isDarkMode 
          ? 'bg-green-600 hover:bg-green-700 text-white' 
          : 'bg-green-600 hover:bg-green-700 text-white',
      },
    };
  };

  // Aplicar variables CSS personalizadas
  useEffect(() => {
    const root = document.documentElement;
    
    Object.entries(currentTheme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
  }, [currentTheme]);

  // Valor del contexto
  const contextValue = {
    // Estado
    isDarkMode,
    currentTheme,
    themeName: currentTheme.name,

    // Acciones
    toggleTheme,
    setTheme,

    // Utilidades
    getColor,
    getThemeClasses,
    themes,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};