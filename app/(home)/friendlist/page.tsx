"use client";

import FriendsListLeftSection from "./(sections)/FriendsListLeftSection";
import FriendsListRightSection from "./(sections)/FriendsListRightSection";

export default function FriendListPage() {
  return (
    <div className="w-screen h-screen flex">
      <div className="w-72">
        <FriendsListLeftSection />
      </div>
      <div className="flex-1 ">
        <FriendsListRightSection />
      </div>
    </div>
  );
}
