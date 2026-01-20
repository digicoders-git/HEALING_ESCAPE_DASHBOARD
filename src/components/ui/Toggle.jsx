import React from "react";
import { useTheme } from "../../context/ThemeContext";

const Toggle = ({ checked, onChange }) => {
  const { colors } = useTheme();
  
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      className="relative inline-flex items-center cursor-pointer transition-all duration-300"
      style={{
        width: '48px',
        height: '24px',
        borderRadius: '12px',
        border: `2px solid ${checked ? colors.primary : colors.primary}`,
        backgroundColor: checked ? colors.primary : 'transparent',
        padding: '2px',
      }}
    >
      <div
        className="flex items-center justify-center transition-all duration-300 ease-out"
        style={{
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          backgroundColor: checked ? colors.background : colors.text,
          transform: checked ? 'translateX(26px)' : 'translateX(1px)',
          boxShadow: checked ? `0 0 0 1px ${colors.primary}` : `0 0 0 1px ${colors.accent}`,
        }}
      >
        {checked ? (
          <svg
            width="12"
            height="12"
            viewBox="0 0 20 20"
            fill="none"
            style={{ color: colors.primary }}
          >
            <path
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              fill="currentColor"
            />
          </svg>
        ) : (
          <svg
            width="10"
            height="10"
            viewBox="0 0 16 16"
            fill="none"
            style={{ color: colors.background }}
          >
            <path
              d="M12.8 4.8L11.2 3.2 8 6.4 4.8 3.2 3.2 4.8 6.4 8 3.2 11.2 4.8 12.8 8 9.6l3.2 3.2 1.6-1.6L9.6 8l3.2-3.2z"
              fill="currentColor"
            />
          </svg>
        )}
      </div>
    </button>
  );
};

export default Toggle;