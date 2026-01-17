// src/components/Loader.jsx
import React from "react";
import { useTheme } from "../../context/ThemeContext";

export default function Loader({ size = 40, className = "", color }) {
  const { isDarkMode, colors } = useTheme();

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className="animate-spin rounded-full border-t-2 border-b-2"
        style={{
          width: size,
          height: size,
          borderColor: color || colors.primary || (isDarkMode ? "#818CF8" : "#4F46E5"),
        }}
      />
    </div>
  );
}
