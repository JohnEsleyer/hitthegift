'use server'

import { mongoClient } from "@/lib/mongodb";
import { Conversation } from "@/lib/types/conversation";
import { Message } from "@/lib/types/message";
import { ObjectId } from "mongodb";

export default async function fetchMessages(conversationId: string){
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
            
            console.log('200');
            return {
                status: 200,
                data: messagesSimplified,
            }
        }
        console.log('400');
        return {
            status: 400,
        }

    }catch(e){
        console.log(e);
        return {
            status: 500,
        }
    }    
}