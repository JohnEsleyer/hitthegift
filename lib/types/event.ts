import { Friend } from "./friend";

export type EventData = {
    id: string;
    date: Date;
    userId: string; //owner of event
    eventTitle: string;
    invitedFriends: string[]; // A list of Ids
}

// Type used by some client components
export type ServerResponseForEvents = {
    id: string;
    date: Date;
    userId: string; //owner of event
    eventTitle: string;
    invitedFriends: Friend[]; // A list of Ids
}

// Type used by /friendslist
export type MonthlyInvitedEventsResponse = {
    id: string;
    userId: string;
    date: Date;
    eventTitle: string;
    invitedFriends: string[];
    ownerName: string;
  }

