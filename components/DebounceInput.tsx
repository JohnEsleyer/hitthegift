'use client'


import React, { useState, useEffect, useCallback } from "react";

interface DebouncedInputProps {
  delay: number; // Delay in milliseconds
  onDebouncedChange: (value: string) => void; // Callback to execute when user stops typing
  placeholder: string;
  value: string;
  fontSize: number;
  width: number;
  isCenter: boolean;
}

export default function DebouncedInput({ delay, onDebouncedChange, placeholder, value, fontSize, width, isCenter}: DebouncedInputProps) {
  const [inputValue, setInputValue] = useState<string>(value);

  // Debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      if (inputValue.trim()) {
        onDebouncedChange(inputValue);
      }
    }, delay);

    // Clear the timeout if the inputValue changes (i.e., the user is still typing)
    return () => clearTimeout(handler);
  }, [inputValue, delay, onDebouncedChange]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <input
      style={{fontSize: fontSize, width: width, textAlign: isCenter ? "center" : "left"}}
      type="text"
      value={inputValue}
      onChange={handleChange}
      placeholder={placeholder}
    />
  );
};

