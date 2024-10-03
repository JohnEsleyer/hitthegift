import { Friend } from "./friend";

export type EventData = {
    date: Date,
    eventTitle: string,
    invitedFriends: Friend[], // A list of Ids
}

