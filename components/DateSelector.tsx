'use client'

import React, { useEffect, useState } from "react";
import { format, getDaysInMonth, startOfMonth, addDays, isSameDay } from "date-fns";
import { ChevronRight } from "lucide-react";
import "@/styles/calendar.css";
import chevronRight from '/public/chevron-right.svg';
import chevronLeft from '/public/chevron-left.svg';
import Image from 'next/image';

interface CalendarProps {
  selected: Date; // The currently selected date
  onSelect: (date: Date | null) => void; // Callback to update the selected date
}

export default function DateSelector({ selected, onSelect } : CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [daysArray, setDaysArray] = useState<Date[]>([]);
  const [showInitialDate, setShowInitialDate] = useState(true);

  useEffect(() => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOfMonth = startOfMonth(currentDate);
    const days: Date[] = [];
    
    for (let i = 0; i < daysInMonth; i++) {
      days.push(addDays(firstDayOfMonth, i));
    }

    setDaysArray(days);
  }, [currentDate]);

  const isSelected = (day: Date) => {
    return selected ? isSameDay(day, selected) : false;
  };

  const handleDayClick = (day: Date) => {
    onSelect(day);
  };

  const goToPreviousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  return (
    <div className="w-full">
      <header className="calendar-header">
        <div className="flex items-center">
          <p className="font-bold text-xs">{format(currentDate, "MMMM yyyy")}</p>
          <ChevronRight color="#208bfe" size={15}/>
        </div>
        <div style={{paddingRight: 10}} className="flex">
          <button style={{backgroundColor: '#f5f5f5'}} onClick={goToPreviousMonth}><Image src={chevronLeft} alt="chevronLeft" width={16} height={16}/></button>
          <button style={{backgroundColor: '#f5f5f5'}} onClick={goToNextMonth}><Image src={chevronRight} alt="chevronRight" width={16} height={16}/></button>
        </div>
      </header>
      <div className="calendar-grid flex ">
        {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day, index) => (
          <div key={index} className="day-label">
            {day}
          </div>
        ))}

        {daysArray.map((day, index) => (
          <div key={index} className="text-center">
          <button
            key={index}
            style={{width: 35, height: 35}}
            className={` ${isSelected(day) && "bg-[#d8e6f6] rounded-full text-[#027afe]"} ${showInitialDate && day.getDate() == selected.getDate() && 'bg-[#d8e6f6] rounded-full text-[#027afe]' }`}
            onClick={() => {
                setShowInitialDate(false);
                console.log(`Selected: ${selected?.getDate()}`)
                console.log(`Day: ${day?.getDate()}`)
                handleDayClick(day)
            }}
          >
            {format(day, "d")}
          </button>
          </div>
        ))}
      </div>
    </div>
  );
};