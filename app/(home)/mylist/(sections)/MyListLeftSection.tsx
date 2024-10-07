"use client";

import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";

import React, {
  startTransition,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import Link from "next/link";
import AddEventPopUp from "../(components)/AddEventOverlay";
import { useDispatch, useSelector } from "react-redux";
import { updateHobbyInfo, updateUserData } from "@/lib/features/userData";
import { RootState } from "@/lib/store";
import Image from "next/image";
import Loading from "/public/loading.svg";
import getUserHobbies from "@/app/actions/user/getUserHobbies";
import EditableHobbyArea from "../(components)/EditableHobbyArea";
import { updateCurrentOverlay } from "@/lib/features/overlays";
import { getAllEvents } from "@/app/actions/events/getAllEvents";
import { EventData, ServerResponseForEvents } from "@/lib/types/event";
import Avvvatars from "avvvatars-react";


export default function HomeLeftSection() {
  const [dateSelected, setDateSelected] = React.useState<Date | undefined>(
    new Date()
  );
  //   const hobbiesInfo = useSelector((state: RootState) => state.userData.hobbyInfo);
  const [hobbiesInfo, setHobbiesInfo] = useState("");
  const [showAddEventUI, setShowAddEventUI] = useState<boolean>(false);
  const userId = useSelector((state: RootState) => state.userData.id);
  const [events, setEvents] = useState<ServerResponseForEvents[]>([]);
  const [isEventsPending, startEventsTransition] = useTransition();

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchHobbyData = async () => {
      const hobbyData = await getUserHobbies(userId);
      if (hobbyData.status == 200) {
        setHobbiesInfo(hobbyData.hobbiesInfo as string);
        console.log(hobbyData.message);
      }
    };

    fetchHobbyData();
    startEventsTransition(async () => {
      const results = await getAllEvents(userId);
      console.log(`status: ${results.message}`);
      if (results) {
        setEvents(results.data || []);
      }
    });
  }, []);

  return (
    <div className="h-full ml-2 ">
     
      <div className={`${showAddEventUI && "blurcontent"}`}>
        
        <div>
          <div className="mt-4 p-2 flex flex-col border rounded-2xl ">
            {/* <span>{hobbiesInfo}</span> */}
            {/** My hobbies and interests */}
            <EditableHobbyArea />
            {/**My events section */}
            <div className="mt-4">
              <div className="flex justify-between">
                <span>My Events</span>
                <button
                  className="pl-2 pr-2 bg-blue-600 text-white rounded-full"
                  onClick={() => {
                    dispatch(updateCurrentOverlay("addEvent"));
                  }}
                >
                  Add event
                </button>
              </div>
              <div>
                {isEventsPending ? (
                  <div>Loading...</div>
                ) : (
                  <div style={{height: 200}} className="overflow-auto flex flex-col items-between ">
                    {events.map((event) => (
                      <div className="flex gap-2 items-center justify-between p-2 bg-gray-100 rounded-2xl m-2">
                        <div
                          style={{ fontSize: 15, width: 30, height: 30}}
                          className="bg-blue-200 text-blue-600 flex justify-center items-center font-bold rounded-full"
                        >
                          {event.date.getDate()}
                        </div>
                        <div style={{width: 200}} className="flex">
                          <div style={{width:event.invitedFriends.length == 1 ? 130 : 100}}>
                            <p className="truncate">{event.eventTitle}</p>
                          </div>
                          <div 
                            className="flex-1 flex justify-end">
                            {event.invitedFriends.map((friend, index) => {
                              if (index < 2){
                                return (
                                  <Avvvatars 
                                    key={friend.id}
                                    value={`${friend.firstName}`}
                                  />
                                );
                              }
                            })}
                              <span className="text-gray-500 flex items-center">
                            {event.invitedFriends.length < 3 ? 
                            "": 
                            "+" + (event.invitedFriends.length - 2)}
                          </span>
                          </div>
                        
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/**Calendar Section */}
            <div className="flex items-center justify-center mt-2 w-full">
              <Calendar 
                mode="single" 
                className="rounded-md border" 
                classNames={{
                    
                }}
                />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
