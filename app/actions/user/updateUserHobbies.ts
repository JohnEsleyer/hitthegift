'use server'

import { MongoClient, ObjectId } from "mongodb";

type UserData = {
    _id: ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    hobbyInfo: string;
    showInterest: boolean;
}

export default async function updateUserHobbies(userId: string, hobbiesInfo: string){
    const uri = process.env.MONGODB_URI || '';
    const mongoClient = new MongoClient(uri);
    try{
        const db = mongoClient.db('hitmygift');
        await db.collection<UserData>('users').updateOne({_id: new ObjectId(userId)}, {
            $set: {hobbyInfo: hobbiesInfo},
        });
        
         
        return {
            message: 'Update successful',
            status: 200,
        }
    }catch(e){
        console.log(e);
         
        return {
            message: 'Server failed to update user hobbies',
            status: 500,
        }
    }finally{
        mongoClient.close();
    }
}