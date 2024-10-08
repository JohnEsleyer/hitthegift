'use client'

import React, { useEffect, useState } from "react";
import { format, getDaysInMonth, startOfMonth, addDays, isSameDay } from "date-fns";

interface CalendarProps {
  highlightedDates: Date[]; // List of dates to be highlighted
}

export function EventsCalendar({ highlightedDates } : CalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [daysArray, setDaysArray] = useState<Date[]>([]);
  
    useEffect(() => {
      const daysInMonth = getDaysInMonth(currentDate);
      const firstDayOfMonth = startOfMonth(currentDate);
      const days: Date[] = [];
      
      for (let i = 0; i < daysInMonth; i++) {
        days.push(addDays(firstDayOfMonth, i));
      }
  
      setDaysArray(days);
    }, [currentDate]);
  
    const isHighlighted = (day: Date) => {
      return highlightedDates.some(date => isSameDay(day, date));
    };
  
    const goToPreviousMonth = () => {
      setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    };
  
    const goToNextMonth = () => {
      setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    };
  
    return (
      <div className="calendar-container">
        <header className="calendar-header">
          <button onClick={goToPreviousMonth}>Previous</button>
          <h2>{format(currentDate, "MMMM yyyy")}</h2>
          <button onClick={goToNextMonth}>Next</button>
        </header>
        <div className="calendar-grid">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
            <div key={index} className="day-label">
              {day}
            </div>
          ))}
          {daysArray.map((day, index) => (
            <div
              key={index}
              className={`day-cell ${isHighlighted(day) ? "highlighted" : ""}`}
            >
              {format(day, "d")}
            </div>
          ))}
        </div>
      </div>
    );
  };

export default function Sandbox(){
      // Example highlighted dates
  const highlightedDates = [
    new Date(2024, 9, 5),  // 5th October 2024
    new Date(2024, 9, 12), // 12th October 2024
    new Date(2024, 9, 18), // 18th October 2024
  ];

  return (
    <div className="App">
      <h1>My Events Calendar</h1>
      <EventsCalendar highlightedDates={highlightedDates} />
    </div>
  );
};