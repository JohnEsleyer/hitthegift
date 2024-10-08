"use client";

import RenderClientOnly from "@/components/utilityComponents/RenderClientOnly";
import { updateCurrentOverlay } from "@/lib/features/overlays";
import Avvvatars from "avvvatars-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FriendsListRightSection from "../friendslist/(sections)/FriendsListRightSection";
import { OverlayPage } from "../mylist/(components)/OverlayPage";
import FriendsListLeftSection from "./(sections)/InsideFriendLeftSection";
import Image from "next/image";
import Loading from "/public/loading.svg";

import AuthMiddleware from "@/components/AuthMiddleware";
import InsideFriendLeftSection from "./(sections)/InsideFriendLeftSection";
import InsideFriendRightSection from "./(sections)/InsideFriendRightSection";
import { MessageCircle, MessageSquareText } from "lucide-react";
import ChatIcon from "/public/chat.png";
import Chatbox from "./_components/Chatbox";
import { RootState } from "@/lib/store";
import { updateIsOpenChatbox } from "@/lib/features/insideFriend";
import HomeTemplate from "@/components/HomeTemplate";

export default function FriendListPage() {
  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const isOpenChatbox = useSelector((state: RootState) => state.insideFriend.isOpenChatbox);
  
  const dispatch = useDispatch();
  const router = useRouter();

  return (
    <HomeTemplate
      leftSide={<InsideFriendLeftSection/>}
      rightSide={<InsideFriendRightSection/>}
      
      allowChat={true}
    />
  );
}
