"use client";

import React, { useEffect, useState, useTransition } from "react";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";

import getUserHobbies from "@/app/actions/user/getUserHobbies";
import EditableHobbyArea from "../(components)/EditableHobbyArea";
import { updateCurrentPopup } from "@/lib/features/popups";
import { getAllEvents } from "@/app/actions/events/getAllEvents";
import { ServerResponseForEvents } from "@/lib/types/event";
import Avvvatars from "avvvatars-react";
import EventsCalendar from "@/components/EventsCalendar";
import { HomeLeftTemplate } from "@/components/HomeLeftTemplate";
import EventSkeleton from "@/components/skeletons/EventSkeleton";
import { updateMyListEvents } from "@/lib/features/mylist";
import { updateEditEventAll } from "@/lib/features/editEventsPopup";
import UserProfileImage from "@/components/UserProfileImage";
import '@/styles/calendar.css';
import '@/styles/skeletons.css';
import '@/styles/switch.css';
import '@/styles/utilities.css';


export default function MyListLeftSection() {

  const userId = useSelector((state: RootState) => state.userData.id);
  // const [events, setEvents] = useState<ServerResponseForEvents[]>([]);
  const events = useSelector((state: RootState) => state.mylist.events);
  // const [isEventsPending, startEventsTransition] = useTransition();
  // const [highlightedDates, setHighlightedDates] = useState<Date[]>([]);
  const highlightedDates = useSelector((state: RootState) => state.mylist.highlightedDates);

  const [isClientMounted, setIsClientMounted] = useState(false);
  const [displayedEvents, setDisplayedEvents] = useState<
    ServerResponseForEvents[]
  >([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const dispatch = useDispatch();

  useEffect(() => {
    setIsClientMounted(true);
  }, []);

  useEffect(() => {
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
  }, [selectedDate, events ]);
        <p className="w-64 pb-4">My hobbies and interests</p>
  return (
    <HomeLeftTemplate highlight="mylist">
      <div className="flex flex-col justify-center ">
      <p className="w-64 pl-4 pt-2 pb-2">My hobbies and interests</p>
      <EditableHobbyArea />

      <div className="flex w-full justify-between pr-2 pl-2">
        <p>My Events</p>
        <button
          style={{width: 100}}
        className="pl-2 pr-2 text-white rounded-full  bg-[#047afe] text-white"
        onClick={() => {
          dispatch(updateCurrentPopup("addEvent"));
        }}
      >
        Add event
      </button>
      </div>
     
      <div style={{width: 300, height: 100}} className=" overflow-auto bg-white rounded-2xl m-2 pb-2">

          <div
            className=" flex flex-col items-center"
          >
            {isClientMounted && (
              <div style={{width:280}} className="h-full">
                {displayedEvents.length > 0 ? (
                  displayedEvents.map((event) => (
                    <button
                      onClick={() => {
                        dispatch(
                          updateEditEventAll({
                            id: event.id,
                            eventTitle: event.eventTitle,
                            date: event.date,
                            userId: event.userId,
                            invitedFriends: event.invitedFriends,
                          })
                        );

                        dispatch(updateCurrentPopup("editEvent"));
                      }}
                      key={event.id}
                      style={{width: 280}}
                      className="hover:bg-gray-300 flex gap-2 items-center justify-between p-2 bg-[#F5F5F5] rounded mt-1 mb-1"
                    >
                      <div
                        style={{ fontSize: 15, width: 30, height: 30 }}
                        className="bg-blue-200 text-blue-600 flex justify-center items-center font-bold rounded-full"
                      >
                        {new Date(event.date).getDate()}
                      </div>
                      <div style={{ width: 200 }} className="flex">
                        <div
                          style={{
                            width: event.invitedFriends.length == 1 ? 130 : 100,
                          }}
                        >
                          <div style={{width:150}} className="truncate text-left">{event.eventTitle}</div>
                        </div>
                        <div className="flex-1 flex justify-end">
                          {event.invitedFriends.map((friend, index) => {
                            if (index < 2) {
                              return (
                                <UserProfileImage
                                  key={friend.id}
                                  userId={friend.id}
                                  userName={friend.firstName}
                                  alt=""
                                  width={30}
                                  height={30}
                                />
                              );
                            }
                          })}
                          <span className="text-gray-500 flex items-center">
                            {event.invitedFriends.length < 3
                              ? ""
                              : "+" + (event.invitedFriends.length - 2)}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-gray-400 w-full h-full flex justify-center items-center ">
                    You have no events
                  </div>
                )}
              </div>
            )}
          </div>
        
      </div>
      {/**Calendar Section */}
      <div style={{width: 332}} className=" transformCalendar flex pr-4 items-center justify-center bg-white rounded-2xl mt-2 ">
        <EventsCalendar
          highlightedDates={highlightedDates}
          onClick={(date) => setSelectedDate(date)}
        />
      </div>
      </div>
      </HomeLeftTemplate>
  );
}
