'use server'

import { FriendRequestServerResponse } from "@/lib/types/friendrequest";
import { MongoClient, ObjectId } from "mongodb";

// Data received by the client from the server after creating a new friend request.
export async function seenFriendRequests(
  friendRequests: FriendRequestServerResponse[],
  userId: string,
) {
  const uri = process.env.MONGODB_URI || "";
  const mongoClient = new MongoClient(uri);

  try {
    const db = mongoClient.db("hitmygift");
    const friendRequestCollection = db.collection("friendRequest");

    // Instead of updating all requests at once, we'll iterate and update individually
    const updates = friendRequests.map(async (request) => {
      const objectId = new ObjectId(request.id);

      // Determine whether the user is the sender or receiver
      const updateField = request.sender.id === userId ? 'isSeenSender' : 'isSeenReceiver';

      // Update the correct field
      const result = await friendRequestCollection.updateOne(
        { _id: objectId },
        { $set: { [updateField]: true } } 
      );

      if (result.modifiedCount !== 1) {
        console.warn(`Failed to update friend request ${request.id}`);
      }
    });

    await Promise.all(updates); // Wait for all updates to complete

    return {
      status: 200,
      message: "Friend requests updated successfully",
    };

  } catch (e) {
    console.error(e);
    return {
      status: 500,
      message: "Internal server error",
    };
  } finally {
    mongoClient.close();
  }
}
