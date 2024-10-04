'use server'
import { mongoClient } from "@/lib/mongodb";
import { UserData } from "@/lib/types/user";
import { ObjectId } from "mongodb";

type UserFriends = {
    id: string;
    firstName: string;
    lastName: string;
};

export default async function getAllFriends(userId: string) {
    console.log(`ID received: ${userId}`);
    try {
        const db = mongoClient.db('hitmygift');
        const user = await db.collection<UserData>('users').findOne({
            _id: new ObjectId(userId),
        });

        if (user) {
            console.log(`Server received userId: ${user._id}`);

            const userFriendsIdList: string[] = user.friendsList.map((friendId) => friendId.toString());

            // Fetch the names of friends
            let userFriends: UserFriends[] = [];

            // Use Promise.all to handle async mapping
            const friendsData = await Promise.all(
                userFriendsIdList.map(async (friendIdStr) => {
                    console.log(`MAP: ${friendIdStr}`);
                    const friend = await db.collection<UserData>('users').findOne({
                        _id: new ObjectId(friendIdStr),
                    });


                    if (friend) {
                        return {
                            id: friendIdStr,
                            firstName: friend.firstName,
                            lastName: friend.lastName,
                        };
                    }
                    return null; // Return null if the friend is not found
                })
            );

            // Filter out any null values
            userFriends = friendsData.filter((friend): friend is UserFriends => friend !== null);

            console.log(`LENGTH: ${userFriends.length}`);
            console.log('Status: 200');
            return {
                friends: userFriends,
                status: 200,
            };
        }
    } catch (error) {
        console.error('Error fetching friends:', error);
        return {
            friends: [],
            status: 500,
        };
    }
}
