"use server";

import { MongoClient } from "mongodb";

export default async function markMessagesAsRead(
  userId: string,
  conversationId: string
) {
  console.log(
    `markMessagesAsRead: userId = ${userId}, conversationId = ${conversationId}`
  );
  const uri = process.env.MONGODB_URI || "";
  const mongoClient = new MongoClient(uri);
  try {
    const db = mongoClient.db("hitmygift");

    let updateFilter;
    let updateQuery;

    // User is the sender in this conversation
    updateFilter = {
      conversationId: conversationId,
      sender: userId,
      senderIsRead: false,
    };
    updateQuery = {
      $set: { senderIsRead: true },
    };

    const result = await db
      .collection("messages")
      .updateMany(updateFilter, updateQuery);

    // User is the receiver in this conversation
    updateFilter = {
      conversationId: conversationId,
      sender: { $ne: userId },
      receiverIsRead: false,
    };
    console.log("updateFilter");
    console.log(updateFilter);
    updateQuery = {
      $set: { receiverIsRead: true },
    };

    const result2 = await db
      .collection("messages")
      .updateMany(updateFilter, updateQuery);

    if (result.modifiedCount > 0 || result2.modifiedCount > 0) {
      console.log("markMessagesAsRead: Messages marked as read successfully");
      return {
        status: 200,
        message: "markMessagesAsRead: Messages marked as read successfully",
      };
    } else {
      console.log("Messages mark as seen failed");
      return {
        status: 400,
        message: "No unread messages found for this conversation",
      };
    }
  } catch (e) {
    console.log(e);
    return {
      status: 500,
      message: "Internal server error",
    };
  } finally {
    await mongoClient.close();
  }
}