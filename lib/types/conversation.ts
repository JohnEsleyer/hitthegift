import { ObjectId } from "mongodb";

export type Conversation = {
    id: string;
    participants: string[],
    createdAt: Date,
    updatedAt: Date,
}