"use client";
import { ChangeEvent, useEffect, useState, useTransition } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";

import getUserInfo from "@/app/actions/user/getUserInfo";

import updateUserBirthday from "@/app/actions/user/updateUserBirthday";

import UserProfile from "@/components/EditableUserProfile";
import ProfileSkeleton from "@/components/skeletons/ProfileSkeleton";
import { DebouncedInput } from "@/components/DebounceInput";
import updateUserFirstName from "@/app/actions/user/updateUserFirstName";
import updateUserEmail from "@/app/actions/user/updateUserEmail";
import { updateUserBirthdayStore, updateUserFirstNameStore } from "@/lib/features/userData";
import loading from '/public/loading.svg';
import Image from 'next/image';

export default function AddEventPopup() {
  const userId = useSelector((state: RootState) => state.userData.id);
  const firstName = useSelector((state: RootState) => state.userData.firstName);
  const lastName = useSelector((state: RootState) => state.userData.lastName);
  const birthday = useSelector((state: RootState) => state.userData.birthday);
  const email = useSelector((state: RootState) => state.userData.email);

  const [isPending, startTransition] = useTransition();
  const [isSaving, setIsSaving] = useState(false);

  const dispatch = useDispatch();

  // Unified save function to handle API calls
  const handleSaveBirthday = async (value: string) => {
    setIsSaving(true);
    try {
      const res = await updateUserBirthday(userId, value);
 
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangeDate = async (e: ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    dispatch(updateUserBirthdayStore(newDate));
    await handleSaveBirthday(newDate);
  };

  const updateFirstName = async (inputValue: string) => {

    try{
      await updateUserFirstName(userId, inputValue);
      dispatch(updateUserFirstNameStore(inputValue));
    }catch(e: any){
      console.log(e);
    }

    setIsSaving(false);
  };

  const updateEmail = async (inputValue: string) => {
    
    try{
      await updateUserEmail(userId, inputValue);
      
      
    }catch(e: any){
      console.log(e);
    }
    
    setIsSaving(false);
  }

  return (
    <div
      style={{ width: 500, height: 500 }}
      className="p-4 bg-white flex flex-col items-center justify-start rounded-2xl border border-slate-300 border-2"
    >
      {isPending ? (
        <ProfileSkeleton />
      ) : (
        <div className="w-full flex flex-col items-center justify-center">
          <div className="flex flex-col items-left w-full h-8">
            {isSaving && (
              <div className="flex" style={{width: 50}}>
                <Image src={loading} alt="" width={20} height={20}/> 
                <span className="text-xs flex items-center pl-2">Saving</span>
              </div>
            )}
          </div>

          <UserProfile width={120} height={120} />
          <div className="mt-2 flex justify-center">
            <DebouncedInput
              value={firstName}
              fontSize={30}
              placeholder={"Name"}
              delay={2000} // wait 2 seconds before executing the callback function
              onUserStopTyping={updateFirstName}
              onWait={() => {
                setIsSaving(true);
              }}
              width={200}
              height={30}
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
            width={300}
            height={10}
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
