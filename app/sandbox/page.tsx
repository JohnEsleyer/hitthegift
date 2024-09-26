'use client'
import { useTransition } from "react"
import { testAction } from "../actions/mongoActions";

export default function Homepage(){

  // This is for client-side loading state
  const [isPending, startTransition] = useTransition();

  return (
    <div>
      <button onClick={() => {
        startTransition(() => testAction("Earth"));
      }}
      disabled={isPending}
      >
      {isPending ? "Loading..." : "Trigger Server Action"}
      </button>
    </div>
  )
}