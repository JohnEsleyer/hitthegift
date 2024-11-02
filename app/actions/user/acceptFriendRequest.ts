'use server';

import { FriendRequestMongoType } from "@/lib/types/friendrequest";
import { MongoClient, ObjectId } from "mongodb";

// Update user and friend's friendslist and remove FriendRequest
export default async function acceptFriendRequest(userId: string, friendRequestId: string) {
    const uri = process.env.MONGODB_URI || '';
    const mongoClient = new MongoClient(uri);
    try {
        const db = mongoClient.db('hitmygift');

        // Find the friend request by ID
        const friendRequest = await db.collection<FriendRequestMongoType>('friendRequest').findOne({
            _id: new ObjectId(friendRequestId)
        });

        if (!friendRequest) {
            console.log('Friend request not found');
             
            return {
                status: 400,
                message: 'Friend request not found'
            };
        }

        // Get sender's ID
        const senderId = friendRequest.senderId;

        // Update both users' friendsList
        const userUpdateRes = await db.collection('users').updateOne(
            { _id: new ObjectId(userId) },
            { $addToSet: { friendsList: senderId } }
        );

        const senderUpdateRes = await db.collection('users').updateOne(
            { _id: new ObjectId(senderId) },
            { $addToSet: { friendsList: userId } }
        );

        // Remove the friend request
        const deleteRes = await db.collection('friendRequest').deleteOne({
            _id: new ObjectId(friendRequestId)
        });

        if (userUpdateRes.modifiedCount > 0 && senderUpdateRes.modifiedCount > 0 && deleteRes.deletedCount > 0) {
            console.log('Friend request accepted and both users updated successfully');
             
            return {
                status: 200,
                message: 'Friend request accepted successfully'
            };
        } else {
             
            return {
                status: 500,
                message: 'Failed to accept friend request'
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
