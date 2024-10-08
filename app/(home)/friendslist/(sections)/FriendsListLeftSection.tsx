"use client";

import React, { useEffect, useState, useTransition } from "react";
import { getMonthName } from "@/utils/getMonthName";
import { getMonthlyInvitedEvents } from "@/app/actions/events/getMonthlyInvitedEvents";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";
import EventsCalendar from "@/components/EventsCalendar";

interface MonthlyInvitedEventsResponse {
  id: string;
  userId: string;
  date: Date;
  eventTitle: string;
  invitedFriends: string[];
  ownerName: string;
}

export default function FriendsListLeftSection() {
  const [isEventsPending, startEventsTransition] = useTransition();
  const userId = useSelector((state: RootState) => state.userData.id);
  const [events, setEvents] = useState<MonthlyInvitedEventsResponse[]>([]);
  const [highlightedDates, setHighlightedDates] = useState<Date[]>([]);

  useEffect(() => {
    startEventsTransition(async () => {
      const results = await getMonthlyInvitedEvents(userId, 10);
      console.log(`status: ${results.message}`);
      if (results){
          setEvents(results.data || []);
          const dates: Date[] = (results.data as MonthlyInvitedEventsResponse[]).map((event) => event.date);
          console.log(`Dates: ${dates}`);
          setHighlightedDates(dates);
      }
    });
  }, []);


  return (
    <div className="h-full">
      <div>
        <div className="p-2 flex flex-col gap-4 ">
          {/**Calendar Section */}
          <div className="flex items-center justify-center mt-2 w-full">
            <EventsCalendar highlightedDates={highlightedDates}/> 
          </div>
          <div>
            <span>Friends{"'"} events in {getMonthName(new Date())}</span>
            <div className="flex flex-col gap-4 items-between justify-between">
             {isEventsPending ? 
             <div>Loading...</div> : 
             <div>
                {events.map((event) => (
                  <div key={event.id} className="flex gap-2 items-center justify-between p-2 bg-gray-100 rounded-2xl m-2">
                    <div
                          style={{ fontSize: 15, width: 30, height: 30}}
                          className="bg-blue-200 text-blue-600 flex justify-center items-center font-bold rounded-full"
                        >
                          {event.date.getDate()}
                        </div>
                    <p className="truncate">{event.ownerName} {event.eventTitle}</p>
                  </div>

                ))}
              </div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
