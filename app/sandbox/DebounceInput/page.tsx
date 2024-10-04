'use client'


import React, { useState, useEffect, useCallback } from "react";

interface DebouncedInputProps {
  delay: number; // Delay in milliseconds
  onDebouncedChange: (value: string) => void; // Callback to execute when user stops typing
}

export function DebouncedInput({ delay, onDebouncedChange }: DebouncedInputProps) {
  const [inputValue, setInputValue] = useState<string>("");

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
      type="text"
      value={inputValue}
      onChange={handleChange}
      placeholder="Start typing..."
    />
  );
};

export default function Sandbox(){
  return (
    <div>
      <DebouncedInput 
        delay={2000}
        onDebouncedChange={(value) => {
          console.log(value);
        }}
      />
    </div>
  )
}