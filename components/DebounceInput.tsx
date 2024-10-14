import { RootState } from "@/lib/store";
import { useState, ChangeEvent } from "react";
import { useSelector } from "react-redux";

interface DebounceInputProps{
    onUserStopTyping: (value: string) => void;
    onWait: () => void;
    placeholder: string;
    fontSize: number;
    delay: number;
    width: number;
    isCenter: boolean;
    value: string;
  }
  
export function DebouncedInput({
    onUserStopTyping,
    onWait,
    placeholder,
    fontSize,
    delay,
    width,
    isCenter,
    value,
}: DebounceInputProps){  
      
      const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
      const [inputValue, setInputValue] = useState(value || '');

      const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const {value} = event.target;
        setInputValue(value);
  
        // Clear the previous timeout
        if (typingTimeout){
          clearTimeout(typingTimeout);
        }
  
        setTypingTimeout(
          setTimeout(() => {
            onUserStopTyping(value);
          }, delay)
        );
        
  
      };
  
      return (
        <input
          type="text"
          value={inputValue}
          onChange={(event) => {
            onWait();
            handleChange(event);
          }}
          placeholder={placeholder}
          style={{width: width, fontSize: fontSize}}
          className={`flex ${isCenter && 'text-center'} `}
        />
      )
  }

