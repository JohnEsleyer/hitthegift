'use server'

import { hashPassword } from "@/lib/hashPassword";
import { mongoClient } from "@/lib/mongodb";
import { UserData } from "@/lib/types/authTypes";

export async function createEvent(data: EventData) {
    try {
        const db = mongoClient.db('hitmygift');
   
        await db.collection('events').insertOne({ // Await the database operation
            date: data.date,
            eventTitle: data.eventTitle,
            invitedFriends: data.invitedFriends,
        });

        return { message: "Registration Success", status: 200 };
    } catch (e) {
        console.log(e);
        return { message: "Registration Failed", status: 500 };
    }
}

export async function testAction(data: string){
    console.log("Hello " +data);
}