import { useState, ChangeEvent } from "react";

interface DebounceInputProps{
    onUserStopTyping: (value: string) => void;
    onWait: () => void;
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    fontSize: number;
    delay: number;
    width: number;
    height: number;
    isCenter: boolean;
    value: string;
    rounded?: boolean;
  }
  
export function DebouncedInput({
    onUserStopTyping,
    onWait,
    onChange,
    placeholder,
    fontSize,
    delay,
    width,
    height,
    isCenter,
    rounded,
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
          style={{width: width, height: height, fontSize: fontSize}}
          className={`flex ${isCenter && 'text-center'} ${rounded && 'border rounded-xl '} p-2 m-2 bg-white w-full`}
        />
      )
  }

