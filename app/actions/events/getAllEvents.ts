'use server'

import { EventData } from "@/lib/types/event";
import getFriendsByIds from "../user/getFriendsByIds";
import { MongoClient } from "mongodb";

export async function getAllEvents(userId: string) {
    const uri = process.env.MONGODB_URI || '';
    const mongoClient = new MongoClient(uri);
    try {
        const db = mongoClient.db('hitmygift');

        // Find events with matching userId
        const events = await db.collection<EventData>('events').find({ userId: userId }).toArray();


        if (events.length > 0) {
            // Use Promise.all to handle async mapping
            const responseData = await Promise.all(
                events.map(async (event) => {
                    event.invitedFriends.map((friendId) => console.log(`Friend: ${friendId}`));
                    
                    const friendsData = await getFriendsByIds(event.invitedFriends);
            
                    return {
                        id: event._id.toString(),
                        userId: userId,
                        date: event.date.toString(), 
                        eventTitle: event.eventTitle,
                        invitedFriends: friendsData.friends,
                    };
                })
            );
            

             
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
    }finally{
        mongoClient.close();
    }
}
