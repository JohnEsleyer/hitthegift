'use client'

import { RootState } from "@/lib/store";
import Avvvatars from "avvvatars-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import Image from 'next/image';

interface ChatBubbleProps {
  avatarUrl: string;
  timestamp: string;
  message: string;
  deliveryStatus: string;
  isSender: boolean;
}

export function ChatBubble({
    avatarUrl,
    timestamp,
    message,
    deliveryStatus,
    isSender,
  }: ChatBubbleProps){

    const userName = useSelector((state: RootState) => state.userData.firstName);
    const friendName = useSelector((state: RootState) => state.insideFriend.friendName);

    return (
      <div className={`flex items-start ${isSender ? 'justify-end' : 'justify-start'}`}>
      {!isSender && (
        <div className="pl-2 pt-2">
        {avatarUrl ? <Image
          className="w-8 h-8 rounded-full"
          src={avatarUrl}
          alt={`${friendName}'s avatar`}
        /> : <Avvvatars value={`${friendName}`} /> }
        </div>
      )}
      <div>
      <div
  
        className={`scaledownChatBubble flex flex-col w-full ${isSender ? 'p-4' : 'pl-4 pr-4 pb-4 pt-1'} max-w-[320px] leading-1.5  border border-gray-200 bg-gray-100 rounded-xl ${
          isSender ? 'rounded-tr-none rounded-br-xl chatBubbleColorSender' : 'rounded-tl-none rounded-bl-xl'
        }`}
      >
        <div>
          {isSender ? null : (
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {friendName}
            </span>
          )}
        </div>
        <p className={`text-sm font-normal py-2.5 text-gray-900 ${isSender ? "text-white" : "text-black"}`}>{message}</p>
      </div>
      <div style={{width: 250}} className={`flex ${isSender ? 'justify-start pl-4' : 'justify-end pr-4'} text-xs  text-sm font-normal text-gray-400 dark:text-gray-400`}>{deliveryStatus} {" "} {timestamp}</div>

      </div>
      
      {isSender && (
        <div className="pr-2 pt-2">
        {avatarUrl ?  <Image
          className="w-8 h-8 rounded-full"
          src={avatarUrl}
          alt={`${userName}'s avatar`}
        /> : <Avvvatars value={`${userName}`} /> }
        </div>
      )}
    </div>
    );
  }
  