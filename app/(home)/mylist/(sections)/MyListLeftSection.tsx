"use client";

import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";

import React, { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import AddEventPopUp from "../(components)/AddEventPopUp";
import { useDispatch, useSelector } from "react-redux";
import { updateHobbyInfo, updateUserData } from "@/lib/features/userData";
import { RootState } from "@/lib/store";
import Image from 'next/image';
import Loading from '/public/loading.svg';
import getUserHobbies from "@/app/actions/user/getUserHobbies";
import EditableHobbyArea from "../(components)/EditableHobbyArea";

export default function HomeLeftSection() {
  const [dateSelected, setDateSelected] = React.useState<Date | undefined>(new Date());
//   const hobbiesInfo = useSelector((state: RootState) => state.userData.hobbyInfo);
  const [hobbiesInfo, setHobbiesInfo] = useState('');
  const [showAddEventUI, setShowAddEventUI] = useState<boolean>(false);
  const userId = useSelector((state: RootState) => state.userData.id);

  const dispatch = useDispatch();


  useEffect(() => {
    const fetchHobbyData = async () => {
        const hobbyData = await getUserHobbies(userId);
        if (hobbyData.status == 200){
            setHobbiesInfo(hobbyData.hobbiesInfo as string);
            console.log(hobbyData.message);
        }
    };

    fetchHobbyData();

  }, []);


  return (
    
    <div className="h-full ml-2 ">
        {/*Terms and conditions */}
        {showAddEventUI && <div 
        style={{zIndex: 100, position: 'absolute'}}
        className=" flex justify-center items-center w-screen h-screen"
        >
          <AddEventPopUp setShowAddEventUI={setShowAddEventUI} dateSelected={dateSelected} setDateSelected={setDateSelected}/>
      </div>}
      <div className={`${showAddEventUI && 'blurcontent'}`}>
      <div className={`border-b border-blue-400 flex justify-center gap-2 pt-2 gap-8`}>
        <Link
          href="/mylist"
          className="text-blue-500"
        >
          My List
        </Link>
        <Link
          className=""
          href="/friendslist"
        >
          Friends List
        </Link>
      </div>
      <div>
        <div className="mt-4 p-2 flex flex-col">
          {/* <span>{hobbiesInfo}</span> */}
          {/** My hobbies and interests */}
          <EditableHobbyArea/>
          {/**My events section */}
          <div className="mt-4">
            <div className="flex justify-between">
              <span>My Events</span>
              <button 
                className="pl-2 pr-2 bg-blue-600 text-white rounded-full"
                onClick={() => {
                  setShowAddEventUI(true);
                }}
                >
                Add event
              </button>
            </div>
            <div>
              <div className="flex flex-col gap-4 items-between justify-between">
                <div className="">
                  <span
                    style={{ fontSize: 20 }}
                    className="bg-gray-200  font-bold p-2 rounded-full"
                  >
                    20
                  </span>
                  <span>Event Name</span>
                </div>
                <div>
                  <span
                    style={{ fontSize: 20 }}
                    className="bg-gray-200  font-bold p-2 rounded-full"
                  >
                    20
                  </span>
                  <span>Event Name</span>
                </div>
                <div>
                  <span
                    style={{ fontSize: 20 }}
                    className="bg-gray-200  font-bold p-2 rounded-full"
                  >
                    20
                  </span>
                  <span>Event Name</span>
                </div>
              </div>
            </div>
          </div>

          {/**Calendar Section */}
          <div className="flex items-center justify-center mt-2 w-full  border border-black">
            <Calendar
              mode="single"
              className="rounded-md border"
            />
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}