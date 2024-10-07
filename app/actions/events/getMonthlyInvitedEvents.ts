'use server'

import { mongoClient } from "@/lib/mongodb";
import { EventData } from "@/lib/types/event";
import { ObjectId } from "mongodb";
import getUserInfo from "../user/getUserInfo";

/**
 * 
 * The getMonthlyInvitedEvents function fetches all events for a 
 * given user where they are listed as an invited friend, filtering 
 * the results based on a specified month, and includes the owner's name.
 */

export async function getMonthlyInvitedEvents(userId: string, month: number) {
    try {
        const db = mongoClient.db('hitmygift');

        // Get the current year
        const currentYear = new Date().getFullYear();

        // Get the start and end date of the specified month (1-based index for month)
        const startOfMonth = new Date(currentYear, month - 1, 1);
        const endOfMonth = new Date(currentYear, month, 0); // Last day of the specified month

        // Query the database for events where the userId is in the invitedFriends array
        // and the date is within the specified month
        const events = await db.collection<EventData>('events').find({
            invitedFriends: userId,
            date: {
                $gte: startOfMonth, // Greater than or equal to the start of the month
                $lte: endOfMonth    // Less than or equal to the end of the month
            }
        }).toArray();

        console.log(`Length: ${events.length}`);

        if (events.length > 0) {
            // Use Promise.all to handle async mapping with owner's name fetch
            const responseData = await Promise.all(
                events.map(async (event) => {
                    // Fetch the event owner's info
                    const ownerInfo = await getUserInfo(event.userId);
                    
                    return {
                        id: event._id.toString(),
                        userId: event.userId,
                        date: event.date,
                        eventTitle: event.eventTitle,
                        invitedFriends: event.invitedFriends,
                        ownerName: ownerInfo.firstName + " " + ownerInfo.lastName // Add the owner's name
                    };
                })
            );

            console.log(`array: ${responseData}`);
            return {
                message: `Successfully fetched all events for invited friends in month ${month}`,
                data: responseData,
                status: 200,
            };
        } else {
            return {
                message: `No events found for the given user as an invited friend in month ${month}`,
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
