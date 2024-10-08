"use client";

import RenderClientOnly from "@/components/utilityComponents/RenderClientOnly";
import { updateCurrentOverlay } from "@/lib/features/overlays";
import Avvvatars from "avvvatars-react";
import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Image from "next/image";
import Loading from "/public/loading.svg";
import AuthMiddleware from "@/components/AuthMiddleware";
import { OverlayPage } from "@/app/(home)/mylist/(components)/OverlayPage";
import { RootState } from "@/lib/store";
import { updateIsOpenChatbox } from "@/lib/features/insideFriend";
import Chatbox from "@/app/(home)/insidefriend/_components/Chatbox";
import { MessageSquareText } from "lucide-react";

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
                  <Avvvatars value={`profile`} />
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
                        dispatch(updateCurrentOverlay("profile"));
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
                  dispatch(updateIsOpenChatbox(true));
                }} className="bg-slate-100 shadow-md  rounded-full p-4">
                  <MessageSquareText color={"#4298f5"} />
                </button>}
              </div>}
            </div>
          </OverlayPage>
        </RenderClientOnly>
      </AuthMiddleware>
    </div>
  );
}
