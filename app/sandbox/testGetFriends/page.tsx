'use client'

import getAllFriends from "@/app/actions/user/getAllFriends";
import { RootState } from "@/lib/store";
import { useEffect, useState, useTransition } from "react";
import { useSelector } from "react-redux";


type Friends ={
    id: string;
    firstName: string;
    lastName: string;
}

export default function testGetFriends(){
    const [isPending, startTransition] = useTransition();
    const userId = useSelector((state: RootState) => state.userData.id);
    const [friends, setFriends] = useState<Friends[]>([]);

    useEffect(() => {
        startTransition(async () => {
            const results = await getAllFriends(userId);
            console.log(`status: ${results.message}`);
            if (results){
                setFriends(results.friends || []);
            }
           
        });
    }, []);

    return (
        <div>
            {isPending 
            ?
            <div>Loading...</div>
            : 
            <div>
                {friends.map((friend) => (
                    <p key={friend.id}>{friend.id} {friend.firstName}</p>
                ))}
            </div>
            }
        </div>
    )
}