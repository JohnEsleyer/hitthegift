'use client'

import React, { useEffect, useState } from "react";
import { format, getDaysInMonth, startOfMonth, addDays, isSameDay } from "date-fns";
import { ChevronLast, ChevronLeft, ChevronRight } from "lucide-react";


interface CalendarProps {
    highlightedDates: Date[]; // List of dates to be highlighted
    onClick?: (date: Date) => void; // onClick callback for when user clicks on Next or Previous buttons.
  }


export default function EventsCalendar({ highlightedDates, onClick } : CalendarProps) {
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
      if (onClick){
        onClick(currentDate);
      }
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
          <button onClick={goToPreviousMonth}><ChevronLeft/></button>
          <h2>{format(currentDate, "MMMM yyyy")}</h2>
          <button onClick={goToNextMonth}><ChevronRight/></button>
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
