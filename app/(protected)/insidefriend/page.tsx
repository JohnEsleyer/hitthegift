"use client";

import { useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import AuthMiddleware from "@/components/AuthMiddleware";
import InsideFriendLeftSection from "./(sections)/InsideFriendLeftSection";
import InsideFriendRightSection from "./(sections)/InsideFriendRightSection";
import { updateIsOpenChatbox } from "@/lib/features/insideFriend";
import HomeTemplate from "@/components/HomeTemplate";
import LoadInsideFriendData from "./(components)/LoadInsideFriendData";
import authMiddleware from "@/app/actions/pageActions/authMiddleware";
import { RootState } from "@/lib/store";
import { usePathname } from "next/navigation";

export default function InsideFriendPage() {
  const pathname = usePathname();
  const isVerified = useSelector((state: RootState) => state.userData.verified);
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.userData.id);
  
  console.log('FriendsListPage rendered');

  useEffect(() => {
    authMiddleware(pathname, isVerified, dispatch, userId);
    
  }, [pathname, isVerified, userId]);
  return (
    <LoadInsideFriendData>
    <HomeTemplate
      leftSide={<InsideFriendLeftSection/>}
      rightSide={<InsideFriendRightSection/>}
      showChatButton={true}
      allowChat={true}
    />
    </LoadInsideFriendData>
  );
}
