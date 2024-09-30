'use client'

import { createEvent } from "@/app/actions/events/createEvent";
import { deleteEvent } from "@/app/actions/events/deleteEvent";
import { id } from "date-fns/locale";
import { useState } from "react";


export default function TestEvent(){
    const [idToDelete, setIdToDelete] = useState('');

    const newEvent = async () => {
        createEvent({
            id: '9i93i9kfoweiju32f' + Math.random() * 1000,
            date: 'May 13,2002',
            eventTitle: 'My Birthday',
            invitedFriends: [
                'ikfn239024',
            ],
        });
    }

    const deleteEventInstance = async () => {
        deleteEvent(idToDelete)
    }


    return (
        <div className="flex flex-col justify-center items-center gap-2">
      
            <button className="border " onClick={newEvent}>Create new event</button>
            <div className="flex gap-2">
            <button className="border " onClick={deleteEventInstance}>Delete new event</button>
            <input className="border" value={idToDelete} onChange={(e) => {
                setIdToDelete(e.target.value);
            }}/>
            </div>
        </div>
    );
}