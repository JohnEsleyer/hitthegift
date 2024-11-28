"use client";

import { useEffect} from "react";
import { useDispatch } from "react-redux";
import AuthMiddleware from "@/components/AuthMiddleware";
import InsideFriendLeftSection from "./(sections)/InsideFriendLeftSection";
import InsideFriendRightSection from "./(sections)/InsideFriendRightSection";
import { updateIsOpenChatbox } from "@/lib/features/insideFriend";
import HomeTemplate from "@/components/HomeTemplate";
import LoadInsideFriendData from "./(components)/LoadInsideFriendData";

export default function InsideFriendPage() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(updateIsOpenChatbox(false));

  },[]);

  return (
    <AuthMiddleware>
    <LoadInsideFriendData>
    <HomeTemplate
      leftSide={<InsideFriendLeftSection/>}
      rightSide={<InsideFriendRightSection/>}
      showChatButton={true}
      allowChat={true}
    />
    </LoadInsideFriendData>
    </AuthMiddleware>
  );
}
