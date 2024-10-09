"use client";
import { ChangeEvent, useEffect, useState, useTransition } from "react";
import Avvvatars from "avvvatars-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";

import Loading from "/public/loading.svg";
import Image from "next/image";
import getUserInfo from "@/app/actions/user/getUserInfo";

import DebouncedInput from "@/components/DebounceInput";
import updateUserBirthday from "@/app/actions/user/updateUserBirthday";
import updateUserEmail from "@/app/actions/user/updateUserEmail";
import updateUserFirstName from "@/app/actions/user/updateUserFirstName";

export default function AddEventPopup() {
  const dispatch = useDispatch();

  const userId = useSelector((state: RootState) => state.userData.id);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    startTransition(async () => {
      console.log(`id sent to server: ${userId}`);
      const results = await getUserInfo(userId);
      console.log(`status: ${results?.status}`);
      if (results) {
        setFirstName(results.firstName || "");
        setLastName(results.lastName || "");
        setEmail(results.email || "");
        setBirthday(results.birthday || "");
      }
    });
  }, []);

  const handleDebounceChangeName = async (value: string) => {
    setIsSaving(true);
    try {
      const res = await updateUserFirstName(userId, firstName);
      if (res) {
        console.log(res.message);
      } else {
        console.log("Failed to update name at server");
      }
    } catch (e) {
      console.log(e);
    }
    setIsSaving(false);
  };

  const handleDebounceChangeEmail = async (value: string) => {
    setIsSaving(true);
    try {
      const res = await updateUserEmail(userId, email);
      if (res) {
        console.log(res.message);
      } else {
        console.log("Failed to update email at server");
      }
    } catch (e) {
      console.log(e);
    }
    setIsSaving(false);
  };

  const handleChangeDate = async (e: ChangeEvent<HTMLInputElement>) => {
    setIsSaving(true);
    try {
      const res = await updateUserBirthday(userId, birthday);
      if (res) {
        console.log(res.message);
      } else {
        console.log("Failed to update birthday at server");
      }
    } catch (e) {
      console.log(e);
    }

    setBirthday(e.target.value);
    setIsSaving(false);
  };

  return (
    <div
      style={{ width: 500, height: 500 }}
      className=" p-4 bg-white  flex flex-col items-center justify-start rounded-2xl border-2 border-black"
    >
      {isPending ? (
        <div>Loading...</div>
      ) : (
        <div className=" w-full flex flex-col flex items-center justify-center">
          <div className="flex flex-col items-left w-full h-8">
            {isSaving && (
              <div>
                <Image src={Loading} alt={""} height={30} />
                <span className="text-xs flex ">Saving</span>
              </div>
            )}
          </div>

          <Avvvatars value={`${firstName}`} size={120} />
          <div
            style={{ width: 1 }}
            className="mt-2 flex justify-center bg-red-300"
          >
            <DebouncedInput
              value={firstName}
              fontSize={30}
              placeholder={"Name"}
              delay={2000} // wait 2 milliseconds before executing the callback function
              onDebouncedChange={handleDebounceChangeName}
              width={200}
              isCenter={true}
            />
          </div>
          <DebouncedInput
            value={email}
            fontSize={15}
            placeholder={"name@email.com"}
            delay={2000} // wait 2 milliseconds before executing the callback function
            onDebouncedChange={handleDebounceChangeEmail}
            width={200}
            isCenter={true}
          />

          {/**Date of birth */}
          <div className=" w-full mt-4">
            <p>Date of birth</p>
            <input
              className="border-2 border-gray-300"
              type="date"
              value={birthday}
              onChange={(e) => {
                handleChangeDate(e);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
