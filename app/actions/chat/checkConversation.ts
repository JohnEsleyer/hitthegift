'use server'

import { MongoClient, ObjectId } from "mongodb";

/**
 * Checks if a conversation with the given ID exists.
 *
 * This function queries the 'conversations' collection in the 'hitmygift' database to check
 * if a conversation with the specified ID exists.
 *
 * Parameter: conversationId = The ID of the conversation to check.
 * Returns an object with a `status` code and `data` if successful. 
 *          - `status`: 200 if successful, 500 if an error occurred.
 *          - `data`: If successful, a boolean value indicating whether the conversation exists (true) or not (false).
 */
export default async function checkIfConversationExists(conversationId: string) {
    const uri = process.env.MONGODB_URI || '';

    const mongoClient = new MongoClient(uri);

    try {
        const db = mongoClient.db('hitmygift');

        // Find conversation by ID
        const conversation = await db.collection('conversations').findOne({
            _id: new ObjectId(conversationId) 
        });

        return {
            status: 200,
            data: !!conversation // Convert to boolean
        };
    } catch (e) {
        console.log(e);
        return {
            status: 500,
        };
    } finally {
        mongoClient.close();
    }
}