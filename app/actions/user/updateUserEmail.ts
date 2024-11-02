'use server'

import { UserData } from "@/lib/types/user";
import { MongoClient, ObjectId } from "mongodb";


export default async function updateUserEmail(userId: string, email: string){
    const uri = process.env.MONGODB_URI || '';
    const mongoClient = new MongoClient(uri);
    try{
        const db = mongoClient.db('hitmygift');
        await db.collection<UserData>('users').updateOne({_id: new ObjectId(userId)}, {
            $set: {email: email},
        });
        
         
        return {
            message: 'Update successful',
            status: 200,
        }
    }catch(e){
        console.log(e);

         
        return {
            message: 'Server failed to update user email',
            status: 500,
        }
    }finally{
        mongoClient.close();
    }
}