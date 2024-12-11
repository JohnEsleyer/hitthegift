'use server'

import { MongoClient } from "mongodb";

export default async function createMessage(userId: string, conversationId: string, content: string) {
    const uri = process.env.MONGODB_URI || '';
    const mongoClient = new MongoClient(uri);
    const db = mongoClient.db('hitmygift');
    try {
        const newMessage = await db.collection('messages').insertOne({
            sender: userId,
            conversationId: conversationId,
            content: content,
            timestamp: new Date(),
            senderIsRead: true,    // The sender can consider their own message as read
            receiverIsRead: false, // The receiver hasn't read it yet
        });

        if (newMessage) {
            return {
                messageId: newMessage.insertedId.toString(),
                status: 200,
            };
        }

        return {
            status: 400,
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