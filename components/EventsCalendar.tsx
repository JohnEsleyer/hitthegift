'use client'

import React, {useEffect, useState, useTransition } from "react";
import { format, getDaysInMonth, startOfMonth, addDays, isSameDay, addMonths } from "date-fns";
import {ChevronLeft, ChevronRight } from "lucide-react";
import "@/styles/calendar.css";
import { InvitedEventsResponse, ServerResponseForEvents } from "@/lib/types/event";

interface CalendarProps {
    events?: ServerResponseForEvents[]; 
    invitedEvents?: InvitedEventsResponse[];
    onClick?: (date: Date) => void; 
    onSelectDate?: (date: Date) => void;
}

export default function EventsCalendar({ events, invitedEvents, onClick, onSelectDate} : CalendarProps) {
    const [currentDate, setCurrentDate] = useState<Date>(new Date()); // Initialize with the first highlighted date or current date
    const [daysArray, setDaysArray] = useState<Date[]>([]);
    const [isFirstTimeSelect, setIsFirstTimeSelect] = useState(true);

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

    // Removed the redundant useEffect 

    const isHighlighted = (day: Date) => {
      if (events){
        return events.some(event => isSameDay(day, event.date));
      }
      if (invitedEvents){
        return invitedEvents.some(event => isSameDay(day, event.date));
      }
      
    };
  
    const goToPreviousMonth = () => {
      setCurrentDate(prev => addMonths(prev, -1)); 
    };
  
    const goToNextMonth = () => {
      setCurrentDate(prev => addMonths(prev, 1)); 
    };

    return (
      <div className="calendar-container">
        <header className="calendar-header">
          <div className="flex items-center">
            {/* Removed unnecessary conditional rendering */}
            <p className="font-bold text-xs">{format(currentDate, "MMMM yyyy")}</p> 
            <ChevronRight color="#208bfe" size={15}/>
          </div>
          <div className="flex">
          <button onClick={goToPreviousMonth}><ChevronLeft color="#208bfe"/></button>
          <button onClick={goToNextMonth}><ChevronRight color="#208bfe" /></button>
          </div>         
        </header>
        <div className="calendar-grid">
          {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day, index) => (
            <div key={index} className="day-label">
              {day}
            </div>
          ))}
          {daysArray.map((day, index) => (
            <div
              key={index}
              className={`day-cell ${isHighlighted(day) ? "text-[#0970f7]" : ""} ${onSelectDate &&  day.getDate() == currentDate.getDate() && !isFirstTimeSelect && 'font-bold highlighted'}`}
            >
              {onSelectDate && isHighlighted(day) ? 
              <button onClick={() => {
                setIsFirstTimeSelect(false);
                setCurrentDate(day);
                onSelectDate(day);
              }}>{format(day, "d")}</button> 
              : <div>
              {format(day, "d")}
              </div>}
            </div>
          ))}
        </div>
    </div>
  );
};  
    