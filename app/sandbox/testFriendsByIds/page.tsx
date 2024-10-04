

'use client'

import getFriendsByIds from "@/app/actions/user/getFriendsByIds";
import { RootState } from "@/lib/store";
import { Friend } from "@/lib/types/friend";
import { useEffect, useState, useTransition } from "react";
import { useSelector } from "react-redux";

export default function testFriendsByIds(){
    const [isPending, startTransition] = useTransition();
    const userId = useSelector((state: RootState) => state.userData.id);
    const [friends, setFriends] = useState<Friend[]>([]);

    useEffect(() => {
        startTransition(async () => {
            console.log(`id sent to server: ${userId}`);
            const results = await getFriendsByIds([
                "66fe544c2426b7d616e5f80b",
                "66fe4ef22426b7d616e5f80a",
                "66fe4eba2426b7d616e5f809",
                "66fe4d302426b7d616e5f807",
            ]);
            console.log(`status: ${results?.status}`);
            if (results){
                console.log(results);
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
                    <p key={friend.id}>{friend.id} {friend.firstName} {friend.lastName}</p>
                ))}
            </div>
            }
        </div>
    )
}

