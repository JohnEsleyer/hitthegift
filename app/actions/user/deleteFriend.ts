'use server'

import { mongoClient } from "@/lib/mongodb";
import { ObjectId } from "mongodb";


export default async function deleteFriend(friendId: string){
    try{
        const db = mongoClient.db('hitmygift');
        const res = await db.collection('users').deleteOne({
            _id: new ObjectId(friendId)
        });
        console.log('Friend deleted successfully');
        return {
            status: 200,
        }
    }catch(e){
        console.log(e);
        return {
            status: 500,
        }
    }
}