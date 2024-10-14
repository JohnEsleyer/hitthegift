'use client'

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { insertMyListEvent, updateMyListEvents } from '@/lib/features/mylist';
import { v4 as uuidv4 } from 'uuid';
import { useEffect, useState } from 'react';


function ComponentA(){
  const events = useSelector((state: RootState) => state.mylist.events);
  
  return (<div>
    {
      events.map((event) => (
        <div key={event.id}>
          {event.eventTitle}
          </div>
      ))
    }
  </div>)
}


function ComponentB(){
  const userId = useSelector((state: RootState) => state.userData.id);
  const dispatch = useDispatch();
  return (<div>
    <button className="outline p-2" onClick={() => {
      dispatch(insertMyListEvent({
        id: uuidv4(),
        date: new Date(),
        userId: userId, 
        eventTitle: 'Random Event',
        invitedFriends: [{
          id: uuidv4(),
          firstName: 'First Name',
          lastName: 'Last Name',
        }]
      }))
    }}> Add event</button>
  </div>)
}


export default function Sandbox() {

  const [isClient, setIsClient] = useState(false);


  useEffect(()=>{
    setIsClient(true);
  }, []);

 return (<div>
  {isClient ? <div>
    <ComponentA/>
    <ComponentB/>
  </div> : <div></div>}
  </div>
 )
 
}
