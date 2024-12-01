'use client'

import { ReactNode, useEffect, useState, useTransition } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { ProductType } from "@/lib/types/products";

import { updateHighlightedDates, updateMyListProducts } from "@/lib/features/mylist";
import { updateFriendRequests } from "@/lib/features/friendsSidebar";
import RenderClientOnly from "@/components/utilityComponents/RenderClientOnly";
import giftloading from '/public/giftloading.svg';
import Image from 'next/image';
import { getFriendsListData } from "@/app/actions/pageActions/getFriendsListData";
import { updateFriendsListEvents, updateFriendsWithProducts, updateHighlightedDatesFriendsList } from "@/lib/features/friendslist";

interface LoadFriendsListDataProps{
    children: ReactNode;
}

export default function LoadFriendsListData({children}: LoadFriendsListDataProps){
    const userId = useSelector((state: RootState) => state.userData.id);
    const [isPending, startTransition] = useTransition();
    const dispatch = useDispatch();
 
    useEffect(() => {
       startTransition(async () => {
        try{
            const res = await getFriendsListData(userId);
            
            if (res){
                console.log(res.events);
                dispatch(updateFriendsListEvents(res.events));
                console.log(res.friendsWithProducts);
                dispatch(updateFriendsWithProducts(res.friendsWithProducts));
                
                const dates: Date[] =  res.events.map((event: { date: string | number | Date; }) => new Date(event.date));
                console.log(dates);
                dispatch(updateHighlightedDatesFriendsList(dates))
            }else {
                console.error("Failed to fetch /friendslist data"); 
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