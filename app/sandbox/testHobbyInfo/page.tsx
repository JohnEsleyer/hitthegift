'use client'

import { updateHobbyInfo } from "@/lib/features/userData";
import { RootState } from "@/lib/store"
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"

export default function TestHobbyInfo(){
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const hobbyInfo = useSelector((state: RootState) => state.userData.hobbyInfo);

    const dispatch = useDispatch();

    return (
        <div>
            {/* <button className="border">
            Display hobbyInfo
            </button> */}
            <p className="font-bold text-xl">Hobby Info</p>
            {isClient && <p>{hobbyInfo}</p>}
            {isClient && <p>Length: {hobbyInfo.length}</p>}
            <button className="border p-2" onClick={()=> {
                dispatch(updateHobbyInfo('Hello from sandbox'));
            }}>
                Update State
            </button>
        </div>
    )
}