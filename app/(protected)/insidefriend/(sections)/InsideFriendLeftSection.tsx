"use client";

import React, { useState } from "react";

import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";
import { HomeLeftTemplate } from "@/components/HomeLeftTemplate";
import UserProfileImage from "@/components/UserProfileImage";

// Selected friend page
export default function InsideFriendLeftSection() {
  const friendId = useSelector(
    (state: RootState) => state.insideFriend.friendId
  );
  const friends = useSelector((state: RootState) => state.insideFriend.friends);
  const friendData = useSelector(
    (state: RootState) => state.insideFriend.friendData
  );

  return (
    <HomeLeftTemplate highlight={"friendslist"}>
      <div className=" flex flex-col gap-4 bg-white rounded-2xll m-2 ">
        <div>
          {/**Friend's profile */}
          <div className="flex pt-2 ">
            <div className="flex items-center">
              <UserProfileImage
                userId={friendId}
                userName={friendData?.firstName || ""}
                width={45}
                height={45}
                alt="Friend Profile Picture"
              />
            </div>
            <div className="">
              <p>
                {friendData?.firstName} {friendData?.lastName}
              </p>
              <p className="text-xs text-gray-400">{friendData?.email}</p>
            </div>
          </div>
          <span className="text-xl pl-2">Interests and hobbies</span>
          <div
            style={{ height: 217}}
            className="m-2 shadow-md border border-b-4 border-[#c7c7c7] overflow-auto rounded-2xl p-2"
          >
            <p style={{ fontSize: 13 }} className="break-words">
              {friendData?.hobbyInfo}
            </p>
          </div>
          <div style={{ height: 100 }}></div>
          <span>People with whom this list has been shared</span>
          <div className="flex">
            {friends.map((friend) => (
              <UserProfileImage
                key={friend.id}
                userId={friend.id}
                userName={friend.firstName}
                alt=""
                width={30}
                height={30}
              />
            ))}
          </div>
        </div>
      </div>
    </HomeLeftTemplate>
  );
}
