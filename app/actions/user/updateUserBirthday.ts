'use server'

import { mongoClient } from "@/lib/mongodb";
import { UserData } from "@/lib/types/user";
import { ObjectId } from "mongodb";



export default async function updateUserBirthday(userId: string, birthday: string){
    try{
        const db = mongoClient.db('hitmygift');
        await db.collection<UserData>('users').updateOne({_id: new ObjectId(userId)}, {
            $set: {birthday: birthday},
        });
    
        return {
            message: 'Update successful',
            status: 200,
        }
    }catch(e){
        console.log(e);
        return {
            message: 'Server failed to update user first name',
            status: 500,
        }
    }
}