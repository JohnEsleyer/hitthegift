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

export default function FriendListPage() {
  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const isOpenChatbox = useSelector((state: RootState) => state.insideFriend.isOpenChatbox);
  
  const dispatch = useDispatch();
  const router = useRouter();

  return (
    <div className="w-screen h-screen flex">
      <AuthMiddleware>
        <RenderClientOnly
          loading={
            <div className="flex w-full justify-center items-center">
              <Image src={Loading} alt="" className="w-8 h-8" />
            </div>
          }
        >
          <OverlayPage>
            <div className="flex w-full h-full relative">
              <div style={{ width: 300, marginTop: 50 }}>
                <InsideFriendLeftSection />
              </div>
              <div className="flex-1 ">
                <InsideFriendRightSection />
              </div>
              {/**Navigation bar */}
              <div
                style={{ zIndex: 90 }}
                className="absolute p-2 pr-8 w-screen flex justify-between "
              >
                {/**My list and Friends list button */}
                <div
                  style={{ width: 291 }}
                  className={`border-b border-gray-400 flex justify-center mt-4 pt-2 gap-8`}
                >
                  <a href={"/mylist"}>My List</a>
                  <a
                    className="text-blue-500 border-b border-blue-400"
                    href={"/friendslist"}
                  >
                    Friends List
                  </a>
                </div>
                {/**Profile */}
                <button
                  className="relative"
                  onClick={() => {
                    setShowProfileOptions((prev) => !prev);
                  }}
                >
                  <Avvvatars value={`profile`} />
                </button>
                {showProfileOptions && (
                  <ul
                    style={{ zIndex: 100, right: 20, top: 38 }}
                    className="flex flex-col gap-2 absolute bg-white shadow-md rounded-2xl "
                  >
                    <button
                      className="hover:bg-gray-100 p-4 rounded-2xl"
                      onClick={() => {
                        setShowProfileOptions(false);
                        dispatch(updateCurrentOverlay("profile"));
                      }}
                    >
                      My Profile
                    </button>
                    <button
                      className="hover:bg-gray-100 p-4 rounded-2xl"
                      onClick={() => {
                        document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                        router.push("/login");
                      }}
                    >
                      Log out
                    </button>
                  </ul>
                )}
              </div>

              {/** Chat box */}
              <div
                style={{ zIndex: 99, bottom: 20, right: 20 }}
                className="absolute"
              >
                {isOpenChatbox ? <Chatbox/> : <button onClick={() => {
                  dispatch(updateIsOpenChatbox(true));
                }} className="bg-slate-100 shadow-md  rounded-full p-4">
                  <MessageSquareText color={"#4298f5"} />
                </button>}
              </div>
            </div>
          </OverlayPage>
        </RenderClientOnly>
      </AuthMiddleware>
    </div>
  );
}
