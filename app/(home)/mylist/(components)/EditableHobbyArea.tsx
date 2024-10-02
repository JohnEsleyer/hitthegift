'use client'

import getUserHobbies from "@/app/actions/user/getUserHobbies";
import updateUserHobbies from "@/app/actions/user/updateUserHobbies";
import { Textarea } from "@/components/ui/textarea";
import { updateHobbyInfo } from "@/lib/features/userData";
import { RootState } from "@/lib/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";


export default function EditableHobbyArea(){
    const [hobbiesInfo, setHobbiesInfo] = useState('');
    const [debouncedValue, setDebouncedValue] = useState(hobbiesInfo);
    const userId = useSelector((state: RootState) => state.userData.id);

    const dispatch = useDispatch();

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = event.target.value;
        console.log('Value to dispatch:' + value);
        dispatch(updateHobbyInfo(value));
        setHobbiesInfo(value);
    };

    // debounce mechanism
    useEffect(() => {
        const handler = setTimeout(() => {
          setDebouncedValue(hobbiesInfo); // Set the debounced value after user stops typing
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
        const fetchHobbyData = async () => {
            const hobbyData = await getUserHobbies(userId);
            if (hobbyData.status == 200){
                setHobbiesInfo(hobbyData.hobbiesInfo as string);
                console.log(hobbyData.message);
            }
        };
    
        fetchHobbyData();
    
      }, []);
    



    return (
        <div className="flex flex-col p-2">
        <span className="text-xl mb-6">My hobbies and interest</span>
        <Textarea
          key={"hobbiesInfo"}
          style={{height: 200}}
          className="border border-2xl rounded-2xl "
     
          value={hobbiesInfo}
          onChange={(e)=>{
            handleInputChange(e);
          }}
        />
        {/* <span 
          className="text-gray-600 flex justify-end"
          >
          {hobbiesInfo.length + "/500"}
          </span> */}
      </div>
    )
}


