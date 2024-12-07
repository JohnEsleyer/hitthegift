'use server'

import { Conversation } from "@/lib/types/conversation";
import { MongoClient, ObjectId } from "mongodb";

/**
 * Finds or creates a conversation between two users.
 *
 * This function queries the 'conversations' collection in the 'hitmygift' database to find an existing conversation
 * between the specified user IDs. If a conversation exists, it returns the conversation details. 
 * If no conversation is found, it creates a new conversation and returns the newly created conversation details.
 *
 * Parameter: userId = The ID of the current user.
 * Parameter: friendId = The ID of the other user in the conversation.
 * Returns an object with a `status` code and `data` if successful. 
 *          - `status`: 200 if successful, 500 if an error occurred.
 *          - `data`: If successful, an object containing the conversation details (id, participants, createdAt).
 */

export default async function findOrCreateConversation(userId: string, friendId: string) {
    const uri = process.env.MONGODB_URI || '';

    const mongoClient = new MongoClient(uri);
    
    try {
        const db = mongoClient.db('hitmygift');
        
        // Find existing conversation
        const conversation = await db.collection<Conversation>('conversations').findOne({
            participants: { $all: [userId, friendId] }
        });

        if (conversation) {
            // Convert ObjectId to string
            const conversationSimplified = {
                id: conversation._id.toString(),
                participants: conversation.participants,
                createdAt: conversation.createdAt,
            };
             ;
            return {
                status: 200,
                data: conversationSimplified,
            };
        }

        // Create new conversation
        const newConversation = await db.collection('conversations').insertOne({
            participants: [userId, friendId],
            createdAt: new Date(),
        });

        const conversationSimplified = {
            id: newConversation.insertedId.toString(),
            participants: [userId, friendId],
            createdAt: new Date(),
        };
        console.log('findOrCreateConversation: Success');
        return {
            status: 200,
            data: conversationSimplified,
        };
    } catch (e) {
        console.log('findOrCreateConversation: Failed');
        console.log(e);
        return {
            status: 500,
        };
    }finally{
        mongoClient.close();
    }
}
