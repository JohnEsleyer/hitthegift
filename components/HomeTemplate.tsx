"use client";

import RenderClientOnly from "@/components/utilityComponents/RenderClientOnly";
import { updateCurrentPopup } from "@/lib/features/popups";
import Avvvatars from "avvvatars-react";
import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Image from "next/image";
import Loading from "/public/loading.svg";
import AuthMiddleware from "@/components/AuthMiddleware";
import { RootState } from "@/lib/store";
import { updateConversationId, updateIsOpenChatbox } from "@/lib/features/insideFriend";
import Chatbox from "@/app/(home)/insidefriend/_components/Chatbox";
import { MessageSquareText } from "lucide-react";
import { Popups } from "@/app/(home)/mylist/(components)/Popups";
import findOrCreateConversation from "@/app/actions/chat/findOrCreateConversation";
import { Conversation } from "@/lib/types/conversation";
import { WithId } from "mongodb";

interface HomeTemplateProps {
  leftSide: ReactNode;
  rightSide: ReactNode;
  allowChat?: boolean;
}

export default function HomeTemplate({
  leftSide,
  rightSide,
  allowChat,
}: HomeTemplateProps) {
  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const isOpenChatbox = useSelector((state: RootState) => state.insideFriend.isOpenChatbox);
  const userId = useSelector((state: RootState) => state.userData.id);
  const friendId = useSelector((state: RootState) => state.insideFriend.friendId);
  const userFirstname = useSelector((state: RootState) => state.userData.firstName);
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
          <Popups>
            <div className="flex w-full h-full">
              <div style={{ width: 300 }}>{leftSide}</div>
              <div className="flex-1 ">{rightSide}</div>
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
                  <Avvvatars value={userFirstname} />
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
                        console.log(res.status);
                        dispatch(updateConversationId(res.data?.id as string));
                    }catch(e){
                        console.log(e);
                    }
                }
                  dispatch(updateIsOpenChatbox(true));
                  startConversation();
                }} className="bg-slate-100 shadow-md  rounded-full p-4">
                  <MessageSquareText color={"#4298f5"} />
                </button>}
              </div>}
            </div>
          </Popups>
        </RenderClientOnly>
      </AuthMiddleware>
    </div>
  );
}
