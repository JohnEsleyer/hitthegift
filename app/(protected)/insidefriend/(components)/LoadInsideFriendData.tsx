"use client";

import { ReactNode, useEffect, useState, useTransition } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import RenderClientOnly from "@/components/utilityComponents/RenderClientOnly";
import giftloading from "/public/giftloading.svg";
import Image from "next/image";
import {
  updateFriendsListEvents,
  updateFriendsWithProducts,
  updateHighlightedDatesFriendsList,
} from "@/lib/features/friendslist";
import getInsideFriendData from "@/app/actions/pageActions/getInsideFriendData";
import {
  updateFriendsForInsideFriend,
  updateProdctsForInsideFriend,
  updateFriendData,
} from "@/lib/features/insideFriend";

type FriendData = {
  hobbyInfo: string;
  firstName: string;
  lastName: string;
  verified: boolean;
  verificationToken: string;
  email: string;
  birthday: string;
};

interface LoadInsideFriendDataProps {
  children: ReactNode;
}

export default function LoadInsideFriendData({
  children,
}: LoadInsideFriendDataProps) {
  const friendId = useSelector(
    (state: RootState) => state.insideFriend.friendId
  );
  const [isPending, startTransition] = useTransition();
  const dispatch = useDispatch();

  useEffect(() => {
    startTransition(async () => {
      try {
        const response = await getInsideFriendData(friendId);

        if (response.status === 200) {
          dispatch(updateFriendsForInsideFriend(response.friends || []));
          dispatch(updateProdctsForInsideFriend(response.products || []));
          dispatch(updateFriendData(response.userInfo as FriendData));
        } else {
            console.error("Failed to fetch /insidefriend data:", response.message); 
        }
      } catch (e) {
        console.error(e);
      }
    });
  }, []);

  return (
    <RenderClientOnly loading={<div></div>}>
      <div>
        {!isPending ? (
          <>{children}</>
        ) : (
          <div className="bg-white w-screen h-screen flex justify-center items-center">
            <Image src={giftloading} width={50} height={50} alt="loading" />
          </div>
        )}
      </div>
    </RenderClientOnly>
  );
}
