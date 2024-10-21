"use client";

import React, {
  useEffect,
  useState,
  useTransition,
} from "react";

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

export default function MyListLeftSection() {


  const userId = useSelector((state: RootState) => state.userData.id);
  // const [events, setEvents] = useState<ServerResponseForEvents[]>([]);
  const events = useSelector((state: RootState) => state.mylist.events);
  const [isEventsPending, startEventsTransition] = useTransition();
  const [highlightedDates, setHighlightedDates] = useState<Date[]>([]);
  const [isClientMounted, setIsClientMounted] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    setIsClientMounted(true);
    const fetchHobbyData = async () => {
      const hobbyData = await getUserHobbies(userId);
      if (hobbyData.status == 200) {
        console.log(hobbyData.message);
      }
    };

    fetchHobbyData();
    startEventsTransition(async () => {
      const results = await getAllEvents(userId);
      console.log(`status: ${results.message}`);
      if (results.data) {
        // setEvents(results.data || []);
        console.log("Payload before dispatch:", results.data);

        dispatch(updateMyListEvents(results.data || []));
        const dates: Date[] = Array.isArray(results.data) ?(results.data as ServerResponseForEvents[]).map(
          (event) => new Date(event.date)
        ) : [];
        console.log(`Dates: ${dates}`);
        setHighlightedDates(dates);
      }
    });
  }, []);

  return (
    <HomeLeftTemplate highlight="mylist">
      <div className="h-full ml-2 ">
        <div className={""}>
          <div>
            <div
              style={{ height: 675 }}
              className=" flex flex-col border rounded-2xl"
            >
              {/* <span>{hobbiesInfo}</span> */}
              {/** My hobbies and interests */}
              <EditableHobbyArea/>
              {/**My events section */}

              <div>
                <div className="flex justify-between">
                  <span>My Events</span>
                  <button
                    className="pl-2 pr-2 bg-blue-600 text-white rounded-full"
                    onClick={() => {
                      dispatch(updateCurrentPopup("addEvent"));
                    }}
                  >
                    Add event
                  </button>
                </div>
                <div>
                  {isEventsPending ? (
                    <div
                      style={{ height: 130 }}
                      className="overflow-auto flex flex-col items-between "
                    >
                      <EventSkeleton />
                      <EventSkeleton />
                      <EventSkeleton />
                    </div>
                  ) : (
                   <div
                      style={{ height: 130 }}
                      className="overflow-auto w-full flex flex-col items-between "
                    >{isClientMounted && <div className="h-full w-full">
                      {events.length > 0 ?
                        events.map((event) => (
                          <button
                            onClick={() => {
                              dispatch(updateEditEventAll({
                                id: event.id,
                                eventTitle: event.eventTitle,
                                date: event.date,
                                userId: event.userId,
                                invitedFriends: event.invitedFriends,
                              }));

                              dispatch(updateCurrentPopup('editEvent'));
                            }}
                            key={event.id}
                            className="w-full hover:bg-gray-300 flex gap-2 items-center justify-between p-2 bg-gray-100 rounded-2xl m-2"
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
                                  width:
                                    event.invitedFriends.length == 1
                                      ? 130
                                      : 100,
                                }}
                              >
                                <span className="truncate">{event.eventTitle}</span>
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
                        )) : 
                        
                        <div className="text-gray-400 w-full h-full flex justify-center items-center ">
                          You have no events
                          
                          </div>}
                        </div>}
                    </div>
                  )}
                </div>
              </div>

              {/**Calendar Section */}
              <div className="transformCalendar flex pr-4 items-center justify-center w-full">
                <EventsCalendar highlightedDates={highlightedDates} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </HomeLeftTemplate>
  );
}
