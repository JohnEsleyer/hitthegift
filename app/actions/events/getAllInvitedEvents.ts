'use server';

import { EventData, InvitedEventsResponse } from "@/lib/types/event";
import getUserInfo from "../user/getUserInfo";
import { MongoClient } from "mongodb";

/**
 * 
 * The getAllInvitedEvents function fetches all events for a 
 * given user where they are listed as an invited friend, 
 * including the owner's name.
 */

export async function getAllInvitedEvents(
  userId: string
): Promise<{
  message: string;
  data: InvitedEventsResponse[];
  status: number;
}> {
  const uri = process.env.MONGODB_URI || '';
    const mongoClient = new MongoClient(uri);
  try {
    const db = mongoClient.db('hitmygift');

    // Query the database for events where the userId is in the invitedFriends array
    const events = await db.collection<EventData>('events').find({
      invitedFriends: userId,
    }).toArray();

    if (events.length > 0) {

      // Use Promise.all to handle async mapping with owner's name fetch
      const responseData = await Promise.all(
        events.map(async (event) => {
          // Fetch the event owner's info
          const ownerInfo = await getUserInfo(event.userId);

           
          return {
            id: event._id.toString(),
            userId: event.userId,
            date: event.date,
            eventTitle: event.eventTitle,
            invitedFriends: event.invitedFriends,
            ownerName: `${ownerInfo.firstName} ${ownerInfo.lastName}`, // Add the owner's name
          };
        })
      );

       
      return {
        message: "Successfully fetched all events for invited friends",
        data: responseData,
        status: 200,
      };
    } else {
       
      return {
        message: "No events found for the given user as an invited friend",
        data: [],
        status: 404,
      };
    }
  } catch (e) {
    console.error(e);
     
    return {
      message: "Failed to fetch events",
      data: [],
      status: 500,
    };
  }finally{
    mongoClient.close();
}
}
