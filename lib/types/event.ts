import { Friend } from "./friend";

export type EventData = {
    id: string;
    date: Date;
    userId: string; //owner of event
    eventTitle: string;
    invitedFriends: Friend[]; // A list of Ids
}

