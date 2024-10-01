'use server'

import { mongoClient } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

type UserData = {
    _id: ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    hobbyInfo: string;
    showInterest: boolean;
}

export default async function getUserHobbies(userId: string){
    
    try{
        const db = mongoClient.db('hitmygift');
        const user = await db.collection<UserData>('users').findOne({
            _id: new ObjectId(userId)
        });

        if (user){
            console.log(user._id);
            return {
                hobbiesInfo: user.hobbyInfo,
                status: 200,
            }
        }

        return {
            message: 'User not found',
            status: 400,
        }
    }catch(e){
        return {
            message: 'Server failed to access user hobbies',
            status: 500,
        }
    }
}