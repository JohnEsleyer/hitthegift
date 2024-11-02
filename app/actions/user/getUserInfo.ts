'use server'

import { UserData } from "@/lib/types/user";
import { MongoClient, ObjectId } from "mongodb";

export default async function getUserInfo(userId: string){  
    const uri = process.env.MONGODB_URI || '';
    const mongoClient = new MongoClient(uri);
    try{
        const db = mongoClient.db('hitmygift');
        const user = await db.collection<UserData>('users').findOne({
            _id: new ObjectId(userId)
        });

        if (user){
            console.log(user._id);
            return {
                hobbyInfo: user.hobbyInfo,
                firstName: user.firstName,
                lastName: user.lastName,
                verified: user.verified,
                verificationToken: user.verificationToken,
                email: user.email,
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
            message: 'Server failed to access user info',
            status: 500,
        }
    }finally{
        mongoClient.close();
    }
}