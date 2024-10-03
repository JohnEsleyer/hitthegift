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
import { EventData } from "@/lib/types/event";

export default function HomeLeftSection() {
  const [dateSelected, setDateSelected] = React.useState<Date | undefined>(
    new Date()
  );
  //   const hobbiesInfo = useSelector((state: RootState) => state.userData.hobbyInfo);
  const [hobbiesInfo, setHobbiesInfo] = useState("");
  const [showAddEventUI, setShowAddEventUI] = useState<boolean>(false);
  const userId = useSelector((state: RootState) => state.userData.id);
  const [events, setEvents] = useState<EventData[]>([]);
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
    startTransition(async () => {
      const results = await getAllEvents(userId);
      console.log(`status: ${results.message}`);
      if (results) {
        setEvents(results.data || []);
      }
    });
  }, []);

  return (
    <div className="h-full ml-2 ">
      {/*Terms and conditions */}
      {showAddEventUI && (
        <div
          style={{ zIndex: 100, position: "absolute" }}
          className=" flex justify-center items-center w-screen h-screen"
        >
          <AddEventPopUp />
        </div>
      )}
      <div className={`${showAddEventUI && "blurcontent"}`}>
        <div
          className={`border-b border-gray-400 flex justify-center gap-2 mt-4 pt-2 gap-8`}
        >
          <Link
            href="/mylist"
            className="text-blue-500 border-b border-blue-400"
          >
            My List
          </Link>
          <Link className="" href="/friendslist">
            Friends List
          </Link>
        </div>
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
              {isEventsPending ? <div>Loading...</div> : <div className="flex flex-col items-between justify-between">
                  
                 {events.map((event) => (
                       <div className="flex gap-2 items-center p-2 bg-gray-100 rounded-2xl m-2">
                       <div
                         style={{ fontSize: 15 }}
                         className="bg-blue-200 text-blue-600 flex justify-center items-center font-bold w-8 h-8 rounded-full"
                       >
                        {event.date.getDay()}
                       </div>
                       <span>{event.eventTitle}</span>
                     </div>
                 ))}
                </div>}
              </div>
            </div>

            {/**Calendar Section */}
            <div className="flex items-center justify-center mt-2 w-full">
              <Calendar mode="single" className="rounded-md border" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
