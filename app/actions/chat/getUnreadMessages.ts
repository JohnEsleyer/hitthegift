"use server";

import { Message } from "@/lib/types/message";
import { MongoClient } from "mongodb";

/**
 * Fetches the total number of unread messages for a user across all conversations.
 *
 * This function queries the 'messages' collection to count all unread messages where the user is not the sender.
 *
 * @param userId The ID of the user.
 * @returns An object with a `status` code and `unreadCount` if successful.
 *          - `status`: 200 if successful, 500 if an error occurred.
 *          - `unreadCount`: The total number of unread messages.
 */
export async function getUnreadMessages(userId: string) {
  const uri = process.env.MONGODB_URI || "";
  const mongoClient = new MongoClient(uri);

  try {
    const db = mongoClient.db("hitmygift");

    // Count all unread messages where the user is not the sender
    const unreadCount = await db.collection<Message>("messages").countDocuments({
      isRead: false,
      sender: { $ne: userId },
    });

    return {
      status: 200,
      unreadCount,
    };
  } catch (e) {
    console.log(e);
    return {
      status: 500,
    };
  } finally {
    mongoClient.close();
  }
}