import React from "react";
import { useTheme } from "../../context/ThemeContext";

const Toggle = ({ checked, onChange }) => {
  const { colors, currentTheme, isDarkMode } = useTheme();
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      className={`w-10 h-5 cursor-pointer rounded-full transition-all duration-300 relative ${
        checked ? "bg-opacity-100" : "bg-opacity-20"
      }`}
      style={{
        backgroundColor:
          currentTheme === "mono" && isDarkMode
            ? "#6B7280"
            : checked
            ? colors.accent
            : colors.accent || "#888888",
      }}
    >
      <div
        className="w-4 h-4 rounded-full absolute top-0.5 transition-all duration-300 shadow-sm"
        style={{
          backgroundColor: checked ? "green" : "red",
          left: checked ? "calc(100% - 18px)" : "2px",
        }}
      ></div>
    </button>
  );
};

export default Toggle;
