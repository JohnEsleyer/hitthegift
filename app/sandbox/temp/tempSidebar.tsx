'use client';

import Avvvatars from "avvvatars-react";
import { Search } from "lucide-react";


interface TempSidebarProps{
    onClick: ()=> void;
}

export default function TempSidebar({onClick}: TempSidebarProps) {
    return (
       <div>
          <button 
          className="text-black p-2 underline"
          onClick={onClick}
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
              <div className="flex justify-center items-center w-12 h-12 bg-blue-400 rounded-full">
              <Avvvatars size={48} value="best_user2@gmail.com" style="shape"/>
            </div>
          <span>Name</span>
          </div>
           {/*Example Friend*/}
           <div className="border border-gray-400 border-2 rounded-2xl pl-2 pr-2 p-1 mt-2 flex items-center gap-2 ">
           <div className="flex justify-center items-center w-12 h-12 bg-blue-400 rounded-full">
              <Avvvatars size={48} value="best_user3@gmail.com" style="shape"/>
            </div>
          <span>Name</span>
          </div>
           {/*Example Friend*/}
           <div className="border border-gray-400 border-2 rounded-2xl pl-2 pr-2 p-1 mt-2 flex items-center gap-2 ">
           <div className="flex justify-center items-center w-12 h-12 bg-blue-400 rounded-full">
              <Avvvatars size={48} value="best_user4@gmail.com" style="shape"/>
            </div>
          <span>Name</span>
          </div>
           {/*Example Friend*/}
           <div className="border border-gray-400 border-2 rounded-2xl pl-2 pr-2 p-1 mt-2 flex items-center gap-2 ">
           <div className="flex justify-center items-center w-12 h-12 bg-blue-400 rounded-full">
              <Avvvatars size={48} value="best_user5@gmail.com" style="shape"/>
            </div>
          <span>Name</span>
          </div>
           {/*Example Friend*/}
           <div className="border border-gray-400 border-2 rounded-2xl pl-2 pr-2 p-1 mt-2 flex items-center gap-2 ">
           <div className="flex justify-center items-center w-12 h-12 bg-blue-400 rounded-full">
              <Avvvatars size={48} value="best_user6@gmail.com" style="shape"/>
            </div>
          <span>Name</span>
          </div>
           {/*Example Friend*/}
           <div className="border border-gray-400 border-2 rounded-2xl pl-2 pr-2 p-1 mt-2 flex items-center gap-2 ">
           <div className="flex justify-center items-center w-12 h-12 bg-blue-400 rounded-full">
              <Avvvatars size={48} value="best_user7@gmail.com" style="shape"/>
            </div>
          <span>Name</span>
          </div>
           {/*Example Friend*/}
           <div className="border border-gray-400 border-2 rounded-2xl pl-2 pr-2 p-1 mt-2 flex items-center gap-2 ">
           <div className="flex justify-center items-center w-12 h-12 bg-blue-400 rounded-full">
              <Avvvatars size={48} value="best_user8@gmail.com" style="shape"/>
            </div>
          <span>Name</span>
          </div>
          </div>
       </div>
    )
}