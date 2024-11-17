import { ObjectId } from "mongodb";

export type Conversation = {
    id: string;
    participants: string[],
    createdAt: Date,
    updatedAt: Date,
}


// Type used by Inbox
export interface UserConversation {
    conversationId: string;
    unreadMessageCount: number;
    friend: {
        id: string;
        name: string;
    };
}
