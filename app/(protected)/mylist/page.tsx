"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import LoadMyListData from "./(components)/LoadMyListData";
import MyListLeftSection from "./(sections)/MyListLeftSection";
import MyListRightSection from "./(sections)/MyListRightSection";
import HomeTemplate from "@/components/HomeTemplate";
import authMiddleware from "@/app/actions/pageActions/authMiddleware";
import { RootState } from "@/lib/store";
import { updateConversations } from "@/lib/features/chat";

export default function MyListPage() {
  const pathname = usePathname();
  const isVerified = useSelector((state: RootState) => state.userData.verified);
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.userData.id);

  console.log("MyListPage rendered");
  
  function reset() {
    dispatch(dispatch(updateConversations([])));
  }

  useEffect(() => {
    reset(); // Reset in the persisted redux store
    authMiddleware(pathname, isVerified, dispatch, userId); 
  }, [pathname, isVerified, userId]); // Include dependencies

  return (
      <LoadMyListData>
      <HomeTemplate
        showFriends={true}
        leftSide={<MyListLeftSection/>}
        rightSide={<MyListRightSection/>}
        allowChat={true}
        allowInbox={true}
        showChatButton={true} 
      />
      </LoadMyListData>
  );
}