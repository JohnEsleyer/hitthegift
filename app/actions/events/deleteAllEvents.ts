'use server';

import { EventData } from "@/lib/types/event";
import { MongoClient } from "mongodb";

/**
 * The deleteAllEvents function removes all events from the 'events' collection in the database.
 * This is typically used for cleanup or testing purposes.
 *
 * @returns A response object containing a message and status.
 */
export async function deleteAllEvents(): Promise<{
    message: string;
    status: number;
}> {
    const uri = process.env.MONGODB_URI || '';
    const mongoClient = new MongoClient(uri);
    try {
        const db = mongoClient.db('hitmygift');

        // Delete all documents from the 'events' collection
        const result = await db.collection<EventData>('events').deleteMany({});

        if (result.deletedCount > 0) {
             
            return {
                message: `Successfully deleted ${result.deletedCount} event(s)`,
                status: 200,
            };
        } else {
             
            return {
                message: "No events found to delete",
                status: 404,
            };
        }
    } catch (e) {
        console.error(e);
         
        return {
            message: "Failed to delete events",
            status: 500,
        };
    }finally{
        mongoClient.close();
    }
}
