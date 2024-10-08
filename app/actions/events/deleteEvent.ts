'use server'

import { mongoClient } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function deleteEvent(id: string) {
    try {
        const db = mongoClient.db('hitmygift');
   
        await db.collection('events').deleteOne({_id: new ObjectId(id)});

        return { message: "Event deletion success", status: 200 };
    } catch (e) {
        console.log(e);
        return { message: "Event deletion failed", status: 500 };
    }
}

