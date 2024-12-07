'use server'

import { Message } from "@/lib/types/message";
import { MongoClient, ObjectId } from "mongodb";

export default async function fetchMessages(conversationId: string) {
  const uri = process.env.MONGODB_URI || '';
  const mongoClient = new MongoClient(uri);
  
  try {
    const db = mongoClient.db('hitmygift');

    // Sort messages by timestamp ascending to avoid client-side sorting
    const messagesCursor = db.collection<Message>('messages')
      .find({ conversationId }, {
        projection: {
          _id: 1,
          sender: 1,
          conversationId: 1,
          content: 1,
          timestamp: 1,
          senderIsRead: 1,
          receiverIsRead: 1,
        }
      })
      .sort({ timestamp: 1 });

    const messages = await messagesCursor.toArray();

    const messagesFormatted: Message[] = messages.map((message) => ({
      id: message._id.toString(),
      sender: message.sender,
      conversationId: message.conversationId,
      content: message.content,
      timestamp: message.timestamp,
      senderIsRead: message.senderIsRead,
      receiverIsRead: message.receiverIsRead,
    }));

    if (messages.length > 0) {
      return {
        status: 200,
        data: messagesFormatted,
      }
    }

    return {
      status: 400,
    }

  } catch (e) {
    console.log(e);
    
    return {
      status: 500,
    }
  } finally {
    await mongoClient.close();
  }
}
