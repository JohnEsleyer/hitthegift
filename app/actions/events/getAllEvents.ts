'use server'

import { mongoClient } from "@/lib/mongodb";
import { EventData } from "@/lib/types/event";
import { ObjectId } from "mongodb";

export async function getAllEvents(userId: string) {
    try {
        const db = mongoClient.db('hitmygift');

        // Find events with matching userId
        const events = await db.collection<EventData>('events').find({ userId: userId }).toArray();

        console.log(`Length: ${events.length}`);

        if (events.length > 0) {
            // Use Promise.all to handle async mapping
            const responseData = await Promise.all(
                events.map(async (event) => {
                    return {
                        id: event._id.toString(),
                        userId: userId,
                        date: event.date,
                        eventTitle: event.eventTitle,
                        invitedFriends: event.invitedFriends,
                    };
                })
            );

            console.log(`array: ${responseData}`);
            return {
                message: "Successfully fetched all events",
                data: responseData,
                status: 200,
            };
        } else {
            return {
                message: "No events found for the given user",
                data: [],
                status: 404,
            };
        }
    } catch (e) {
        console.error(e);
        return {
            message: "Failed to fetch events",
            status: 500,
        };
    }
}
