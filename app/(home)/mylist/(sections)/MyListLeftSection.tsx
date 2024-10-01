"use client";

import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import AddEventPopUp from "../(components)/AddEventPopUp";
import { useDispatch, useSelector } from "react-redux";
import { updateHobbyInfo, updateUserData } from "@/lib/features/userData";
import { RootState } from "@/lib/store";
import Image from 'next/image';
import Loading from '/public/loading.svg';

export default function HomeLeftSection() {
  const [dateSelected, setDateSelected] = React.useState<Date | undefined>(new Date());
  const hobbiesInfo = useSelector((state: RootState) => state.userData.hobbyInfo);
 
  const [showAddEventUI, setShowAddEventUI] = useState<boolean>(false);

  const dispatch = useDispatch();

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log("Value to dispatch: " + event.target.value);
    dispatch(updateHobbyInfo(event.target.value));
    console.log('dispatch() for updateUserData executed!');

    // setTimeout(() => {
    //   if (textareaHobbyRef.current) {
    //     textareaHobbyRef.current.target.focus();
    //   }
    // }, 3000);
  };

  useEffect(() => {
    
    console.log('useEffect for textareaHobby executed!');
  }, [hobbiesInfo]);



  return (
    
    <div className="h-full ml-2 ">
        {/*Terms and conditions */}
        {showAddEventUI && <div 
        style={{zIndex: 100, position: 'absolute'}}
        className=" flex justify-center items-center w-screen h-screen"
        >
          <AddEventPopUp setShowAddEventUI={setShowAddEventUI} dateSelected={dateSelected} setDateSelected={setDateSelected}/>
      </div>}
      <div className="border-b border-blue-400 flex justify-center gap-2 pt-2 gap-8">
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
          <div className="flex flex-col border p-2 rounded-2xl">
            <span className="text-xl mb-6">My hobbies and interest</span>
            <Textarea
              key={"hobbiesInfo"}
              style={{height: 200}}
              className="border border-2xl rounded-2xl "
         
              value={hobbiesInfo}
              onChange={(e)=>{
                handleInputChange(e);
              }}
            />
            {/* <span 
              className="text-gray-600 flex justify-end"
              >
              {hobbiesInfo.length + "/500"}
              </span> */}
          </div>
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
  );
}