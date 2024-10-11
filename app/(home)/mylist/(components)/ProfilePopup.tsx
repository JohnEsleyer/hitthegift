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
import UserProfile from "@/components/UserProfile";

export default function AddEventPopup() {
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
  }, [userId, startTransition]);

  // // Debounce handler for name change
  // const handleDebounceChangeName = async (value: string) => {
  //   setFirstName(value);
  //   await handleSave(updateUserFirstName, value, "Failed to update name at server");
  // };

  // // Debounce handler for email change
  // const handleDebounceChangeEmail = async (value: string) => {
  //   setEmail(value);
  //   await handleSave(updateUserEmail, value, "Failed to update email at server");
  // };

  // Unified save function to handle API calls
  const handleSave = async (updateFunction: Function, value: string, errorMessage: string) => {
    setIsSaving(true);
    try {
      const res = await updateFunction(userId, value);
      if (res) {
        console.log(res.message);
      } else {
        console.log(errorMessage);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangeDate = async (e: ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setBirthday(newDate);
    await handleSave(updateUserBirthday, newDate, "Failed to update birthday at server");
  };

  return (
    <div
      style={{ width: 500, height: 500 }}
      className="p-4 bg-white flex flex-col items-center justify-start rounded-2xl border border-gray"
    >
      {isPending ? (
        <div>Loading...</div>
      ) : (
        <div className="w-full flex flex-col items-center justify-center">
          <div className="flex flex-col items-left w-full h-8">
            {/* {isSaving && (
              <div>
                <Image src={Loading} alt={""} height={30} />
                <span className="text-xs flex">Saving</span>
              </div>
            )} */}
          </div>

          <UserProfile width={120} height={120} allowEdit={true}/>
          <div className="mt-2 flex justify-center">
            <DebouncedInput
              value={firstName}
              fontSize={30}
              placeholder={"Name"}
              delay={2000} // wait 2 seconds before executing the callback function
              onDebouncedChange={()=>{}}
              width={200}
              isCenter={true}
            />
          </div>
          <DebouncedInput
            value={email}
            fontSize={15}
            placeholder={"name@email.com"}
            delay={2000} // wait 2 seconds before executing the callback function
            onDebouncedChange={()=>{}}
            width={200}
            isCenter={true}
          />

          {/**Date of birth */}
          <div className="w-full mt-4">
            <p>Date of birth</p>
            <input
              className="border-2 border-gray-300"
              type="date"
              value={birthday}
              onChange={handleChangeDate}
            />
          </div>
        </div>
      )}
    </div>
  );
};


