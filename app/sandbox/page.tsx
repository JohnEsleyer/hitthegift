'use client'

import RenderClientOnly from "@/components/utilityComponents/RenderClientOnly";
import { deleteAllFriendRequestsSender } from "@/lib/features/friendsSidebar";
import { RootState } from "@/lib/store"
import { useDispatch, useSelector } from "react-redux";

export default function Sandbox(){
    const userId = useSelector((state: RootState) => state.userData.id);
    const friendRequestSender = useSelector((state: RootState) => state.friendsSidebar.friendRequestsSender);
    const friendRequestReceiver = useSelector((state: RootState) => state.friendsSidebar.friendRequestsReceiver);
    const dispatch = useDispatch();

    return <RenderClientOnly loading={<div></div>}>
        <div>v1.0.4</div>
        <div>Sender request: {friendRequestSender?.length}</div>
        <div>Receiver request: {friendRequestReceiver?.length}</div>
        <ul>
            {friendRequestSender && friendRequestSender.map((item, index) => (
                <li key={index}>{item.id}</li>
            ))}
        </ul>
        <button onClick={() => {
            dispatch(deleteAllFriendRequestsSender());
        }}>Clear all sender requests</button>
        
    </RenderClientOnly>
}