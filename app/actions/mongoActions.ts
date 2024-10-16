'use server'

import { mongoClient } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// Used by the client to create ObjectId in string format.
export async function createObjectId(){
    const strObjectId = new ObjectId();

    return strObjectId.toString();
}

export async function deleteAllUsers(){
    try{
        mongoClient.db('hitmygift').collection('users').deleteMany({});
    }catch(e){
        console.log(e);
    }
}