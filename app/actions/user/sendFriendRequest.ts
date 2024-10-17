'use server';

import { mongoClient } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function sendFriendRequest(senderId: string, receiverEmail: string) {
    try {
        const db = mongoClient.db('hitmygift');

        // Check if the receiver exists by email
        const receiver = await db.collection('users').findOne({
            email: receiverEmail
        });

        if (!receiver) {
            console.log('Receiver not found');
            return {
                status: 400,
                message: 'Receiver not found'
            };
        }

        const receiverId = receiver._id.toString(); // Get the receiver's ID

        // Create a new friend request record
        const friendRequest = {
            senderId: senderId,
            receiverId: receiverId
        };

        const result = await db.collection('friendRequest').insertOne(friendRequest);

        if (result.insertedId) {
            console.log('Friend request sent successfully');
            return {
                status: 200,
                message: 'Friend request sent successfully'
            };
        } else {
            return {
                status: 500,
                message: 'Failed to send friend request'
            };
        }
    } catch (e) {
        console.log(e);
        return {
            status: 500,
            message: 'Internal server error'
        };
    }
}
