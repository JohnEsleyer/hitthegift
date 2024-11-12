'use server';

import { EventData, ServerResponseForEvents } from "@/lib/types/event";
import getFriendsByIds from "../user/getFriendsByIds";
import { MongoClient, ObjectId } from "mongodb";
import { Friend } from "@/lib/types/friend";

interface UpdateEventPayload {
    id: string;
    userId: string;
    date?: string;
    eventTitle?: string;
    invitedFriends?: string[];
}

export async function updateEvent(payload: UpdateEventPayload) {
    const uri = process.env.MONGODB_URI || '';
    const mongoClient = new MongoClient(uri);
    try {
        const db = mongoClient.db('hitmygift');
        const { id, userId, ...updateData } = payload;

        // Filter out undefined values to only update the provided fields.
        const updateFields = Object.fromEntries(
            Object.entries(updateData).filter(([_, value]) => value !== undefined)
        );

        const result = await db.collection('events').updateOne(
            { _id: new ObjectId(id), userId: userId },
            { $set: updateFields }
        );

        if (result.matchedCount === 0) {
             
            return { message: "Event not found", status: 404 };
        }

        // If invitedFriends were updated, retrieve the full friends' data.
        let friendsData:Friend[] = [];
        if (payload.invitedFriends) {
            const friendsResponse = await getFriendsByIds(payload.invitedFriends);
            friendsData = friendsResponse.friends;
        }

        // Prepare the updated event data to send back to the client.
        const transformedData: ServerResponseForEvents = {
            id: id,
            userId: userId,
            date: payload.date || '',  // Ensure these values are passed as they may be unchanged.
            eventTitle: payload.eventTitle || '',
            invitedFriends: friendsData,
        };
         
        return { message: "Event Update Success", data: transformedData, status: 200 };
    } catch (e) {
        console.log(e);
         
        return { message: "Event Update Failed", status: 500 };
    }finally{
        mongoClient.close();
    }
}
