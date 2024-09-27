'use client'
import { useTransition } from "react"
import { deleteAllUsers, testAction, testMongo } from "../actions/mongoActions";
import testTokenAction from "../actions/testAction";
import testAction2 from "../actions/testAction2";

export default function Homepage(){

  // This is for client-side loading state
  const [isPending, startTransition] = useTransition();

  return (
    <div className=" flex flex-col">
      <button onClick={() => {
        startTransition(() => testTokenAction());
      }}
      disabled={isPending}
      >
      {isPending ? "Loading..." : "Trigger Server Action"}
      </button>
      <button onClick={() => {
        testAction2();
      }}>
        Test2
      </button>
    </div>
  )
}