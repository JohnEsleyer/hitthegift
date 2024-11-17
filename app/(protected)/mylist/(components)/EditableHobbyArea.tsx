'use client'

import getUserHobbies from "@/app/actions/user/getUserHobbies";
import updateUserHobbies from "@/app/actions/user/updateUserHobbies";
import TextareaSkeleton from "@/components/skeletons/TextareaSkeleton";
import { Textarea } from "@/components/ui/textarea";
import { updateHobbyInfo } from "@/lib/features/userData";
import { RootState } from "@/lib/store";
import { useEffect, useState, useTransition } from "react";
import { useDispatch, useSelector } from "react-redux";
import loading from '/public/loading.svg';
import Image from 'next/image';

interface EditableHobbyAreaProps{
  onPending?: (isPending: boolean) => void; // Callback for when user is still typing.
}

export default function EditableHobbyArea({onPending}: EditableHobbyAreaProps){
    // const [hobbyInfo, sethobbyInfo] = useState('');
    const hobbyInfo = useSelector((state: RootState) => state.userData.hobbyInfo);
    const [debouncedValue, setDebouncedValue] = useState(hobbyInfo);
    const userId = useSelector((state: RootState) => state.userData.id);
    const [isTyping, setIsTyping] = useState(false);

    const dispatch = useDispatch();

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = event.target.value;
        dispatch(updateHobbyInfo(value));
        dispatch(updateHobbyInfo(value))
    };


    // debounce mechanism
    useEffect(() => {
        setIsTyping(true);
        const handler = setTimeout(() => {
          setDebouncedValue(hobbyInfo); // Set the debounced value after user stops typing
          setIsTyping(false);
        }, 1000); // Delay duration (e.g., 500ms)
    
        return () => {
          clearTimeout(handler); // Clear timeout if user types before delay ends
        };
      }, [hobbyInfo]);

      useEffect(() => {
        if (debouncedValue) {
          const updateHobbyInfoServer = async () => {
            try {
              // Send data to the server here
              await updateUserHobbies(userId, hobbyInfo);
            } catch (error) {
              console.error('Error updating hobby info:', error);
            }
          };
          updateHobbyInfoServer();
        }
      }, [debouncedValue]); // Trigger this effect only when debouncedValue changes
    
    
    return (
        <div className="flex flex-col p-2 m-2 flex items-center rounded-2xl shadow-xl bg-white ">
        <p className="w-64 font-bold">My hobbies and interests</p>
      <Textarea
          key={"hobbyInfo"}
          style={{height: 150, width: 280}}
          className="border border-gray-300 rounded-2xl"
          maxLength={500}
          value={hobbyInfo}
          onChange={(e)=>{
            handleInputChange(e);
          }}
        />

        <div 
        style={{height: 16}}
          className=" w-full flex justify-between"
          >
            <div>
              {isTyping && <div className="flex"><Image src={loading} alt="" width={20} height={20}/> <p className="text-xs">Saving</p></div>}
            </div>
            <div className="text-gray-600 text-xs">
          {(hobbyInfo.length || 0) + "/500"}
            </div>
          </div>
      </div>
    )
}
