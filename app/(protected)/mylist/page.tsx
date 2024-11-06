"use client";

import MyListLeftSection from "./(sections)/MyListLeftSection";
import MyListRightSection from "./(sections)/MyListRightSection";
import HomeTemplate from "@/components/HomeTemplate";


export default function MyListPage() {

  return (
    <HomeTemplate
      showFriends={true}
      leftSide={<MyListLeftSection/>}
      rightSide={<MyListRightSection/>}
    />
  );
}
