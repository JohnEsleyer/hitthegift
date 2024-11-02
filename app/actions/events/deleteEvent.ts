'use server'

import { MongoClient, ObjectId } from "mongodb";

export async function deleteEvent(id: string) {
    const uri = process.env.MONGODB_URI || '';
    const mongoClient = new MongoClient(uri);
    try {
        const db = mongoClient.db('hitmygift');
   
        await db.collection('events').deleteOne({_id: new ObjectId(id)});

         
        return { message: "Event deletion success", status: 200 };
    } catch (e) {
        console.log(e);
         
        return { message: "Event deletion failed", status: 500 };
    }finally{
        mongoClient.close();
    }
}

