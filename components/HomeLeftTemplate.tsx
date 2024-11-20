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
    <div style={{paddingLeft: 54}} className="h-screen w-full flex flex-col pl-2">
      <div style={{height: 30}}className="flex justify-center ">

      </div>
      <div style={{height: 35}} className="flex justify-center  ">

        {/**My List */}
        <div className="flex items-center justify-center border-b border-[#007AFF]" style={{width: 156}}>
        {highlight == "mylist" ? <span className="flex text-[#007AFF] ">
          My List
        </span> :  <Link href="/mylist" className="flex">
          My List
        </Link>}
        </div>
          {/**Friends List */}
          <div className=" flex items-center justify-center border-b border-[#b1b1b1]" style={{width: 156}}>
        {highlight == "friendslist" ? <Link href="/friendslist" className="flex text-[#007AFF] ">
          Friends List
        </Link> : <Link href="/friendslist" className="flex">
           Friends List
        </Link>}
        </div>
      </div>
      <div className="flex-1 mb-2 ml-2 overflow-auto hide-scrollbar border rounded-2xl mt-2 ">
       {children}
      </div>
    </div>
  );
}
