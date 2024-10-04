'use server'

import { mongoClient } from "@/lib/mongodb";
import { EventData } from "@/lib/types/event";
import { Friend } from "@/lib/types/friend";
import { UserData } from "@/lib/types/user";
import { ObjectId } from "mongodb";


// Use to fetch multiple friends by an array of IDs
export default async function getFriendsByIds(friendsIds: string[]) {
    try {
        const db = mongoClient.db('hitmygift');
        
         
        const users = await Promise.all(friendsIds.map(async (friendId) => {
            const user = await db.collection<UserData>('users').findOne({ _id: new ObjectId(friendId)});
            if (user){
                // console.log(`F: ${user.firstName}`);
               return {
                    id: friendId,
                    firstName: user.firstName,
                    lastName: user.lastName,
                };
            }
        }));
        if (users){
            console.log(`LENGTH: ${users.length}`);
            return {
                friends: users as Friend[],
                status: 200,
            }
        }
        return {
            friends: [],
            status: 400,
        }
        
       
    }catch(e){
        console.log(e);
        return {
            friends: [],
            status: 500,
        };
    }

}
