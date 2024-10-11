'use client'

import { RootState } from "@/lib/store"
import { useEffect, useState } from "react";
import { useSelector } from "react-redux"

export default function Sandbox() {
  const events = useSelector((state: RootState) => state.mylist.events);
  const [isClient, setIsClient] = useState(false);
  useEffect(()=>{
    setIsClient(true)
  }, []);
  
  return (
    <div>
      {isClient && <div>
      {
        events.map((event) => (
          <div key={event.id}>
            {event.eventTitle}
          </div>
        ))
      }
      </div>}
    </div>
  )
 
}
