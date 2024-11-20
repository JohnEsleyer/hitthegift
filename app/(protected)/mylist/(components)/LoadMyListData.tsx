'use client'

import { ReactNode, useEffect, useState, useTransition } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { EventData, ServerResponseForEvents } from "@/lib/types/event";
import { ProductType } from "@/lib/types/products";
import { Friend } from "@/lib/types/friend";
import { FriendRequestServerResponse } from "@/lib/types/friendrequest";
import { UserConversation } from "@/lib/types/conversation";
import { updateHighlightedDates, updateMyListEvents, updateMyListProducts } from "@/lib/features/mylist";
import { updateConversations } from "@/lib/features/chat";
import { updateFriendRequests, updateFriends } from "@/lib/features/friendsSidebar";
import RenderClientOnly from "@/components/utilityComponents/RenderClientOnly";
import giftloading from '/public/giftloading.svg';
import Image from 'next/image';
import { getMyListData } from "@/app/actions/pageActions/getMyListData";

interface MyListData {
    events: ServerResponseForEvents[];
    products: ProductType[];
    conversations: UserConversation[];
    friends: Friend[];
    friendRequests: FriendRequestServerResponse[];
}

interface LoadMyListDataProps{
    children: ReactNode;
}

export default function LoadMyListData({children}: LoadMyListDataProps){
    const userId = useSelector((state: RootState) => state.userData.id);
    const [isPending, startTransition] = useTransition();
    const dispatch = useDispatch();
 
    useEffect(() => {
       startTransition(async () => {
        try{
            const res = await getMyListData(userId) as MyListData;
            if (res){
                dispatch(updateMyListEvents(res.events));
                dispatch(updateConversations(res.conversations));
                dispatch(updateFriends(res.friends))
                dispatch(updateFriendRequests(res.friendRequests));
                dispatch(updateMyListProducts(res.products)); 

                const dates: Date[] =  res.events.map((event) => new Date(event.date));
                dispatch(updateHighlightedDates(dates))
            }
        }catch(e){
            console.error(e);
        }
       });
    }, []);

    return (
        <RenderClientOnly loading={<div></div>}>
        <div>
            {!isPending ? (
                <>
                   {children} 
                </>
            ) : (
                <div className="bg-white w-screen h-screen flex justify-center items-center">
                    <Image src={giftloading} width={50} height={50} alt="loading" />
                </div>
            )}
        </div>
        </RenderClientOnly>
    )
}