'use client'

import Image from 'next/image';
import giftloading from '/public/giftloading.svg';
import { ChangeEvent, useState } from 'react';



interface DebounceInputProps{
  onUserStopTyping: (value: string) => void;

}

function DebouncedInput({onUserStopTyping}: DebounceInputProps){  
    const [inputValue, setInputValue] = useState('');
    const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

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
        }, 2000)
      );

    };

    return (
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder="Type something..."
        className="border p-2"
      />
    )
}



export default function Sandbox() {
  const [value, setValue] = useState('');


 return (
  <div>
   <h1>The value will be updated when the user stops typing for 2 seconds</h1>
   <p>Value: {value}</p>
   <DebouncedInput onUserStopTyping={(inputValue) => {
    setValue(inputValue);
   }}/>
  </div>
 )
 
}
