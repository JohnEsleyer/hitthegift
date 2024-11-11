"use client";

import { useEffect, useState } from "react";
import '@/styles/RGBButton.css';
import '@/styles/GlowingBorder.css';



interface PriceInputProps {
  initialValue?: number;
  currency?: string;
  onChange: (value: number | undefined) => void;
}

const PriceInput: React.FC<PriceInputProps> = ({
  initialValue = 0,
  currency = 'USD',
  onChange,
}) => {
  const [value, setValue] = useState<string>(initialValue.toString());

  useEffect(() => {
    setValue(initialValue.toString());
  }, [initialValue]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    const numericValue = parseFloat(inputValue.replace(/[^0-9.]/g,   
 ''));

    if (!isNaN(numericValue)) {
      setValue(inputValue);
      onChange(numericValue);
    } else {
      setValue('');
      onChange(undefined);
    }
  };

  const formatCurrency = (value: string) => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    });

    return formatter.format(parseFloat(value));
  };

  return (
    <div>
      <input type="text" value={value} onChange={handleChange} />
      <span>{formatCurrency(value)}</span>
    </div>
  );
};


export default function Sandbox() {
  const handlePriceChange = (value: number | undefined) => {
    console.log('Price changed:', value);
  };


  return (
    <div>
    <div>
      <PriceInput initialValue={100} currency="EUR" onChange={handlePriceChange} />
    </div>
    </div>
  );
}
