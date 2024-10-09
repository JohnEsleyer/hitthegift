'use server'

import { mongoClient } from "@/lib/mongodb";
import { Conversation } from "@/lib/types/conversation";
import { Message } from "@/lib/types/message";
import { ObjectId } from "mongodb";

export default async function createMessage(userId: string, conversationId: string, content: string){
    try{
        const db = mongoClient.db('hitmygift');
        
        const newMessage = await db.collection('messages').insertOne({
            sender: userId,
            conversationId: conversationId,
            content: content,
            timestamp: new Date(),
        });

        if (newMessage){
            return {
                status: 200,
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
    }    
}