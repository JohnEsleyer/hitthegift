import { useState, ChangeEvent } from "react";

interface DebounceInputProps{
    onUserStopTyping: (value: string) => void;
    onWait: () => void;
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
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
    onChange,
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
        if(onChange){
          onChange(event);
        }
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

