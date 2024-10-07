'use client'

import { getAllEvents } from "@/app/actions/events/getAllEvents";
import { getMonthlyInvitedEvents } from "@/app/actions/events/getMonthlyInvitedEvents";
import { RootState } from "@/lib/store";
import { EventData, ServerResponseForEvents } from "@/lib/types/event";
import { useEffect, useState, useTransition } from "react";
import { useSelector } from "react-redux";

 interface MonthlyInvitedEventsResponse {
    id: string;
    userId: string;
    date: Date;
    eventTitle: string;
    invitedFriends: string[];
    ownerName: string;
}

export default function displayInvitedEvent(){
    const [isPending, startTransition] = useTransition();
    const userId = useSelector((state: RootState) => state.userData.id);
    const [events, setEvents] = useState<MonthlyInvitedEventsResponse[]>([]);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        startTransition(async () => {
            const results = await getMonthlyInvitedEvents(userId, 10);
            console.log(`status: ${results.message}`);
            if (results){
                setEvents(results.data || []);
            }
           
        });
        setIsClient(true);
    }, []);

    return (
        <div>
            {isClient && <span>USER ID: {userId}</span>}
            {isPending 
            ?
            <div>Loading...</div>
            : 
            <div>
                {events.map((event) => (
                   <p key={event.id}>Title: {event.eventTitle} Owner: {event.ownerName} </p>
                ))}
            </div> 
            }
        </div>
    )
}