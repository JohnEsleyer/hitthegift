import { MongoClient, ObjectId } from "mongodb";

export default async function markMessagesAsRead(messageIds: string[]) {
    const uri = process.env.MONGODB_URI || '';

    const mongoClient = new MongoClient(uri);

    try {
        const db = mongoClient.db('hitmygift');
        const messagesCollection = db.collection('messages');

        // Convert string IDs to ObjectId
        const objectIds = messageIds.map(id => new ObjectId(id));

        // Update all messages with the given IDs to set isRead to true
        const result = await messagesCollection.updateMany(
            { _id: { $in: objectIds } },
            { $set: { isRead: true } }
        );

        if (result.modifiedCount > 0) {
            return {
                status: 200,
                updatedCount: result.modifiedCount,
            };
        }

        return {
            status: 404, // No messages found to update
            message: 'No messages found with the provided IDs.',
        };

    } catch (e) {
        console.log(e);

        return {
            status: 500,
            error: 'An error occurred while updating messages.',
        };

    } finally {
        mongoClient.close();
    }
}
