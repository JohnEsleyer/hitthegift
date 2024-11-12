'use server'

import { Conversation } from "@/lib/types/conversation";
import { Message } from "@/lib/types/message";
import { MongoClient, ObjectId } from "mongodb";

export default async function fetchMessages(conversationId: string){
    const uri = process.env.MONGODB_URI || '';

    const mongoClient = new MongoClient(uri);
    
    try{
        const db = mongoClient.db('hitmygift');
        
        const messages = await db.collection<Message>('messages').find({
            conversationId: conversationId,
        }).toArray();

        // Turning _id into string 
        const messagesSimplified:Message[] = messages.map((message) => (
            {
                id: message._id.toString(),
                sender: message.sender,
                conversationId: message.conversationId,
                content: message.content,
                timestamp: message.timestamp,
            }
        ));

        if (messages.length > 0){
            return {
                status: 200,
                data: messagesSimplified,
            }
        }
    
        return {
            status: 400,
        }

    }catch(e){
        console.log(e);
         
        return {
            status: 500,
        }
    }finally{
        mongoClient.close();
    }    
}