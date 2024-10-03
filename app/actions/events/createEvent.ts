'use server'

import { hashPassword } from "@/lib/hashPassword";
import { mongoClient } from "@/lib/mongodb";
import { UserData } from "@/lib/types/authTypes";
import { EventData } from "@/lib/types/event";

export async function createEvent(data: EventData) {
    try {
        const db = mongoClient.db('hitmygift');

        const friendsId = data.invitedFriends.map((friend) => friend.id);
        
        await db.collection('events').insertOne({ // Await the database operation
            date: data.date,
            eventTitle: data.eventTitle,
            invitedFriends: friendsId,
        });

        return { message: "Event Inserted Successfully", status: 200 };
    } catch (e) {
        console.log(e);
        return { message: "insert Event Failed", status: 500 };
    }
}
