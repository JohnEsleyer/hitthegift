'use server';

import { MongoClient, ObjectId } from "mongodb";


// Add friend directly (skipping the friend request)
export default async function addFriend(userId: string, friendEmail: string) {
    const uri = process.env.MONGODB_URI || '';
    const mongoClient = new MongoClient(uri);
    try {
        const db = mongoClient.db('hitmygift');

        // Find the friend by email
        const friend = await db.collection('users').findOne({
            email: friendEmail
        });

        if (!friend) {
            console.log('Friend not found');

             
            return {
                status: 400,
                message: 'Friend not found'
            };
        }

        const friendId = friend._id.toString(); // Get the friend's ID

        // Update the user's friendsList
        const userUpdateRes = await db.collection('users').updateOne(
            { _id: new ObjectId(userId) },
            { $addToSet: { friendsList: friendId } }
        );

        // Update the friend's friendsList
        const friendUpdateRes = await db.collection('users').updateOne(
            { _id: friend._id },
            { $addToSet: { friendsList: userId } }
        );

        if (userUpdateRes.modifiedCount > 0 && friendUpdateRes.modifiedCount > 0) {
            console.log('Friend added successfully to both users');
             
            return {
                status: 200,
                message: 'Friend added successfully to both users'
            };
        } else {
             
            return {
                status: 500,
                message: 'Failed to add friend'
            };
        }
    } catch (e) {
        console.log(e);
         
        return {
            status: 500,
            message: 'Internal server error'
        };
    }finally{
        mongoClient.close();
    }
}
