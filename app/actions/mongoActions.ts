'use server'

import { MongoClient, ObjectId } from "mongodb";

// Used by the client to create ObjectId in string format.
export async function createObjectId(){
    const strObjectId = new ObjectId();

    return strObjectId.toString();
}

export async function deleteAllUsers(){
    const uri = process.env.MONGODB_URI || '';
    const mongoClient = new MongoClient(uri);
    try{
        mongoClient.db('hitmygift').collection('users').deleteMany({});
    }catch(e){
        console.log(e);
    }finally{
        mongoClient.close();
    }
}