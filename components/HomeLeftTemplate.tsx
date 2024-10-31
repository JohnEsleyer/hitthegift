"use client"

import { ReactNode } from "react";

interface HomeLeftTemplateProps{
    children: ReactNode;
    highlight: string; // mylist or friendslist
}

export function HomeLeftTemplate({children, highlight} : HomeLeftTemplateProps){
    return (
        <div className="h-screen bg-red-300">
        <div
          style={{ width: 291, marginTop:20 }}
          className={` border-gray-400 flex justify-center ml-4  gap-8`}
        >
          <a href={"/mylist"}
           className={`${highlight == "mylist" && "text-blue-500 border-b border-blue-400"}`}
          >My List</a>
          <a
            className={`${highlight == "friendslist" && "text-blue-500 border-b border-blue-400"}`}
            href={"/friendslist"}
          >
            Friends List
          </a>
        </div>
        {children}
       
      </div>
    )
}