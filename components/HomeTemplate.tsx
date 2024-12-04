"use client";

import RenderClientOnly from "@/components/utilityComponents/RenderClientOnly";
import { updateCurrentPopup } from "@/lib/features/popups";
import { ReactNode, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Image from "next/image";
import { RootState } from "@/lib/store";
import {
  updateConversationId,
  updateIsOpenChatbox,
} from "@/lib/features/insideFriend";
import Chatbox from "@/components/Chatbox";
import { Mail, MessageSquareText } from "lucide-react";
import { Popups } from "@/components/Popups";
import findOrCreateConversation from "@/app/actions/chat/findOrCreateConversation";
import Friends from "/public/friends.png";
import UserProfileImage from "./UserProfileImage";
import { updateShowLoading } from "@/lib/features/chat";
import { useWindowSize } from "@/utils/hooks/useWindowSize";
import {
  updateFriendRequests,
  updateIsSidebarOpen,
} from "@/lib/features/friendsSidebar";
import { navigateTo } from "@/app/actions/navigateTo";
import { seenFriendRequests } from "@/app/actions/user/seenFriendRequests";
import { countUnseenFriendRequests } from "@/utils/countUnseenFriendRequests";
import loading from '/public/loading.svg';

interface HomeTemplateProps {
  leftSide: ReactNode;
  rightSide: ReactNode;
  allowChat?: boolean; // Allow chatbox popups
  showChatButton?: boolean; // Show button for opening the chatbox
  showFriends?: boolean;
}

export default function HomeTemplate({
  leftSide,
  rightSide,
  allowChat,
  showFriends,
  showChatButton,
}: HomeTemplateProps) {
  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const isOpenChatbox = useSelector(
    (state: RootState) => state.insideFriend.isOpenChatbox
  );
  const userId = useSelector((state: RootState) => state.userData.id);
  const userName = useSelector((state: RootState) => state.userData.firstName);
  const friendId = useSelector(
    (state: RootState) => state.insideFriend.friendId
  );
  const friendRequests = useSelector(
    (state: RootState) => state.friendsSidebar.friendRequests
  );
  const [notificationCounter, setNotificationCounter] = useState(0);
  const dispatch = useDispatch();
  const { width, height } = useWindowSize();
  const [isLogout, setIsLogout] = useState(false);


  async function seenAllFriendRequests() {
     // Update local friend requests
    dispatch(updateFriendRequests(friendRequests.map((req) => {
      if (req.sender.id == userId){
        return {
          ...req,
          isSeenSender: true,
        }
      }
      return {
        ...req,
        isSeenReceiver: true, 
      }
    })));
    try {
      const res = await seenFriendRequests(friendRequests, userId);
      // Handle the response from the server
      if (res.status === 200) {
  
        // Successfully updated, potentially update local state or show a success message
        console.log("Friend requests marked as seen");
      } else {
        // Handle errors or partial updates
        console.error("Error updating friend requests:", res.message);
      }
    } catch (e) {
      console.error("Error marking friend requests as seen:", e);
      // Example: Show a generic error message
      // alert("An error occurred.");
    }
  }

  useEffect(() => {
    if (friendRequests){
      setNotificationCounter(countUnseenFriendRequests(friendRequests, userId));
    }
    
  },[friendRequests]);

  return (
    <div className="bg-white w-screen h-screen flex overflow-auto overflow-x-hidden">
      <RenderClientOnly loading={<div></div>}>
        <Popups>
          <div className="flex h-full ">
            {/**Layout */}
            <div className="flex">
              <div style={{ width: 315 }}>{leftSide}</div>
              <div className="flex-1">{rightSide}</div>
            </div>

            {/**Profile */}
            {width > 800 && (
              <div
                style={{ zIndex: 90, right: 30 }}
                className="absolute p-2 pr-8  flex justify-between "
              >
                {/**Profile */}
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
                      className="flex justify-center hover:bg-gray-100 p-4 rounded-2xl text-xs"
                      onClick={() => {
                        setIsLogout(true);
                        document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                        navigateTo("/login");
                      }}
                    >
                      {isLogout ? <Image src={loading} alt="loading" width={20} height={20}/> : <span>Log out</span>}
                    </button>
                  </ul>
                )}
              </div>
            )}
            {/** Chat box */}
            {allowChat && (
              <div
                style={{ zIndex: 99, bottom: 20, right: 20 }}
                className="absolute"
              >
                {isOpenChatbox ? (
                  <Chatbox />
                ) : (
                  <button
                    onClick={() => {
                      async function startConversation() {
                        try {
                          const res = await findOrCreateConversation(
                            userId,
                            friendId
                          );
                          console.log(`friendId: ${friendId}`);
                          console.log(
                            `conversationId: ${res.data?.id as string}`
                          );
                          console.log(res.status);
                          dispatch(
                            updateConversationId(res.data?.id as string)
                          );
                          dispatch(updateShowLoading(false));
                        } catch (e) {
                          console.log(`Failed to fetch conversation: ${e}`);
                        }
                      }
                      dispatch(updateShowLoading(true));
                      dispatch(updateIsOpenChatbox(true));
                      startConversation();
                    }}
                    className={`bg-blue-500 shadow-md rounded-full p-4 ${
                      !showChatButton && "invisible"
                    }`}
                  >
                    <MessageSquareText color={"#ffffff"} />
                  </button>
                )}
              </div>
            )}
            {/**Friends sidebar*/}
            {showFriends && (
              <div
                style={{ zIndex: 98, right: 0, height: height }}
                className="absolute text-white flex justify-end items-center"
              >
                <button
                  className="bg-blue-500 pt-2 pb-2 pr-2 border border-blue-500 rounded-xl rounded-r-lg"
                  onClick={async () => {
                    dispatch(
                      updateFriendRequests(
                        friendRequests?.map((req) => ({ ...req, isSeen: true }))
                      )
                    );
                    dispatch(updateCurrentPopup("friends"));
                    dispatch(updateIsSidebarOpen(true));
                    seenAllFriendRequests();
                  }}
                >
                  <Image alt="" width={25} src={Friends} />
                </button>
                {/**Red notification */}
                {notificationCounter > 0 && (
                  <div
                    style={{
                      zIndex: 99,
                      width: 30,
                      height: 30,
                      marginBottom: 120,
                      marginRight: 2,
                    }}
                    className="absolute bg-red-500  flex justify-center items-center rounded-full"
                  >
                    {notificationCounter}
                  </div>
                )}
              </div>
            )}
          </div>
        </Popups>
      </RenderClientOnly>
    </div>
  );
}
