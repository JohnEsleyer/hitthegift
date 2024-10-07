'use client'

import { getAllEvents } from "@/app/actions/events/getAllEvents";
import { getAllEventsByMonth } from "@/app/actions/events/getAllEventsByMonth";
import { RootState } from "@/lib/store";
import { EventData, ServerResponseForEvents } from "@/lib/types/event";
import { useEffect, useState, useTransition } from "react";
import { useSelector } from "react-redux";

export default function displayMyEventsCurrentMonth(){
    const [isPending, startTransition] = useTransition();
    const userId = useSelector((state: RootState) => state.userData.id);
    const [events, setEvents] = useState<ServerResponseForEvents[]>([]);

    useEffect(() => {
        startTransition(async () => {
            const results = await getAllEventsByMonth(userId, 10);
            console.log(`status: ${results.message}`);
            if (results){
                setEvents(results.data || []);
            }
           
        });
    }, []);

    return (
        <div>
            {isPending 
            ?
            <div>Loading...</div>
            : 
            <div>
                {events.map((event) => (
                   <p key={event.id}>{event.eventTitle}</p>
                ))}
            </div> 
            }
        </div>
    )
}