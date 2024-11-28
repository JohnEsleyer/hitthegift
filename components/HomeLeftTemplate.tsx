"use client";

import { ReactNode } from "react";

import Link from "next/link";
import { navigateTo } from "@/app/actions/navigateTo";

interface HomeLeftTemplateProps {
  children: ReactNode;
  highlight: string; // mylist or friendslist
}

export function HomeLeftTemplate({
  children,
  highlight,
}: HomeLeftTemplateProps) {
  return (
    <div
      style={{ paddingLeft: 40 }}
      className="h-screen w-full flex flex-col pl-2"
    >
      <div style={{ height: 15 }} className="flex justify-center "></div>
      <div style={{ height: 20 }} className="flex justify-center  ">
        {/**My List */}
        <div
          className={`flex items-center justify-center border-b ${highlight == "mylist" ? "border-[#007AFF]" : "border-[#b1b1b1]"}`}
          style={{ width: 156, fontSize: 14 }}
        >
          {highlight == "mylist" ? (
            <span className="flex text-[#007AFF] ">My List</span>
          ) : (
            <button onClick={() => {navigateTo('/mylist')}} className="flex">
              My List
            </button>
          )}
        </div>
        {/**Friends List */}
        <div
          className={`flex items-center justify-center border-b ${highlight == "friendslist" ? "border-[#007AFF]" : "border-[#b1b1b1]"}`}
          style={{ width: 156, fontSize: 14}}
        >
          {highlight == "friendslist" ? (
            <button onClick={() => {navigateTo('/friendslist')}}  className="flex text-[#007AFF] ">
              Friends List
            </button>
          ) : (
            <button onClick={() => {navigateTo('/friendslist')}} className="flex text-[#78747d]">
              Friends List
            </button>
          )}
        </div>
      </div>
      <div className="flex-1 mb-2 ml-1 overflow-auto hide-scrollbar border rounded-xl mt-4 ">
        {children}
      </div>
    </div>
  );
}
