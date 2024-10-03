"use client";
import { Calendar } from "@/components/ui/calendar";
import { useEffect, useState, useTransition } from "react";
import HourSelector from "./HourSelector";
import Avvvatars from "avvvatars-react";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrentOverlay } from "@/lib/features/overlays";
import { RootState } from "@/lib/store";
import getAllFriends from "@/app/actions/user/getAllFriends";
import { Friend } from "@/lib/types/friend";
import { createEvent } from "@/app/actions/events/createEvent";
import { convertTo24HourFormat } from "@/utils/convertTo24Hour";
import Loading from "/public/loading.svg";
import Image from "next/image";

export default function AddEventOverlay() {
  const dispatch = useDispatch();

  const userId = useSelector((state: RootState) => state.userData.id);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
        console.log(`id sent to server: ${userId}`);
        const results = await getAllFriends(userId);
        console.log(`status: ${results?.status}`);
        if (results){
            // setFirstName(results.);
            // setLastName
        }
       
    });
  });

  return (
    <div
      style={{ width: 500, height: 450 }}
      className=" p-4 bg-white  flex flex-col items-center justify-center rounded-2xl border-2 border-black"
    >
      <Avvvatars value={`${firstName}`} />
    </div>
  );
}
