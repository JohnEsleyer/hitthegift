import { ObjectId } from "mongodb";


// Type used by the server to store data to MongoDB
export type FriendRequestMongoType = {
    _id: ObjectId;
    senderId: string;
    receiverId: string;
    isSeen: boolean;
}

// Data received by the client from the server after creating a new friend request.
export type FriendRequestServerResponse = {
    id: string;
    sender: {
        id: string;
        firstName: string;
        lastName: string;
    },
    receiver: {
        id: string;
        firstName: string;
        lastName: string;
    },
    isSeen: boolean;
}