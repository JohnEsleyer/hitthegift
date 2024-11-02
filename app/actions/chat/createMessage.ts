'use server'

import { MongoClient } from "mongodb";


export default async function createMessage(userId: string, conversationId: string, content: string){
    
    const uri = process.env.MONGODB_URI || '';

    const mongoClient = new MongoClient(uri);
    
    const db = mongoClient.db('hitmygift');
    try{
        const newMessage = await db.collection('messages').insertOne({
            sender: userId,
            conversationId: conversationId,
            content: content,
            timestamp: new Date(),
        });

        if (newMessage){
             ;
            return {
                status: 200,
            }
        }

         ;
        return {
            status: 400,
        }

    }catch(e){
        console.log(e);
         ;
        return {
            status: 500,
        }
    }finally{
        mongoClient.close();
    }

}