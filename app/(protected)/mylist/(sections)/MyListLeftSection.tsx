"use client";

import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import EditableHobbyArea from "../(components)/EditableHobbyArea";
import { updateCurrentPopup } from "@/lib/features/popups";
import EventsCalendar from "@/components/EventsCalendar";
import { HomeLeftTemplate } from "@/components/HomeLeftTemplate";
import { updateEditEventAll } from "@/lib/features/editEventsPopup";
import UserProfileImage from "@/components/UserProfileImage";
import "@/styles/calendar.css";
import "@/styles/skeletons.css";
import "@/styles/switch.css";
import "@/styles/utilities.css";

export default function MyListLeftSection() {
  const events = useSelector((state: RootState) => state.mylist.events);
  const highlightedDates = useSelector((state: RootState) => state.mylist.highlightedDates);
  const [isClientMounted, setIsClientMounted] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    setIsClientMounted(true);
  }, []);

  <p className="w-64 pb-4" style={{fontSize: 14}}>My hobbies and interests</p>;
  return (
    <HomeLeftTemplate highlight="mylist">
      <div className="flex flex-col justify-center ">
        <p className="w-64 pl-4 pt-2 pb-2">My hobbies and interests</p>
        <EditableHobbyArea />
        <div className="flex w-full justify-between pr-2 pl-2">
          <p style={{fontSize: 14}}>My Events</p>
          <button
            style={{ width: 75, fontSize: 12, paddingLeft:5, paddingRight: 5 }}
            className=" text-white rounded-full  bg-[#047afe] text-white"
            onClick={() => {
              dispatch(updateCurrentPopup("addEvent"));
            }}
          >
            Add event
          </button>
        </div>

        <div
          style={{height: 100 }}
          className=" overflow-auto bg-white rounded-2xl m-2 pb-2"
        >
          <div className=" flex flex-col items-center">
            {isClientMounted && (
              <div style={{ width: 240 }} className="h-full">
                {events ? (
                  events.map((event) => (
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
                      style={{ width: 240 }}
                      className="hover:bg-gray-300 flex items-center p-2 bg-[#F5F5F5] rounded mt-1 mb-1"
                    >
                      <div
                        style={{ fontSize: 15, width: 30, height: 30, marginRight: 10 }}
                        className="bg-[#d7e6f6] text-[#3774c3] flex justify-center items-center font-bold rounded-full"
                      >
                        {new Date(event.date).getDate()}
                      </div>
                      <div style={{ width: 200 }} className="flex">
                          <div
                            style={{
                              width: event.invitedFriends.length == 1 ? 130 : 125,
                            }}
                            className=" truncate text-left text-xs flex items-center"
                          >
                            {event.eventTitle}
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
                                  width={25}
                                  height={25}
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
        <div
          style={{ width: 332 }}
          className=" transformCalendar flex pr-4 items-center justify-center bg-white rounded-2xl mt-2 "
        >
          <EventsCalendar
            events={events}
          />
        </div>
      </div>
    </HomeLeftTemplate>
  );
}
