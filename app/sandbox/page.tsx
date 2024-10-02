'use client'
import React, { useState } from "react";

type Currency = {
  symbol: string;
  name: string;
};

const currencies: Currency[] = [
  { symbol: "$", name: "USD" },
  { symbol: "€", name: "EUR" },
  { symbol: "¥", name: "JPY" },
  { symbol: "₱", name: "PHP" },
  { symbol: "£", name: "GBP" },
];

const PriceInput: React.FC = () => {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currencies[0]);
  const [price, setPrice] = useState<string>("");
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const handleCurrencyChange = (currency: Currency) => {
    setSelectedCurrency(currency);
    setShowDropdown(false); // Close dropdown when a currency is selected
  };

  return (
    <div>
    <div className="flex rounded-full p-2 pl-4 bg-red-300">
      <div className="" >
        <button style={{height:50}} className="bg-blue-300 text-xs w-12 items-center flex gap-2 " onClick={() => setShowDropdown(!showDropdown)}>
          {selectedCurrency.symbol} {selectedCurrency.name}
        </button>
        {showDropdown && (
          <ul className="h-52 flex flex-col bg-white shadow-md p-2 overflow-auto absolute  ">
            {currencies.map((currency, index) => (
              <button key={index} onClick={() => handleCurrencyChange(currency)}>
                {currency.symbol} - {currency.name}
              </button>
            ))}
          </ul>
        )}
      </div>
      <input
        type="text"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Enter price"
        className="price-input rounded-full p-2"
      />
    </div>
    </div>
  );
};



export default function Sandbox(){
  return (
    <div className="h-screen w-screen">
      <div style={{width: 400}} className="bg-green-300 ">
      <PriceInput/>
      </div>
     
     
    </div>
  )
}