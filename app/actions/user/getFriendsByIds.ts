'use server'

import { Friend } from "@/lib/types/friend";
import { UserData } from "@/lib/types/user";
import { MongoClient, ObjectId } from "mongodb";


// Use to fetch multiple friends by an array of IDs
export default async function getFriendsByIds(friendsIds: string[]) {
    const uri = process.env.MONGODB_URI || '';
    const mongoClient = new MongoClient(uri);
    try {
        const db = mongoClient.db('hitmygift');
        
         
        const users = await Promise.all(friendsIds.map(async (friendId) => {
            const user = await db.collection<UserData>('users').findOne(
                { _id: new ObjectId(friendId)}
            );
            if (user){
                 

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
    }finally{
        mongoClient.close();
    }

}
