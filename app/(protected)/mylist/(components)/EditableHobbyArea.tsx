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
    const [hobbiesInfo, setHobbiesInfo] = useState('');
    const [debouncedValue, setDebouncedValue] = useState(hobbiesInfo);
    const userId = useSelector((state: RootState) => state.userData.id);
    const [isTextareaPending, startTextareaTransition] = useTransition();
    const [isTyping, setIsTyping] = useState(false);

    const dispatch = useDispatch();

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = event.target.value;
        console.log('Value to dispatch:' + value);
        dispatch(updateHobbyInfo(value));
        setHobbiesInfo(value);
    };


    useEffect(() => {
      if (onPending){
        onPending(isTextareaPending);
      }
    }, [isTextareaPending]);


    // debounce mechanism
    useEffect(() => {
        setIsTyping(true);
        const handler = setTimeout(() => {
          setDebouncedValue(hobbiesInfo); // Set the debounced value after user stops typing
          setIsTyping(false);
        }, 1000); // Delay duration (e.g., 500ms)
    
        return () => {
          clearTimeout(handler); // Clear timeout if user types before delay ends
        };
      }, [hobbiesInfo]);

      useEffect(() => {
        if (debouncedValue) {
          const updateHobbyInfoServer = async () => {
            try {
              // Send data to the server here
              console.log('Sending to server:', debouncedValue);
              await updateUserHobbies(userId, hobbiesInfo);
            } catch (error) {
              console.error('Error updating hobby info:', error);
            }
          };
    
          updateHobbyInfoServer();
        }
      }, [debouncedValue]); // Trigger this effect only when debouncedValue changes
    

      useEffect(() => {
        startTextareaTransition(async () => {
            const hobbyData = await getUserHobbies(userId);
            if (hobbyData.status == 200){
                setHobbiesInfo(hobbyData.hobbiesInfo as string);
                console.log(hobbyData.message);
            }
        })
  
    
      }, []);
    
    return (
        <div className="flex flex-col p-2  flex items-center">
        <span style={{marginBottom: 17}} className="text-xl">My hobbies and interest</span>
        {isTextareaPending ? <TextareaSkeleton/> : <Textarea
          key={"hobbiesInfo"}
          style={{height: 220, width: 280}}
          className="border border-2xl rounded-2xl"
          maxLength={500}
          value={hobbiesInfo}
          onChange={(e)=>{
            handleInputChange(e);
          }}
        />}
        <div 
          className=" w-full flex justify-between"
          >
            <div>
              {isTyping && <div className="flex"><Image src={loading} alt="" width={20} height={20}/> <p>Saving</p></div>}
            </div>
            <div className="text-gray-600">
          {(hobbiesInfo.length || 0) + "/500"}
            </div>
          </div>
      </div>
    )
}


