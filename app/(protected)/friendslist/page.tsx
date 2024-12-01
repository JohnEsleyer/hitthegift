"use client";

import AuthMiddleware from "@/components/AuthMiddleware";
import LoadFriendsListData from "./(components)/LoadFriendsListData";
import FriendsListLeftSection from "./(sections)/FriendsListLeftSection";
import FriendsListRightSection from "./(sections)/FriendsListRightSection";
import HomeTemplate from "@/components/HomeTemplate";
import { RootState } from "@/lib/store";
import { usePathname } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import authMiddleware from "@/app/actions/pageActions/authMiddleware";

export default function FriendsListPage() {
  const pathname = usePathname();
  const isVerified = useSelector((state: RootState) => state.userData.verified);
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.userData.id);
  
  console.log('FriendsListPage rendered');

  useEffect(() => {
    authMiddleware(pathname, isVerified, dispatch, userId);
    
  }, [pathname, isVerified, userId]);

  return (
    <LoadFriendsListData>
    <HomeTemplate
      leftSide={<FriendsListLeftSection/>}
      rightSide={<FriendsListRightSection/>}
      
    />
    </LoadFriendsListData>
  );
}
