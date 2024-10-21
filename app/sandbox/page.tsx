'use client'

import { deleteAllEvents } from "../actions/events/deleteAllEvents"

export default function Sandbox(){

  const handleDelete = async () => {
    const res = await deleteAllEvents();
  }

  return (
    <div>
      <button onClick={handleDelete}>Delete all events</button>
    </div>
  )
}