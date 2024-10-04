'use server'

import { mongoClient } from "@/lib/mongodb";
import { UserData } from "@/lib/types/user";
import { ObjectId } from "mongodb";


export default async function updateUserEmail(userId: string, email: string){
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
        return {
            message: 'Server failed to update user email',
            status: 500,
        }
    }
}