'use client'

import { RootState } from "@/lib/store"
import { useSelector } from "react-redux"

export default function TestHobbyInfo(){
    const hobbyInfo = useSelector((state: RootState) => state.userData.hobbyInfo);

    return (
        <div>
            {/* <button className="border">
            Display hobbyInfo
            </button> */}
            <p>{hobbyInfo}</p>
        </div>
    )
}