'use server'

import { MongoClient, ObjectId } from "mongodb";
import { UserConversation } from "@/lib/types/conversation";

export async function fetchUserConversations(userId: string): Promise<{ status: number, data?: UserConversation[] }> {
  const uri = process.env.MONGODB_URI || '';
  const mongoClient = new MongoClient(uri);
  
  try {
    const db = mongoClient.db('hitmygift');
    const conversationDocs = await db.collection('conversations').find({ participants: userId }).toArray();
  
    const userConversations: UserConversation[] = [];
    // For simplicity, we assume that you have a 'users' collection to get friend info
    // and that you store messages in a 'messages' collection.
    for (const convo of conversationDocs) {
      const conversationId = convo._id.toString();
      const friendId = convo.participants.find((p: string) => p !== userId);
      
      // Fetch friend info
      const friendDoc = await db.collection('users').findOne({ _id: new ObjectId(friendId) });
      const friendName = friendDoc?.firstName || "Unknown";
      
      // Count unread messages for current user
      const messages = await db.collection('messages').find({ conversationId }).toArray();
      const unreadCount = messages.filter(m => m.sender !== userId && !m.receiverIsRead).length;
  
      userConversations.push({
        conversationId,
        friend: { id: friendId, name: friendName },
        unreadMessageCount: unreadCount
      });
    }
  
    return { status: 200, data: userConversations };
  } catch (e) {
    console.error("fetchUserConversations Error:", e);
    return { status: 500 };
  } finally {
    await mongoClient.close();
  }
}
