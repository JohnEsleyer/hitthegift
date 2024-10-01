'use client'

import { ReactNode, useState } from "react";
import Image from 'next/image';
import Friends from '/public/friends.png';
import { Search } from "lucide-react";

interface FriendsSidebar{
    children: ReactNode;
}


export default function FriendsSidebar({children}: FriendsSidebar){
    
    const [isShowSidebar, setIsShowSidebar] = useState<boolean>(false);

    // Toggle sidebar
    const toggleSidebar = () => {
        setIsShowSidebar((prev) => !prev);
    }

    return (
        <div className="flex ">
              {children}
        {isShowSidebar ?
        <div 
            className="p-2 bg-slate-100 border border-gray-300 border-2 rounded"
            style={{
                position: 'absolute',
                top: 60,
                right: 0,
                bottom: 0,
                width: 300,
                zIndex: 999,
                transition: 'transform 0.3s ease-in-out',
                transform: isShowSidebar ? 'translateX(0)' : 'translateX(100%)',
        }}>
        <button 
            className="text-black p-2 underline text-white"
            onClick={toggleSidebar}
            >
                Close
            </button>
        <div className="flex items-center rounded-xl p-2 bg-white w-fulls">
           <input 
                type="text" 
                style={{width: 230}}
                placeholder="Search friend" 
           /> 
           <Search style={{width: 26, height: 20, strokeWidth: 3}}/>
           </div>
           {/**Friends Section */}
           <div>
            {/*Example Friend*/}
            <div className="border border-gray-400 border-2 rounded-2xl pl-2 pr-2 p-1 mt-2 flex items-center gap-2 ">
            <div className="rounded-full w-12 h-12 bg-blue-300">
            </div>
            <span>Name</span>
            </div>
             {/*Example Friend*/}
             <div className="border border-gray-400 border-2 rounded-2xl pl-2 pr-2 p-1 mt-2 flex items-center gap-2 ">
            <div className="rounded-full w-12 h-12 bg-blue-300">
            </div>
            <span>Name</span>
            </div>
             {/*Example Friend*/}
             <div className="border border-gray-400 border-2 rounded-2xl pl-2 pr-2 p-1 mt-2 flex items-center gap-2 ">
            <div className="rounded-full w-12 h-12 bg-blue-300">
            </div>
            <span>Name</span>
            </div>
             {/*Example Friend*/}
             <div className="border border-gray-400 border-2 rounded-2xl pl-2 pr-2 p-1 mt-2 flex items-center gap-2 ">
            <div className="rounded-full w-12 h-12 bg-blue-300">
            </div>
            <span>Name</span>
            </div>
             {/*Example Friend*/}
             <div className="border border-gray-400 border-2 rounded-2xl pl-2 pr-2 p-1 mt-2 flex items-center gap-2 ">
            <div className="rounded-full w-12 h-12 bg-blue-300">
            </div>
            <span>Name</span>
            </div>
             {/*Example Friend*/}
             <div className="border border-gray-400 border-2 rounded-2xl pl-2 pr-2 p-1 mt-2 flex items-center gap-2 ">
            <div className="rounded-full w-12 h-12 bg-blue-300">
            </div>
            <span>Name</span>
            </div>
             {/*Example Friend*/}
             <div className="border border-gray-400 border-2 rounded-2xl pl-2 pr-2 p-1 mt-2 flex items-center gap-2 ">
            <div className="rounded-full w-12 h-12 bg-blue-300">
            </div>
            <span>Name</span>
            </div>
            </div>
        </div>:  <div className="flex justify-end items-center">
           <div className="p-2 pr-4 text-white">
            <button 
                className="bg-blue-500 p-2 border rounded-2xl rounded-r-lg "
                onClick={toggleSidebar}
                >
                <Image 
                    alt=""
                    width={30}
                    src={Friends}
                />
            </button>            

           </div>
           </div>}
        </div>
    );
}