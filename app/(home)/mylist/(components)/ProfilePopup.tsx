"use client";
import { ChangeEvent, useEffect, useState, useTransition } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";

import getUserInfo from "@/app/actions/user/getUserInfo";

import updateUserBirthday from "@/app/actions/user/updateUserBirthday";

import UserProfile from "@/components/UserProfile";
import ProfileSkeleton from "@/components/skeletons/ProfileSkeleton";
import { DebouncedInput } from "@/components/DebounceInput";
import updateUserFirstName from "@/app/actions/user/updateUserFirstName";
import updateUserEmail from "@/app/actions/user/updateUserEmail";
import { updateUserFirstNameStore } from "@/lib/features/userData";

export default function AddEventPopup() {
  const userId = useSelector((state: RootState) => state.userData.id);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isSaving, setIsSaving] = useState(false);

  const dispatch = useDispatch();

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

  // Unified save function to handle API calls
  const handleSaveBirthday = async (value: string) => {
    setIsSaving(true);
    try {
      const res = await updateUserBirthday(userId, value);
      if (res) {
        console.log(res.message);
      } else {
        console.log("Failed to update birthday");
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
    await handleSaveBirthday(newDate);
  };

  const updateFirstName = async (inputValue: string) => {
    console.log('triggering updateFirstName');

    try{
      await updateUserFirstName(userId, inputValue);
      dispatch(updateUserFirstNameStore(inputValue));
    }catch(e: any){
      console.log('from updateFirstName: ' + e);
    }

    setIsSaving(false);
  };

  const updateEmail = async (inputValue: string) => {
    
    try{
      await updateUserEmail(userId, inputValue);
      
      
    }catch(e: any){
      console.log('from updateEmail: ' + e);
    }
    
    
    setIsSaving(false);
    
  }

  return (
    <div
      style={{ width: 500, height: 500 }}
      className="p-4 bg-white flex flex-col items-center justify-start rounded-2xl border border-gray"
    >
      {isPending ? (
        <ProfileSkeleton />
      ) : (
        <div className="w-full flex flex-col items-center justify-center">
          <div className="flex flex-col items-left w-full h-8">
            {isSaving && (
              <div>
                <span className="text-xs flex">Saving</span>
              </div>
            )}
          </div>

          <UserProfile width={120} height={120} allowEdit={true} />
          <div className="mt-2 flex justify-center">
            <DebouncedInput
              value={firstName}
              fontSize={30}
              placeholder={"Name"}
              delay={2000} // wait 2 seconds before executing the callback function
              onUserStopTyping={updateFirstName}
              onWait={() => {
                console.log('triggering onWait');
                setIsSaving(true);
              }}
              width={200}
              isCenter={true}
            />
          </div>
          <DebouncedInput
            value={email}
            fontSize={15}
            placeholder={"name@email.com"}
            delay={2000} // wait 2 seconds before executing the callback function
            onUserStopTyping={updateEmail}
            onWait={() => {
              setIsSaving(true);
            }}
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
}
