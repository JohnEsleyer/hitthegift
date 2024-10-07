'use server'

import { mongoClient } from "@/lib/mongodb";
import { EventData } from "@/lib/types/event";
import { ObjectId } from "mongodb";

export async function getMonthlyInvitedEvents(userId: string) {
    try {
        const db = mongoClient.db('hitmygift');

        // Get the start and end date of the current month
        const currentDate = new Date();
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        // Query the database for events where the userId is in the invitedFriends array
        // and the date is within the current month
        const events = await db.collection<EventData>('events').find({
            invitedFriends: userId,
            date: {
                $gte: startOfMonth, // Greater than or equal to the start of the month
                $lte: endOfMonth    // Less than or equal to the end of the month
            }
        }).toArray();

        console.log(`Length: ${events.length}`);

        if (events.length > 0) {
            // Format the events data to return
            const responseData = events.map(event => ({
                id: event._id.toString(),
                userId: event.userId,
                date: event.date,
                eventTitle: event.eventTitle,
                invitedFriends: event.invitedFriends,
            }));

            console.log(`array: ${responseData}`);
            return {
                message: "Successfully fetched all events for invited friends",
                data: responseData,
                status: 200,
            };
        } else {
            return {
                message: "No events found for the given user as an invited friend",
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
