"use client";

import FriendsListLeftSection from "./(sections)/FriendsListLeftSection";
import FriendsListRightSection from "./(sections)/FriendsListRightSection";

import HomeTemplate from "@/components/HomeTemplate";

export default function FriendsListPage() {
  return (
    <HomeTemplate
      leftSide={<FriendsListLeftSection/>}
      rightSide={<FriendsListRightSection/>}
      
    />
  );
}
