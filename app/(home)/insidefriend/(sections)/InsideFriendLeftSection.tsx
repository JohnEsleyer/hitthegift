'use client'


import React, { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import { RootState } from "@/lib/store";
import { useDispatch, useSelector } from "react-redux";
import getUserInfo from "@/app/actions/user/getUserInfo";
import Avvvatars from "avvvatars-react";
import getAllFriends from "@/app/actions/user/getAllFriends";
import { Friend } from "@/lib/types/friend";
import { updateFriendName } from "@/lib/features/insideFriend";

// Selected friend page
export default function InsideFriendLeftSection(){
    const dispatch = useDispatch();

    const friendId = useSelector((state: RootState) => state.insideFriend.friendId);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [hobbiesInfo, setHobbiesInfo] = useState('');
    const [friends, setFriends] = useState<Friend[]>([]);
    const [isFriendsPending, startFriendsTransition] = useTransition();
    const [isPendingUserInfo, startUserInfoTransition] = useTransition();
    const [friendNotFound, setFriendNotFound] = useState(false);

    useEffect(()=>{
        if (!friendId){
            setFriendNotFound(true);
            console.log('Friend not found');
        }

        startUserInfoTransition(async() => {
            console.log(`friendId: ${friendId}`);
            const result = await getUserInfo(friendId);
            console.log(`status: ${result.status}`);
            if (result){
                const fullName = `${result.firstName} ${result.lastName}`;
                setName(fullName);
                setEmail(result.email || '');
                setHobbiesInfo(result.hobbiesInfo || '');
                dispatch(updateFriendName(`${result.firstName} ${result.lastName}`));
            }
        });

        startFriendsTransition(async() => {
            const results = await getAllFriends(friendId);
            if (results) {
              setFriends(results.friends || []);
            }
        });


    },[]);

    return (
        <div className="h-full">
      
            <div>
            <div className="p-2 flex flex-col gap-4">
                
                {isPendingUserInfo ? <div>Loading...</div> : <div className="mt-2 p-2 border border-gray-200 rounded-2xl">
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
                    {isFriendsPending ? <div>Loading...</div> :  <div className="flex">
                        {friends.map((friend) => (
                            <Avvvatars key={friend.id} value={friend.firstName}/>
                        ))}
                    </div> }
                </div>}
                

            </div>
            </div>
        </div>
    );
}