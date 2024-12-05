'use server';

import { MongoClient, ObjectId } from 'mongodb';

// Removes the friend from the current user's friendsList and the friend's friendsList,
// deletes conversations and messages between them, and disassociates the friend from the user's events.
export default async function removeFriend(userId: string, friendId: string) {
  const uri = process.env.MONGODB_URI || '';
  const mongoClient = new MongoClient(uri);
  const session = mongoClient.startSession();

  try {
    const db = mongoClient.db('hitmygift');

    await session.withTransaction(async () => {
      // Remove the friendId from the user's friendsList
      await db.collection('users').updateOne(
        { _id: new ObjectId(userId) },
        { $pull: { friendsList: friendId } },
        { session }
      );

      // Remove the userId from the friend's friendsList
      await db.collection('users').updateOne(
        { _id: new ObjectId(friendId) },
        { $pull: { friendsList: userId } },
        { session }
      );

      // Find conversations between the user and friend
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

      // Delete conversations
      if (conversationIds.length > 0) {
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

      // Remove friendId from user's events' invitedFriends
      await db.collection('events').updateMany(
        { userId: userId, invitedFriends: friendId },
        { $pull: { invitedFriends: friendId } },
        { session }
      );
    });

    // Transaction committed successfully
    return {
      status: 200,
      message: 'Friend removed successfully',
    };
  } catch (e) {
    console.error(e);
    // Transaction aborted due to error
    return {
      status: 500,
      message: 'Internal server error',
    };
  } finally {
    await session.endSession();
    await mongoClient.close();
  }
}
