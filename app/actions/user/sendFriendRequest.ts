"use server";

import { MongoClient } from "mongodb";
import sendInviteByEmail from "../email/sendInviteByEmail";

export async function sendFriendRequest(senderId: string, receiverEmail: string) {
  const uri = process.env.MONGODB_URI || "";
  const mongoClient = new MongoClient(uri);

  try {
    const db = mongoClient.db("hitmygift");

    // 1. Find the receiver by email
    const receiver = await db.collection("users").findOne({ email: receiverEmail });

    // 2. Determine receiverId
    let receiverId: string;
    if (receiver) {
      receiverId = receiver._id.toString();
    } else {
      // If receiver not found, send an invite and use email as temporary ID
      await sendInviteByEmail(senderId, receiverEmail);
      receiverId = receiverEmail; 
    }

    // 3. Check for existing friend request (using a compound index for efficiency)
    const existingRequest = await db.collection("friendRequest").findOne({
      senderId: senderId,
      receiverId: receiverId,
    });

    if (existingRequest) {
      return {
        status: 400,
        message: "Friend request already exists",
      };
    }

    // 4. Create the friend request
    const friendRequest = {
      senderId: senderId,
      receiverId: receiverId,
    };

    const result = await db.collection("friendRequest").insertOne(friendRequest);

    if (result.insertedId) {
      return {
        status: 200,
        message: "Friend request sent successfully",
        data: result.insertedId.toString(),
      };
    } else {
      return {
        status: 500,
        message: "Failed to send friend request",
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