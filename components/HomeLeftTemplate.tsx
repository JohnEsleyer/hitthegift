"use client";

import { ReactNode } from "react";
import { Spicy_Rice } from 'next/font/google';
import { House, Users } from "lucide-react";
import Link from "next/link";

const spicyrice = Spicy_Rice({
  weight: "400",
  subsets: ['latin']
});

interface HomeLeftTemplateProps {
  children: ReactNode;
  highlight: string; // mylist or friendslist
}

export function HomeLeftTemplate({
  children,
  highlight,
}: HomeLeftTemplateProps) {
  return (
    <div className="h-screen w-full flex flex-col">
      <div style={{height: 40}}className="flex justify-center ">
        <p
          style={{
            fontSize: 30,
          }}
          className={`${spicyrice.className} font-bold text-black`}
        >
          HitMyGift
        </p>
      </div>
      <div style={{height: 35}} className="flex justify-center gap-4  ">

        {/**My List */}
        <div className="flex items-center ">
        {highlight == "mylist" ? <span className="flex text-blue-600 ">
          <House /> My List
        </span> :  <Link href="/mylist" className="flex">
          <House /> My List
        </Link>}
        </div>
          {/**Friends List */}
          <div className=" flex items-center ">
        {highlight == "friendslist" ? <span className="flex text-blue-600 ">
          <Users /> Friends List
        </span> : <Link href="/friendslist" className="flex">
          <Users /> Friends List
        </Link>}
        </div>
      </div>
      <div className="flex-1 mb-2 ml-2 overflow-auto hide-scrollbar border-2 rounded-2xl  bg-[#e3dfde] border-black ">
       {children}
      </div>
    </div>
  );
}
