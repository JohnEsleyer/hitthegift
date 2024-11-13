"use client";

import RenderClientOnly from "@/components/utilityComponents/RenderClientOnly";
import { updateCurrentPopup } from "@/lib/features/popups";
import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Image from "next/image";
import Loading from "/public/loading.svg";
import AuthMiddleware from "@/components/AuthMiddleware";
import { RootState } from "@/lib/store";
import { updateConversationId, updateIsOpenChatbox } from "@/lib/features/insideFriend";
import Chatbox from "@/app/(protected)/insidefriend/_components/Chatbox";
import { MessageSquareText } from "lucide-react";
import { Popups } from "@/components/Popups";
import findOrCreateConversation from "@/app/actions/chat/findOrCreateConversation";
import Friends from '/public/friends.png';
import UserProfileImage from "./UserProfileImage";
import EmailVerifier from "./EmailVerifier";
import { updateShowLoading } from "@/lib/features/chat";

interface HomeTemplateProps {
  leftSide: ReactNode;
  rightSide: ReactNode;
  allowChat?: boolean;
  showFriends?: boolean;
}

export default function HomeTemplate({
  leftSide,
  rightSide,
  allowChat,
  showFriends,
}: HomeTemplateProps) {
  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const isOpenChatbox = useSelector((state: RootState) => state.insideFriend.isOpenChatbox);
  const userId = useSelector((state: RootState) => state.userData.id);
  const userName = useSelector((state: RootState) => state.userData.firstName);
  const friendId = useSelector((state: RootState) => state.insideFriend.friendId);
  const dispatch = useDispatch();
  const router = useRouter();

  return (
    <div className="bg-[#e4e7f7] w-screen h-screen flex overflow-auto overflow-x-hidden">
      <RenderClientOnly
          loading={
            <div className="flex w-full justify-center items-center">
              <Image src={Loading} alt="" className="w-8 h-8" />
            </div>
          }
        >
      <AuthMiddleware>
          <EmailVerifier>
          <Popups>
            <div className="flex h-full ">
              {/**Layout */}
              <div className="flex">
                <div style={{width: 320}} >
                  {leftSide}
                </div>
                <div className="flex-1">
                  {rightSide}
                </div>
              </div>

              {/**Profile*/}
              <div
                style={{ zIndex: 90, right: 30 }}
                className="absolute p-2 pr-8  flex justify-between "
              >
                <button
                  className="absolute"
                  onClick={() => {
                    setShowProfileOptions((prev) => !prev);
                  }}
                >
               <UserProfileImage
                userId={userId}
                userName={userName}
                width={30}
                height={30}
                alt={""}
               />
                </button>
                {showProfileOptions && (
                  <ul
                    style={{ zIndex: 100, right: 20, top: 38, width: 100 }}
                    className="flex flex-col gap-2 absolute bg-white shadow-md rounded-2xl "
                  >
                    <button
                      className="hover:bg-gray-100 p-4 rounded-2xl text-xs"
                      onClick={() => {
                        setShowProfileOptions(false);
                        dispatch(updateCurrentPopup("profile"));
                      }}
                    >
                      My Profile
                    </button>
                    <button
                      className="hover:bg-gray-100 p-4 rounded-2xl text-xs"
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
                {allowChat && <div
                style={{ zIndex: 99, bottom: 20, right: 20 }}
                className="absolute"
              >
                {isOpenChatbox ? <Chatbox/> : <button onClick={() => {
                  async function startConversation(){
                    try{
                        const res = await findOrCreateConversation(userId, friendId);
                        console.log(`friendId: ${friendId}`);
                        console.log(`conversationId: ${res.data?.id as string}`);
                        console.log(res.status);
                        dispatch(updateConversationId(res.data?.id as string));
                       dispatch(updateShowLoading(false));
                    }catch(e){
                        console.log(`Failed to fetch conversation: ${e}`);
                    }
                }
                dispatch(updateShowLoading(true));
                dispatch(updateIsOpenChatbox(true));
                  startConversation();
                }} className="bg-blue-500 shadow-md rounded-full p-4">
                  <MessageSquareText color={"#ffffff"} />
                </button>}
              </div>}
              {/**Friends sidebar*/}
              {showFriends && <div style={{zIndex: 99, right: 0, top:225 }} className="absolute text-white flex justify-end">
            <button
              className="bg-blue-500 p-2 border border-blue-500 rounded-2xl rounded-r-lg"
              onClick={() => {
                dispatch(updateCurrentPopup("friends"));
              }}
            >
              <Image alt="" width={30} src={Friends} />
            </button>
          </div>}
            </div>
          </Popups>
          </EmailVerifier>
      </AuthMiddleware>
      </RenderClientOnly>
    </div>
  );
}
