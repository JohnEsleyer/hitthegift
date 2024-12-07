'use server'

import { MongoClient } from "mongodb";

export default async function markMessagesAsRead(userId: string, conversationId: string) {
  const uri = process.env.MONGODB_URI || '';
  const mongoClient = new MongoClient(uri);
  try {
    const db = mongoClient.db('hitmygift');
    
    // Check if user is a sender in this conversation
    const senderCheck = await db.collection('messages').findOne({
      conversationId: conversationId,
      sender: userId
    });

    let updateFilter;
    let updateQuery;

    if (senderCheck) {
      // User is the sender in this conversation
      updateFilter = {
        conversationId: conversationId,
        sender: userId,
        senderIsRead: false
      };
      updateQuery = {
        $set: { senderIsRead: true }
      };
    } else {
      // User is the receiver in this conversation
      updateFilter = {
        conversationId: conversationId,
        sender: { $ne: userId },
        receiverIsRead: false
      };
      updateQuery = {
        $set: { receiverIsRead: true }
      };
    }

    const result = await db.collection('messages').updateMany(updateFilter, updateQuery);

    if (result.modifiedCount > 0) {
      console.log('Messages marked as read successfully');
      return {
        status: 200,
        message: 'Messages marked as read successfully'
      };
    } else {
      return {
        status: 400,
        message: 'No unread messages found for this conversation'
      };
    }
  } catch (e) {
    console.log(e);
    return {
      status: 500,
      message: 'Internal server error'
    };
  } finally {
    await mongoClient.close();
  }
}
