"use client"

import React, { useEffect, useState, useTransition } from "react";
import { getMonthName } from "@/utils/getMonthName";
import { RootState } from "@/lib/store";
import { useDispatch, useSelector } from "react-redux";
import EventsCalendar from "@/components/EventsCalendar";
import { InvitedEventsResponse } from "@/lib/types/event";
import { updateEvents } from "@/lib/features/friendslistPage";
import { HomeLeftTemplate } from "@/components/HomeLeftTemplate";
import FriendEventSkeleton from "@/components/skeletons/FriendEventSkeleton";
import { getAllInvitedEvents } from "@/app/actions/events/getAllInvitedEvents";

export default function FriendsListLeftSection() {
  const dispatch = useDispatch();

  const [isEventsPending, startEventsTransition] = useTransition();
  const userId = useSelector((state: RootState) => state.userData.id);
  const [events, setEvents] = useState<InvitedEventsResponse[]>([]);
  const [displayedEvents, setDisplayedEvents] = useState<InvitedEventsResponse[]>([]);
  const [highlightedDates, setHighlightedDates] = useState<Date[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    startEventsTransition(async () => {
      const currentDate = new Date();
      const results = await getAllInvitedEvents(userId);
      console.log(`status: ${results.message}`);
      if (results) {
        setEvents(results.data || []);
        const dates: Date[] = (
          results.data as InvitedEventsResponse[]
        ).map((event) => new Date(event.date));
        console.log(`Dates: ${dates}`);
        setHighlightedDates(dates);
        dispatch(updateEvents(events));
      }
    });
  }, []);

  useEffect(() => {
    // Filter events by the selected month
    const filteredEvents = events.filter((event) => {
      const tempDate = new Date(event.date);
      if (tempDate.getMonth() == selectedDate.getMonth()){
        return true;
      }

      return false;
    })

    setDisplayedEvents(filteredEvents);
  }, [selectedDate]);


  return (
    <HomeLeftTemplate highlight="friendslist">
      <div className="h-screen ml-2">
      <div style={{ height: 600 }} className="p-2 flex flex-col gap-4 border rounded-2xl ">
        {/**Calendar Section */}
        <div className="flex items-center justify-center mt-2 w-full border rounded-2xl border-gray-100 pr-4 pb-2">
          <EventsCalendar 
            highlightedDates={highlightedDates} 
            onClick={(date) => setSelectedDate(date)}
          />
        </div>
        <div className="flex-1">
          <span>
            Friends{"'"} events in {getMonthName(selectedDate)}
          </span>
          <div className="flex flex-col gap-4 items-between justify-between">
            {isEventsPending ? (
              <div style={{height: 250}} className="overflow-auto">
                <FriendEventSkeleton/>
                <FriendEventSkeleton/>
                <FriendEventSkeleton/>
                <FriendEventSkeleton/>
                <FriendEventSkeleton/>
                <FriendEventSkeleton/>
              </div>
            ) : (
              <div>{
                events.length > 0 ?
              <div style={{height: 250}} className="overflow-auto">
                {displayedEvents.length > 0 ? <div className="">
                {displayedEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex gap-2 items-center justify-between p-2 bg-gray-100 rounded-2xl m-2"
                  >
                    <div
                      style={{ fontSize: 15, width: 30, height: 30 }}
                      className="bg-blue-200 text-blue-600 flex justify-center items-center font-bold rounded-full"
                    >
                      {(new Date(event.date)).getDate()}
                    </div>
                    <p style={{width: 240}} className="truncate">
                      {event.ownerName} {event.eventTitle}
                    </p>
                  </div>
                ))}
                </div> : <div className="h-full flex justify-center items-center text-gray-400">No events for this month</div>}
              </div> : <div className="flex w-full h-full text-gray-400">
                No events to show
                </div>}
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </HomeLeftTemplate>
  );
}
