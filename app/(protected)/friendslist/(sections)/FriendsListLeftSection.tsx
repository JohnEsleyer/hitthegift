"use client";

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
import '@/styles/calendar.css';
import '@/styles/utilities.css';

export default function FriendsListLeftSection() {
  const dispatch = useDispatch();

  const [isEventsPending, startEventsTransition] = useTransition();
  const userId = useSelector((state: RootState) => state.userData.id);
  const [events, setEvents] = useState<InvitedEventsResponse[]>([]);
  const [displayedEvents, setDisplayedEvents] = useState<
    InvitedEventsResponse[]
  >([]);
  const [highlightedDates, setHighlightedDates] = useState<Date[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

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
}

  useEffect(() => {
    startEventsTransition(async () => {
      const results = await getAllInvitedEvents(userId);
      if (results) {
        setEvents(results.data || []);
        const dates: Date[] = (results.data as InvitedEventsResponse[]).map(
          (event) => new Date(event.date)
        );
        setHighlightedDates(dates);
        dispatch(updateEvents(events));
      }
    });

  }, []);

  useEffect(() => {
    filterEvents();
  }, [selectedDate, events]);

  return (
    <HomeLeftTemplate highlight="friendslist">
      <div className="w-full">
        <div
          style={{ height: 600 }}
          className="p-2 flex flex-col gap-4"
        >
          {/**Calendar Section */}
          <div className="rounded-2xl shadow-xl bg-white flex items-center justify-center mt-2 w-full  pr-4 pb-2">
            <EventsCalendar
              highlightedDates={highlightedDates}
              onClick={(date) => setSelectedDate(date)}
            />
          </div>
          <div className="flex-1">
            <span>
              Friends{"'"} events in {getMonthName(selectedDate)}
            </span>
            <div style={{height: 250}} className="hide-scrollbar overflow-auto bg-white p-2 rounded-2xl shadow-xl flex flex-col gap-4 items-between justify-between ">
              {isEventsPending ? (
                <div>
                  <FriendEventSkeleton />
                  <FriendEventSkeleton />
                  <FriendEventSkeleton />
                  <FriendEventSkeleton />
                  <FriendEventSkeleton />
                  <FriendEventSkeleton />
                </div>
              ) : (
                <div>
                  {events.length > 0 ? (
                    <div>
                      {displayedEvents.length > 0 ? (
                        <div className="">
                          {displayedEvents.map((event) => (
                            <div
                              key={event.id}
                              className="flex gap-2 items-center justify-between p-2 bg-gray-100 rounded-2xl m-2"
                            >
                              <div
                                style={{ fontSize: 15, width: 30, height: 30 }}
                                className="bg-blue-200 text-blue-600 flex justify-center items-center font-bold rounded-full"
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
                        <div style={{height: 100}} className=" flex justify-center items-center w-full text-gray-400">
                        No events for this month
                      </div>
                      )}
                    </div>
                  ) : (
                    <div style={{height: 100}} className=" flex justify-center items-center w-full text-gray-400">
                      No events to show
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </HomeLeftTemplate>
  );
}
