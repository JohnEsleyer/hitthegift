"use client";

import AuthMiddleware from "@/components/AuthMiddleware";
import LoadFriendsListData from "./(components)/LoadFriendsListData";
import FriendsListLeftSection from "./(sections)/FriendsListLeftSection";
import FriendsListRightSection from "./(sections)/FriendsListRightSection";

import HomeTemplate from "@/components/HomeTemplate";

export default function FriendsListPage() {
  return (
    <AuthMiddleware>
    <LoadFriendsListData>
    <HomeTemplate
      leftSide={<FriendsListLeftSection/>}
      rightSide={<FriendsListRightSection/>}
      
    />
    </LoadFriendsListData>
    </AuthMiddleware>
  );
}
