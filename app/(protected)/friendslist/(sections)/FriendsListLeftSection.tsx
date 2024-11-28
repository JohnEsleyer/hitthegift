"use client";

import React, { useEffect, useState } from "react";
import { getMonthName } from "@/utils/getMonthName";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";
import EventsCalendar from "@/components/EventsCalendar";
import { InvitedEventsResponse } from "@/lib/types/event";
import { HomeLeftTemplate } from "@/components/HomeLeftTemplate";
import { convertTo12HourFormat, getMeridiem } from "@/utils/convertTo12Hour";
import "@/styles/calendar.css";
import "@/styles/utilities.css";

export default function FriendsListLeftSection() {
  const events = useSelector((state: RootState) => state.friendsListPage.events);
  const [displayedEvents, setDisplayedEvents] = useState<InvitedEventsResponse[]>([]);
  const highlightedDates = useSelector((state: RootState) => state.friendsListPage.highlightedDates);
  const [selectedDate, setSelectedDate] = useState(new Date());

  function findMatchingDay(date1: Date, dates2: Date[]): Date {
    const dayOfWeek = date1.getDate(); 
  
    for (const date2 of dates2) {
      if (dayOfWeek === date2.getDate()) {
        return date2;
      }
    }
    return new Date(); // No matching day found
  }

  const filterEvents = async () => {
    // Filter events by the selected month
    const filteredEvents = events.filter((event) => {
      const tempDate = new Date(event.date);
      return tempDate.getMonth() === selectedDate.getMonth();
    });

    // Sort the filtered events by date (earliest to latest)
    const sortedEvents = filteredEvents.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateA - dateB; // Ascending order (earliest date first)
    });
    setDisplayedEvents(sortedEvents);
  };

  useEffect(() => {
    filterEvents();
  }, [selectedDate, events]);

  return (
    <HomeLeftTemplate highlight="friendslist">
      <div className="w-full">
        <div style={{ height: 600 }} className="p-2 flex flex-col gap-4">
          {/**Calendar Section */}
          <div style={{paddingLeft: 5, paddingRight: 10}} className="rounded-2xl bg-white flex items-center justify-center mt-2 w-full  pr-4 pb-2">
            <EventsCalendar
              invitedEvents={events}
              onClick={(date) => setSelectedDate(date)}
              onSelectDate={(selectedDate) => setSelectedDate(selectedDate)}
            />
          </div>
          <div className="flex justify-between pl-6 pr-6">
              <span style={{fontSize: 14}} className="pl-2">Ends</span>
              <div style={{fontSize: 14}} className="mr-2 rounded border bg-[#e6e6e6] pl-2 pr-2">
                {convertTo12HourFormat(findMatchingDay(selectedDate, highlightedDates).getHours() | new Date().getHours())}:00 {getMeridiem(selectedDate.getHours() | new Date().getHours())}
              </div>
          </div>
          <div className="flex-1">
            <span style={{fontSize: 14}} className="pl-2">
              Friends{"'"} events in {getMonthName(selectedDate)}
            </span>
            <div
              style={{ height: 250 }}
              className="hide-scrollbar overflow-auto bg-white p-2 rounded-2xl flex flex-col gap-4 items-between justify-between "
            >
              <div>
                {events.length > 0 ? (
                  <div>
                    {displayedEvents.length > 0 ? (
                      <div className="">
                        {displayedEvents.map((event) => (
                          <div
                            key={event.id}
                            style={{fontSize: 14}}
                            className="flex gap-2 items-center justify-between p-2 bg-gray-100 rounded-2xl m-2"
                          >
                            <div
                              style={{ fontSize: 15, width: 35, height: 30 }}
                              className="bg-[#d7e6f6] text-[#3774c3] flex justify-center items-center font-bold rounded-full"
                            >
                              {new Date(event.date).getDate()}
                            </div>
                            <p style={{ width: 240 }} className="truncate">
                              {event.ownerName} {event.eventTitle}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div
                        style={{ height: 100 }}
                        className=" flex justify-center items-center w-full text-gray-400"
                      >
                        No events for this month
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    style={{ height: 100 }}
                    className=" flex justify-center items-center w-full text-gray-400"
                  >
                    No events to show
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </HomeLeftTemplate>
  );
}
