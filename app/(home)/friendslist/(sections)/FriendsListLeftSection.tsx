'use client'

import { Calendar } from "@/components/ui/calendar"

import React from "react";
import Link from "next/link";


export default function FriendsListLeftSection(){

    const [date, setDate] = React.useState<Date | undefined>(new Date())



    return (
        <div className="h-full">
              <div className="border-b border-blue-400 flex justify-center gap-2 pt-2 gap-8">
        <Link
          href="/mylist"
         
        >
          My List
        </Link>
        <Link
           className="text-blue-500"
          href="/friendslist"
        >
          Friends List
        </Link>
      </div>
            <div>
            <div className="p-2 flex flex-col gap-4 ">
                 {/**Calendar Section */}
                 <div className="flex items-center justify-center mt-2 w-full border border-black">
                 <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                />
                </div>
                <div>
                    <span>Friends{"'"} events in _______</span>
                    <div className="flex flex-col gap-4 items-between justify-between">
                            <div className="">
                                <span style={{fontSize: 20}} className="bg-gray-200  font-bold p-2 rounded-full">20</span>
                                <span>Event Name</span>
                            </div>
                            <div>
                                <span style={{fontSize: 20}} className="bg-gray-200  font-bold p-2 rounded-full">20</span>
                                <span>Event Name</span>
                            </div>
                            <div>
                                <span style={{fontSize: 20}} className="bg-gray-200  font-bold p-2 rounded-full">20</span>
                                <span>Event Name</span>
                            </div>
                        </div>
                </div>
            </div>
            </div>
        </div>
    );
}