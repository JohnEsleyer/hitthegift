'use server';

import { MongoClient, ObjectId } from 'mongodb';

interface User {
  _id: ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  hobbyInfo: string;
  birthday: string;
  showInterest: boolean;
  verified: boolean;
  verificationToken: string;
  friendsList: string[];
  conversations: string[];
  resetToken: string;
}

interface Event {
  _id: ObjectId;
  userId: string;
  date: string;
  eventTitle: string;
  invitedFriends: string[]; // Important: this must be an array of strings
}


export default async function removeFriend(userId: string, friendId: string) {
  const uri = process.env.MONGODB_URI || '';
  const mongoClient = new MongoClient(uri);
  const session = mongoClient.startSession();

  try {
    const db = mongoClient.db('hitmygift');
    const usersCollection = db.collection<User>('users');

    await session.withTransaction(async () => {
      // Remove the friendId from the user's friendsList
      await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $pull: { friendsList: friendId } },
        { session }
      );

      // Remove the userId from the friend's friendsList
      await usersCollection.updateOne(
        { _id: new ObjectId(friendId) },
        { $pull: { friendsList: userId } },
        { session }
      );

      // Remove conversations and messages
      const conversationFilter = {
        participants: { $all: [userId, friendId] },
        $expr: { $eq: [{ $size: '$participants' }, 2] },
      };

      const conversationsToDelete = await db
        .collection('conversations')
        .find(conversationFilter, { session })
        .toArray();

      const conversationIds = conversationsToDelete.map((convo) => convo._id);
      const conversationIdStrings = conversationIds.map((id) => id.toString());

      if (conversationIds.length > 0) {
        // Delete conversations
        await db.collection('conversations').deleteMany(
          { _id: { $in: conversationIds } },
          { session }
        );

        // Delete messages associated with those conversations
        await db.collection('messages').deleteMany(
          { conversationId: { $in: conversationIdStrings } },
          { session }
        );
      }

      const eventsCollection = db.collection<Event>('events');
      // Remove the friend from all the user's events
      await eventsCollection.updateMany(
        { userId: userId, invitedFriends: friendId },
        { $pull: { invitedFriends: friendId } },
        { session }
      );
      // Remove the user from all the friends's events
      await eventsCollection.updateMany(
        { userId: friendId, invitedFriends: userId },
        { $pull: { invitedFriends: userId } },
        { session }
      );
      
    });

    return {
      status: 200,
      message: 'Friend removed successfully',
    };
  } catch (e) {
    console.error(e);
    return {
      status: 500,
      message: 'Internal server error',
    };
  } finally {
    await session.endSession();
    await mongoClient.close();
  }
}
