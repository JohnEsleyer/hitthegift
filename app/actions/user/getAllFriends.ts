'use server'
import { mongoClient } from "@/lib/mongodb";
import { UserData } from "@/lib/types/authTypes";
import { ObjectId } from "mongodb";

type UserFriends = {
    id: string;
    firstName: string;
    lastName: string;
};

export default async function getAllFriends(userId: string){
    try{
        const db = mongoClient.db('hitmygift');
        const user = await db.collection<UserData>('users').findOne({
            _id: new ObjectId(userId),
        });

        if (user){
            console.log(`Server received userId: ${user._id}`);

            const userFriendsList: string[] = user.friendsList.map((friendId) => (friendId.toString()));
            
            // Fetch the names of friends 
            let userFriends: UserFriends[] = [];
            
            userFriendsList.map(async (friendIdStr) => {
                const friend = await db.collection<UserData>('users').findOne({
                    _id: new ObjectId(friendIdStr)
                });
                
             
                if (friend){
                   
                    userFriends.push({
                        id: friendIdStr,
                        firstName: friend.firstName,
                        lastName: friend.lastName,
                    });
                }

            });

            console.log(`id: ${userFriends[0].id}`);
            console.log(`firstName: ${userFriends[0].firstName}`);
            console.log(`lastName: ${userFriends[0].lastName}`);
            return {
                friends: userFriends,
                status: 200,
            }
        }

        console.log('Status: 400');
        return {
            message: 'Failed to fetch friends data.',
            status: 400,
        }
    }catch(e){
        console.log(`Status 500: ${e}`);
        return {
            message: 'Server failed to access user hobbies',
            status: 500,
        }
    }
}
