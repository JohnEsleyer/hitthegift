'use client'

import { updateIsOpenChatbox } from "@/lib/features/insideFriend";
import { RootState } from "@/lib/store"
import Avvvatars from "avvvatars-react";
import { Minus, Send } from "lucide-react";
import { useDispatch, useSelector } from "react-redux"


export default function Chatbox(){
    const dispatch = useDispatch();
    const friendName = useSelector((state: RootState) => state.insideFriend.friendName);
    const messages = [];
    return (
        <div style={{height: 400, width: 300}} className="flex flex-col shadow-md bg-white">
            <div className="w-full flex justify-between shadow-md p-2 h-12 ">
            <div className="flex items-center gap-2">
                <Avvvatars value={friendName}/> 
                <span>{friendName}</span>
            </div>
            <div className="p-2">
            <button onClick={() => {
                dispatch(updateIsOpenChatbox(false));
            }}>
            <Minus/>
            </button>
            </div>
            </div>
            <div className="flex-1 ">
                {
                    messages.length > 0 ? 
                    <div></div> : 
                    <div className="flex justify-center items-center h-full text-gray-400">No messages</div>
                }
            </div>
            <div className="shadow-md border-t flex p-2 h-12">
                <input className="border p-2 rounded-2xl" />
                <button>
                    <Send color="#4298f5"/>
                </button>
            </div>

        </div>
    );
}