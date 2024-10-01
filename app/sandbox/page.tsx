'use client'

import React, { useState } from 'react';

interface HourSelectorProps {
  initialHour?: number;
  onSelect: () => void;
}

function HourSelector({ initialHour = 8, onSelect}: HourSelectorProps) {
  const [selectedHour, setSelectedHour] = useState<number | null>(initialHour);
  const [showOptions, setShowOptions] = useState(false);

  const handleHourClick = (hour: number) => {
    setSelectedHour(hour);
    setShowOptions(false);
    onSelect();
  };

  const handleOptionsClick = () => {
    setShowOptions(!showOptions);
  };

  return (
    <div>
      <span
        className="rounded border bg-gray-200 pl-2 pr-2"
        onClick={handleOptionsClick}
      >
        {selectedHour !== null ? `${selectedHour}:00` : '8:00'}
      </span>
      {showOptions && (
        <ul className="absolute mt-2 bg-white border rounded shadow-md">
          {Array.from({ length: 12 }, (_, index) => index + 1).map((hour) => (
            <li
              key={hour}
              className={`px-4 py-2 hover:bg-gray-100 ${
                selectedHour === hour ? 'bg-gray-200' : ''
              }`}
              onClick={() => handleHourClick(hour)}
            >
              {hour}:00
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default HourSelector;