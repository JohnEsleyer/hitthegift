'use client'

import RenderClientOnly from "@/components/utilityComponents/RenderClientOnly"
import MyListLeftSection from "./(sections)/MyListLeftSection"
import MyListRightSection from "./(sections)/MyListRightSection"
import Image from 'next/image';
import Loading from '/public/loading.svg';
import Friends from '/public/friends.png';
import FriendsSidebar from "./(components)/FriendsSidebar";
import { OverlayPage } from "./(components)/OverlayPage";
import { updateCurrentOverlay } from "@/lib/features/overlays";
import Avvvatars from "avvvatars-react";
import router from "next/router";
import { useState } from "react";
import { useDispatch } from "react-redux";

export default function MyListPage(){
    
    const [showProfileOptions, setShowProfileOptions] = useState(false);
    const dispatch = useDispatch();

    return (
        <div className="w-screen h-screen flex">
        <RenderClientOnly loading={
            <div className="flex w-full justify-center items-center">
                <Image src={Loading} alt='' className="w-8 h-8"/>
            </div>
        }>
        <OverlayPage >
        <div className="flex w-full h-full">
           <div style={{width: 300}}>
            <MyListLeftSection/>
           </div>
           <div className="flex-1 ">
            <MyListRightSection/>
           </div>
           {/**Profile  */}
        <div 
            style={{zIndex: 90}}
            className="absolute p-2 pr-8 w-screen flex justify-end">
          <button 
            className="relative"
            onClick={() => {
            
            setShowProfileOptions((prev) => !prev);
          }}>
          <Avvvatars value={`profile`}/>
          </button>  
          {showProfileOptions && <ul 
            style={{zIndex: 100, right: 20, top:38}} 
            className="flex flex-col gap-2 absolute bg-white shadow-md rounded-2xl ">
            <button 
              className="hover:bg-gray-100 p-4 rounded-2xl"
              onClick={() => {
              setShowProfileOptions(false);
              dispatch(updateCurrentOverlay('profile'));
            }}>
              My Profile
            </button>
            <button 
            className="hover:bg-gray-100 p-4 rounded-2xl"
                onClick={() => {
                
              document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
              router.push('/login');
            }}>
              Log out
            </button>
          </ul>}
        </div>
        </div>
        </OverlayPage>
        
        </RenderClientOnly>
        </div>
    )
}