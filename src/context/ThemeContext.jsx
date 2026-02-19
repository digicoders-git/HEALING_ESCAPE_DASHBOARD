import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const colors = {
    dark: {
      background: "#0F172A",
      sidebar: "#1E293B",
      primary: "#0EA5E9",
      accent: "#38BDF8",
      warning: "#FACC15",
      text: "#FFFFFF",
      textSecondary: "#94A3B8",
    },
    light: {
      background: "#F8FAFC",
      sidebar: "#FFFFFF",
      primary: "#006cb5",
      accent: "#E2E8F0",
      warning: "#EAB308",
      text: "#1E293B",
      textSecondary: "#64748B",
    },
  };

  const theme = {
    colors: colors[isDarkMode ? "dark" : "light"],
    isDarkMode,
    toggleTheme: () => setIsDarkMode(!isDarkMode),
  };

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};
