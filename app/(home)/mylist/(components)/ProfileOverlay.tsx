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
import getUserInfo from "@/app/actions/user/getUserInfo";
import { stringToDate } from "@/utils/stringToDate";

export default function AddEventOverlay() {
  const dispatch = useDispatch();

  const userId = useSelector((state: RootState) => state.userData.id);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthday, setBirthday] = useState<Date>();
  const [birthdayStr, setBirthdayStr] = useState('');
  const [email, setEmail] = useState('');
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
        console.log(`id sent to server: ${userId}`);
        const results = await getUserInfo(userId);
        console.log(`status: ${results?.status}`);
        if (results){
            setFirstName(results.firstName || '');
            setLastName(results.lastName || '');
            setEmail(results.email || '');
            setBirthday(stringToDate(results.birthday || ''));
            setBirthdayStr(results.birthday || '');
        }
       
    });
  }, []);

  return (
    <div
      style={{ width: 500, height: 450 }}
      className=" p-4 bg-white  flex flex-col items-center justify-start rounded-2xl border-2 border-black"
    >
      {
        isPending ? <div>Loading...</div> : 
        <div className="mt-4 w-full flex flex-col flex items-center justify-center">
        <Avvvatars value={`${firstName}`} size={120} />
        <p  
            style={{fontSize: 30}} 
            className="flex justify-center">
                {firstName} {lastName}
        </p>
        <p>{email}</p>
        <div className=" w-full mt-4">
            <p>Date of birth</p>
            <input
                className="border-2 border-gray-300"
                type="date"
                value={birthdayStr}
                onChange={(e) => {
                //   setUserData((prev) => ({
                //     ...prev,
                //     birthday: e.target.value,
                //   }));
                }}
              />    
        </div>
        </div>
        }
    </div>
  );
}
