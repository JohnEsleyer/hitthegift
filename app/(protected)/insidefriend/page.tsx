"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import AuthMiddleware from "@/components/AuthMiddleware";
import InsideFriendLeftSection from "./(sections)/InsideFriendLeftSection";
import InsideFriendRightSection from "./(sections)/InsideFriendRightSection";

import { RootState } from "@/lib/store";
import { updateIsOpenChatbox } from "@/lib/features/insideFriend";
import HomeTemplate from "@/components/HomeTemplate";

export default function InsideFriendPage() {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(updateIsOpenChatbox(false));

  },[]);

  return (
    <AuthMiddleware>
    <HomeTemplate
      leftSide={<InsideFriendLeftSection/>}
      rightSide={<InsideFriendRightSection/>}
      
      allowChat={true}
    />
    </AuthMiddleware>
  );
}
