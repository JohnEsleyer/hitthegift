'use client'

import { getAllEvents } from "@/app/actions/events/getAllEvents";
import { RootState } from "@/lib/store";
import { EventData } from "@/lib/types/event";
import { useEffect, useState, useTransition } from "react";
import { useSelector } from "react-redux";

export default function testGetevents(){
    const [isPending, startTransition] = useTransition();
    const userId = useSelector((state: RootState) => state.userData.id);
    const [events, setevents] = useState<EventData[]>([]);

    useEffect(() => {
        startTransition(async () => {
            console.log(`id sent to server: ${userId}`);
            const results = await getAllEvents(userId);
            console.log(`status: ${results?.status}`);
            if (results){
                setevents(results.data || []);
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
                    <p key={event.id}>{event.id} {event.eventTitle} {event.date.getDay()}</p>
                ))}
            </div>
            }
        </div>
    )
}