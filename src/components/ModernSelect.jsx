import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const ModernSelect = ({
  options = [],
  value,
  onChange,
  placeholder = "Select option",
  required = false,
  className = "",
  disabled = false,
}) => {
  const { colors } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const filteredOptions = options.filter((option) => {
    const searchStr = searchTerm.toLowerCase();
    const label =
      option.label || option.name || (typeof option === "string" ? option : "");
    return label.toString().toLowerCase().includes(searchStr);
  });

  const selectedOption = options.find(
    (option) => (option.value || option) === value
  );

  const displayText = selectedOption
    ? selectedOption.label ||
      selectedOption.name ||
      (typeof selectedOption === "string"
        ? selectedOption
        : selectedOption.value)
    : placeholder;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    const optionValue = option.value || option;
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div
        className={`w-full px-4 py-3.5 rounded-xl border-2 outline-none cursor-pointer text-sm font-medium flex items-center justify-between transition-all shadow-sm ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        style={{
          backgroundColor: '#ffffff',
          borderColor: isOpen ? '#006cb5' : '#e5e7eb',
          color: value ? '#000000' : '#64748b',
        }}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onMouseEnter={(e) => {
          if (!isOpen && !disabled) {
            e.currentTarget.style.borderColor = '#006cb5';
          }
        }}
        onMouseLeave={(e) => {
          if (!isOpen && !disabled) {
            e.currentTarget.style.borderColor = '#e5e7eb';
          }
        }}
      >
        <span className="truncate">{displayText}</span>
        <ChevronDown
          size={18}
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          style={{ color: '#006cb5' }}
        />
      </div>

      {isOpen && (
        <div
          className="absolute z-50 w-full mt-2 rounded-xl border-2 shadow-xl max-h-60 overflow-hidden"
          style={{
            backgroundColor: '#ffffff',
            borderColor: '#006cb5',
          }}
        >
          {options.length > 5 && (
            <div
              className="p-2 border-b"
              style={{ borderColor: colors.accent + "20" }}
            >
              <input
                ref={inputRef}
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-1 text-sm rounded border outline-none"
                style={{
                  backgroundColor: colors.sidebar || colors.background,
                  borderColor: colors.accent + "30",
                  color: colors.text,
                }}
                autoFocus
              />
            </div>
          )}

          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div
                className="px-4 py-3 text-sm text-center"
                style={{ color: colors.textSecondary }}
              >
                No options found
              </div>
            ) : (
              filteredOptions.map((option, index) => {
                const optionValue = option.value || option;
                const optionLabel =
                  option.label ||
                  option.name ||
                  (typeof option === "string" ? option : option.value);
                const isSelected = optionValue === value;

                return (
                  <div
                    key={index}
                    className="px-4 py-2.5 cursor-pointer text-sm font-medium flex items-center justify-between transition-all rounded-lg mx-2 my-1"
                    style={{
                      backgroundColor: isSelected
                        ? '#006cb510'
                        : "transparent",
                      color: isSelected ? '#006cb5' : '#000000',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = '#f1f5f9';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }
                    }}
                    onClick={() => handleSelect(option)}
                  >
                    <span className="truncate">{optionLabel}</span>
                    {isSelected && (
                      <Check size={18} style={{ color: '#006cb5' }} />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernSelect;
