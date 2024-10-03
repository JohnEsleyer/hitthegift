'use server'

import { mongoClient } from "@/lib/mongodb";
import { UserData } from "@/lib/types/user";
import { ObjectId } from "mongodb";


export default async function getUserInfo(userId: string){
    
    try{
        const db = mongoClient.db('hitmygift');
        const user = await db.collection<UserData>('users').findOne({
            _id: new ObjectId(userId)
        });

        if (user){
            console.log(user._id);
            return {
                hobbiesInfo: user.hobbyInfo,
                firstName: user.firstName,
                lastName: user.lastName,
                birthday: user.birthday,
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