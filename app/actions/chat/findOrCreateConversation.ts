'use server'

import { Conversation } from "@/lib/types/conversation";
import { MongoClient, ObjectId } from "mongodb";

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
         
        return {
            status: 200,
            data: conversationSimplified,
        };
    } catch (e) {
        console.log(e);
        return {
            status: 500,
        };
    }finally{
        mongoClient.close();
    }
}
