"use server";

import { Conversation } from "@/lib/types/conversation";
import { Message } from "@/lib/types/message";
import { MongoClient, ObjectId } from "mongodb";

/**
 * Fetches all conversations for a user and the number of unread messages in each conversation.
 *
 * This function queries the 'conversations' collection to find all conversations where the user is a participant.
 * Then, for each conversation, it counts the number of unread messages sent by other participants.
 *
 * @param userId The ID of the user.
 * @returns An object with a `status` code and `data` if successful.
 *          - `status`: 200 if successful, 500 if an error occurred.
 *          - `data`: If successful, an array of objects, each containing:
 *              - `conversation`: Conversation details (id, participants, createdAt).
 *              - `unreadCount`: The number of unread messages in the conversation.
 */

interface UserConversation {
  conversationId: string;
  unreadMessageCount: number;
  friend: {
    id: string;
    name: string;
  };
}

export default async function fetchAllConversationsByUserId(userId: string) {
    const uri = process.env.MONGODB_URI || "";
    const mongoClient = new MongoClient(uri);
  
    try {
      const db = mongoClient.db("hitmygift");
  
      // 1. Find conversations where the user is a participant
      const conversations = await db
        .collection<Conversation>("conversations")
        .find({
          participants: userId,
        })
        .toArray();
  
      const userConversations: UserConversation[] = [];
  
      // 2. For each conversation, get details
      for (const conversation of conversations) {
        const unreadCount = await db
          .collection<Message>("messages")
          .countDocuments({
            conversationId: conversation._id.toString(),
            isRead: false,
            sender: { $ne: userId }, // Exclude messages sent by the user
          });
  
        // Determine the friend's ID
        const friendId = conversation.participants.find((id) => id !== userId);
  
        if (!friendId) {
          console.warn(
            `Conversation ${conversation._id} has less than 2 participants.`
          );
          continue; // Skip this conversation
        }
  
        const friend = await db.collection("users").findOne({
          _id: new ObjectId(friendId),
        });
  
        if (!friend) {
          console.warn(`Friend with ID ${friendId} not found.`);
          continue; // Skip if friend not found
        }
  
        userConversations.push({
          conversationId: conversation._id.toString(),
          unreadMessageCount: unreadCount,
          friend: {
            id: friendId,
            name: `${friend.firstName} ${friend.lastName}`,
          },
        });
      }
  
      return {
        status: 200,
        data: userConversations,
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
