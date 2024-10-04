'use server'

import { mongoClient } from "@/lib/mongodb";
import { EventData } from "@/lib/types/event";


interface RequestPayload{
    userId: string;
    data: EventData;
}

export async function createEvent(payload: RequestPayload) {
    try {
        const db = mongoClient.db('hitmygift');

        
        await db.collection('events').insertOne({ // Await the database operation
            userId: payload.userId,
            date: payload.data.date,
            eventTitle: payload.data.eventTitle,
            invitedFriends: payload.data.invitedFriends,
        });

        return { message: "Event Inserted Successfully", status: 200 };
    } catch (e) {
        console.log(e);
        return { message: "insert Event Failed", status: 500 };
    }
}
