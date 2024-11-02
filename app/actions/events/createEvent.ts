'use server'

import { EventData, ServerResponseForEvents } from "@/lib/types/event";
import getFriendsByIds from "../user/getFriendsByIds";
import { MongoClient } from "mongodb";


interface RequestPayload{
    userId: string;
    data: EventData;
}

export async function createEvent(payload: RequestPayload) {
    const uri = process.env.MONGODB_URI || '';
    const mongoClient = new MongoClient(uri);
    try {
        const db = mongoClient.db('hitmygift');

        const event = await db.collection('events').insertOne({ // Await the database operation
            userId: payload.userId,
            date: payload.data.date,
            eventTitle: payload.data.eventTitle,
            invitedFriends: payload.data.invitedFriends,
        });

        // Transform responseData type to a type usable my the receiving client component
        // invitedFriends are just a list of userIds. However, some client components need more information like first name, last name, and etc. 
        const friendsData = await getFriendsByIds(payload.data.invitedFriends);
        const transformedData: ServerResponseForEvents = {
            id: event.insertedId.toString(),
            userId: payload.data.userId,
            date: payload.data.date,
            eventTitle: payload.data.eventTitle,
            invitedFriends: friendsData.friends,
        }
         
        return { message: "Event Inserted Successfully", data: transformedData, status: 200 };
    } catch (e) {
        console.log(e);
         
        return { message: "insert Event Failed", status: 500 };
    }finally{
        mongoClient.close();
    }
}
