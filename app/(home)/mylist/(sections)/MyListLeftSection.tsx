"use client";

import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";

import React from "react";
import Link from "next/link";

export default function HomeLeftSection() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
//   const [hobbiesInfo, setHobbiesInfo] = useState("");

//   const [textareaHobby, setTextareaHobby] = useState(hobbiesInfo);
//   const textareaHobbyRef =
//     useRef<React.ChangeEvent<HTMLTextAreaElement> | null>(null);

//   const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
//     setHobbiesInfo(event.target.value);

//     // Focus the textarea back after a short delay to avoid flickering
//     setTimeout(() => {
//       if (textareaHobbyRef.current) {
//         textareaHobbyRef.current.target.focus();
//       }
//     }, 3000);
//   };

  return (
    <div className="h-full">
      <div className="flex justify-center gap-2">
        <Link
          href="/mylist"
        >
          My List
        </Link>
        <Link
          href="/friendslist"
        >
          Friends List
        </Link>
      </div>
      <div>
        <div className="p-2 flex flex-col">
          {/* <span>{hobbiesInfo}</span> */}
          {/** My hobbies and interests */}
          <div className="flex flex-col h-40 ">
            <span>My hobbies and interest</span>
            <Textarea
              key={"hobbiesInfo"}
              className="h-32"
              placeholder={
                "Welcome to my wish list! These are the things I would love to have, and I would be so happy if you could gift me something from here."
              }
              value={''}
              onChange={()=>{}}
            />
          </div>
          {/**My events section */}
          <div className="mt-4">
            <div className="flex justify-between">
              <span>My Events</span>
              <button className="pl-2 pr-2 bg-blue-600 text-white rounded-full">
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
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
