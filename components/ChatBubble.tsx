'use client'

import { RootState } from "@/lib/store";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import UserProfileImage from "./UserProfileImage";
import loading from '/public/loading.svg';
import Image from 'next/image';

interface ChatBubbleProps {
  timestamp: string;
  message: string;
  deliveryStatus: string;
  isSender: boolean;
}

export function ChatBubble({
    timestamp,
    message,
    deliveryStatus,
    isSender,
  }: ChatBubbleProps){

    const userName = useSelector((state: RootState) => state.userData.firstName);
    const userId = useSelector((state: RootState) => state.userData.id);
    const friendData = useSelector((state: RootState) => state.insideFriend.friendData);
    const friendId = useSelector((state: RootState) => state.insideFriend.friendId)

    return (
      <div className={`flex items-start ${isSender ? 'justify-end' : 'justify-start'}`}>

      {/**Friend's Profile Image */}      
      {!isSender && (
        <div className="pl-2 pt-2">
        <UserProfileImage userId={friendId} userName={friendData?.firstName || ''} alt="" width={30} height={30}/>
        </div>
      )}
      <div>
      <div
  
        className={`scaledownChatBubble mt-2 flex flex-col w-full ${isSender ? 'p-4' : 'pl-4 pr-4 pb-4 pt-1'} max-w-[320px] leading-1.5  border border-gray-200  rounded-xl ${
          isSender ? 'rounded-tr-none rounded-br-xl bg-blue-600 text-white' : 'bg-blue-200 text-black rounded-tl-none rounded-bl-xl'
        }`}
      >
        <div>
          {isSender ? null : (
            <span className="text-sm font-semibold">
              {friendData?.firstName}
            </span>
          )}
        </div>
        <div className="text-wrap">
        <p style={{ width: 210 }} className="text-sm font-normal py-2.5 break-words">
        {message}
      </p>
      </div>
      </div>
      <div style={{width: 250}} className={`flex ${isSender ? 'justify-start pl-4' : 'justify-end pr-4'} text-xs  text-sm font-normal text-gray-400 dark:text-gray-400`}>{deliveryStatus == 'sending' ? <Image src={loading} alt="loading" width={15} height={15}/> : <span>{deliveryStatus}</span>} <span className='pl-2'>{timestamp}</span></div>
      </div>
      {/**User's Profile Image */}      
      {isSender && (
        <div className="pr-2 pt-2">
        <UserProfileImage userId={userId} userName={userName} alt="" width={30} height={30}/>
        </div>
      )}
    </div>
    );
  }
  