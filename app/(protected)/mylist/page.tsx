"use client";

import AuthMiddleware from "@/components/AuthMiddleware";
import LoadMyListData from "./(components)/LoadMyListData";
import MyListLeftSection from "./(sections)/MyListLeftSection";
import MyListRightSection from "./(sections)/MyListRightSection";
import HomeTemplate from "@/components/HomeTemplate";

export default function MyListPage() {
  return (
    <AuthMiddleware>
    <LoadMyListData>
    <HomeTemplate
      showFriends={true}
      leftSide={<MyListLeftSection/>}
      rightSide={<MyListRightSection/>}
      allowChat={true}// Allow chat to pop up in this page
      showChatButton={false} // Don't show button for opening chat boxes
    />
    </LoadMyListData>
    </AuthMiddleware>
  );
}

