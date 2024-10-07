'use client'

import RenderClientOnly from "@/components/utilityComponents/RenderClientOnly";
import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";




export default function TestUserData(){
    const userId = useSelector((state: RootState) => state.userData.id);
    const firstName =  useSelector((state: RootState) => state.userData.firstName);
    const lastName =  useSelector((state: RootState) => state.userData.lastName);
    const username =  useSelector((state: RootState) => state.userData.username);
    const verified =  useSelector((state: RootState) => state.userData.verified);
    const email =  useSelector((state: RootState) => state.userData.email);
    const hobbyInfo =  useSelector((state: RootState) => state.userData.hobbyInfo);
    const showInterest =  useSelector((state: RootState) => state.userData.showInterest);

    return (
        <RenderClientOnly loading={(<div>Loading...</div>)}>
        <div>
            <p>userId: {userId}</p>
            <p>firstName: {firstName}</p>
            <p>lastName: {lastName}</p>
            <p>username: {username}</p>
            <p>verified: {verified ? 'true' : 'false'}</p>
            <p>email: {email}</p>
            <p>hobbyInfo: {hobbyInfo}</p>
            <p>showInterest: {showInterest ? 'true' : 'false'}</p>

        </div>
        </RenderClientOnly>
    )
}