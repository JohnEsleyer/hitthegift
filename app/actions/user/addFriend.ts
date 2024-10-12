'use server'

import { mongoClient } from "@/lib/mongodb";
import { ObjectId } from "mongodb";


export default async function addFriend(userId: string, friendEmail: string){
    try{
        
        const db = mongoClient.db('hitmygift');
       
        const friend = await db.collection('users').findOne({
            email: friendEmail
        });

        if (!friend){
            console.log('Friend not found');
            return {
                status: 400,
                message: 'Friend not found'
            }
        }

        const res = await db.collection('users').updateOne(
            {_id: new ObjectId(userId)},
            {$addToSet: {friendsList: friend._id.toString()}}
        );

        if (res.modifiedCount > 0){
            console.log('Friend added successfully');
            return {
                status: 200,
                message: 'Friend added successfully'
            };
        }else{
            return {
                status: 500,
                message: 'Failed to add friend'
            };
        }
    }catch(e){
        console.log(e);
        return {
            status: 500,
            message: 'Internal server error'
        }
    }
}