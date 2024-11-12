'use server'

import { EventData } from "@/lib/types/event";

import getFriendsByIds from "../user/getFriendsByIds";
import { MongoClient } from "mongodb";


// Get all my events by the specified month.
export async function getAllEventsByMonth(userId: string, month: number) {
    const uri = process.env.MONGODB_URI || '';
    const mongoClient = new MongoClient(uri);
    try {
        const db = mongoClient.db('hitmygift');

        // Get the current year
        const currentYear = new Date().getFullYear();

        // Get the start and end date of the specified month (1-based index for month)
        const startOfMonth = new Date(currentYear, month - 1, 1);
        const endOfMonth = new Date(currentYear, month, 0); // Last day of the specified month

        // Query the database for events associated with the user and within the specified month
        const events = await db.collection<EventData>('events').find({
            userId: userId,
            date: {
                $gte: startOfMonth.toString(), // Greater than or equal to the start of the month
                $lte: endOfMonth.toString()    // Less than or equal to the end of the month
            }
        }).toArray();

        if (events.length > 0) {
            // Use Promise.all to handle async mapping
            const responseData = await Promise.all(
                events.map(async (event) => {
                    event.invitedFriends.map((friendId) => console.log(`Friend: ${friendId}`));

                    const friendsData = await getFriendsByIds(event.invitedFriends);

                     
                    return {
                        id: event._id.toString(),
                        userId: userId,
                        date: event.date,
                        eventTitle: event.eventTitle,
                        invitedFriends: friendsData.friends,
                    };
                })
            );

            return {
                message: `Successfully fetched all events for month ${month}`,
                data: responseData,
                status: 200,
            };
        } else {
             
            return {
                message: `No events found for the given user in month ${month}`,
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
    }finally{
        mongoClient.close();
    }
}
