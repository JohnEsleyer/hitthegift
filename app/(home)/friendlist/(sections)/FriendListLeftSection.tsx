'use client'


import React, { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";
import getUserInfo from "@/app/actions/user/getUserInfo";
import Avvvatars from "avvvatars-react";

// Selected friend page
export default function FriendListLeftSection(){
    const friendId = useSelector((state: RootState) => state.friendList.friendId);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [hobbiesInfo, setHobbiesInfo] = useState('');
    const [invitedFriends, setInvitedFriends] = useState([]);
    const [isPendingUserInfo, startUserInfoTransition] = useTransition();
    const [friendNotFound, setFriendNotFound] = useState(false);

    useEffect(()=>{

        if (!friendId){
            setFriendNotFound(true);
            console.log('Friend not found');
        }

        startUserInfoTransition(async() => {
            const result = await getUserInfo(friendId);
            console.log(`status: ${result.status}`);
            if (result){
                const fullName = `${result.firstName} ${result.lastName}`;
                setName(fullName);
                setEmail(result.email || '');
                setHobbiesInfo(result.hobbiesInfo || '');
            }
        });

    },[]);

    return (
        <div className="h-full">
      
            <div>
            <div className="p-2 flex flex-col gap-4 ">
                
                {isPendingUserInfo ? <div>Loading...</div> : <div className="p-2 border border-gray-200 rounded-2xl">
                    {/**Friend's profile */}
                    <div className="flex  p-2">
                        <div className="flex items-center">
                            <Avvvatars size={45} value={name}/>
                        </div>
                       <div className="p-2">
                       <p>{name}</p>
                       <p className="text-xs text-gray-400">{email}</p>
                       </div>
                    </div>
                    <span className="text-xl font-bold">Interests and hobbies</span>
                    <div style={{height: 120, width: 260}} className="shadow-md border rounded-2xl  p-2">
                        {hobbiesInfo}
                    </div>
                    <div style={{height: 100}}></div>
                    <span>People with whom this list has been shared</span>
                    <div className="flex">
                        <div className="h-12 w-12 rounded-full bg-gray-300"></div>
                        <div className="h-12 w-12 rounded-full bg-gray-300"></div>
                        <div className="h-12 w-12 rounded-full bg-gray-300"></div>
                        <div className="h-12 w-12 rounded-full bg-gray-300"></div>

                    </div>
                </div>}

            </div>
            </div>
        </div>
    );
}