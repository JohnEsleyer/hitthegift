'use server'

import { MongoClient, ObjectId } from "mongodb";

// Data received by the client from the server after creating a new friend request.
export type FriendRequestServerResponse = {
  id: string;
  sender: {
    id: string;
    firstName: string;
    lastName: string;
  },
  receiver: {
    id: string;
    firstName: string;
    lastName: string;
  },
  isSeen: boolean;
}

export async function seenFriendRequests(
  friendRequests: FriendRequestServerResponse[]
) {
  const uri = process.env.MONGODB_URI || "";
  const mongoClient = new MongoClient(uri);

  try {
    const db = mongoClient.db("hitmygift");
    const friendRequestCollection = db.collection("friendRequest");

    const objectIds = friendRequests.map((request) => new ObjectId(request.id));

    // Update multiple documents in one operation
    const result = await friendRequestCollection.updateMany(
      { _id: { $in: objectIds } },
      { $set: { isSeen: true } }
    );

    if (result.modifiedCount === friendRequests.length) {
      return {
        status: 200,
        message: "Friend requests updated successfully",
      };
    } else {
      // Handle the case where not all requests were updated
      console.warn(
        `Expected to update ${friendRequests.length} requests, but only updated ${result.modifiedCount}`
      );
      return {
        status: 200, // Still success, but with a warning
        message: "Some friend requests were not updated",
      };
    }
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