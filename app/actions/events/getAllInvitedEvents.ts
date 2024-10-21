'use server';

import { mongoClient } from "@/lib/mongodb";
import { EventData, InvitedEventsResponse } from "@/lib/types/event";
import getUserInfo from "../user/getUserInfo";

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
  console.log("getAllInvitedEvents");
  try {
    const db = mongoClient.db('hitmygift');

    // Query the database for events where the userId is in the invitedFriends array
    const events = await db.collection<EventData>('events').find({
      invitedFriends: userId,
    }).toArray();

    console.log(`Length: ${events.length}`);

    if (events.length > 0) {
      console.log(`Events length: ${events.length}`);

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

      console.log(`array: ${responseData}`);
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
  }
}
