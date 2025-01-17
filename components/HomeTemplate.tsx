"use client";

import RenderClientOnly from "@/components/utilityComponents/RenderClientOnly";
import { updateCurrentPopup } from "@/lib/features/popups";
import { ReactNode, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { RootState } from "@/lib/store";
import {
  updateConversationId,
  updateFriendFirstName,
  updateFriendId,
  updateIsOpenChatbox,
} from "@/lib/features/insideFriend";
import Chatbox from "@/components/Chatbox";
import { Inbox, MessageSquareText } from "lucide-react";
import { Popups } from "@/components/Popups";
import findOrCreateConversation from "@/app/actions/chat/findOrCreateConversation";
import { fetchUserConversations } from "@/app/actions/chat/fetchUserConversations"; // Import your server action here
import Friends from "/public/friends.png";
import UserProfileImage from "./UserProfileImage";
import { updateFriendRequests, updateIsSidebarOpen } from "@/lib/features/friendsSidebar";
import { navigateTo } from "@/app/actions/navigateTo";
import { seenFriendRequests } from "@/app/actions/user/seenFriendRequests";
import { countUnseenFriendRequests } from "@/utils/countUnseenFriendRequests";
import loading from "/public/loading.svg";
import { useWindowSize } from "@/utils/hooks/useWindowSize";
import whiteloading from '/public/whiteloading.svg';
import { updateConversations } from "@/lib/features/chat";

interface HomeTemplateProps {
  leftSide: ReactNode;
  rightSide: ReactNode;
  allowChat?: boolean; 
  showChatButton?: boolean; 
  showFriends?: boolean;
  allowInbox?: boolean;
}

export default function HomeTemplate({
  leftSide,
  rightSide,
  allowChat,
  showFriends,
  showChatButton,
  allowInbox,
}: HomeTemplateProps) {
  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const isOpenChatbox = useSelector((state: RootState) => state.insideFriend.isOpenChatbox);
  const userId = useSelector((state: RootState) => state.userData.id);
  const userName = useSelector((state: RootState) => state.userData.firstName);
  const friendId = useSelector((state: RootState) => state.insideFriend.friendId);
  const friendRequests = useSelector((state: RootState) => state.friendsSidebar.friendRequests);

  // Initially closed inbox and chatbox
  const [showInbox, setShowInbox] = useState(false); 
  const [sidebarNotificationCounter, setsidebarNotificationCounter] = useState(0);
  const [isLogout, setIsLogout] = useState(false);
  const { width, height } = useWindowSize();
  const dispatch = useDispatch();

  // const [inboxConversations, setInboxConversations] = useState<UserConversation[]>([]);
  const inboxConversations = useSelector((state: RootState) => state.chat.conversations);
  const [inboxLoading, setInboxLoading] = useState(false);
  const [chatButtonLoading, setChatButtonLoading] = useState(false);

  useEffect(() => {
    dispatch(updateFriendId('')); // Reset the friendId used by the chat box whenever the page is initiated.
  }, []);

  useEffect(() => {
    initialFetchInbox();
    dispatch(updateIsOpenChatbox(false));
    if (friendRequests) {
      setsidebarNotificationCounter(countUnseenFriendRequests(friendRequests, userId));
    }
  }, [friendRequests, userId]);

  async function seenAllFriendRequests() {
    console.log('seenAllFriendRequests executed');
    dispatch(
      updateFriendRequests(
        friendRequests.map((req) => {
          if (req.sender.id === userId) {
            return {
              ...req,
              isSeenSender: true,
            };
          }
          return {
            ...req,
            isSeenReceiver: true,
          };
        })
      )
    );

    try {
      const res = await seenFriendRequests(friendRequests, userId);
      if (res.status === 200) {
        console.log("Friend requests marked as seen");
      } else {
        console.error("Error updating friend requests:", res.message);
      }
    } catch (e) {
      console.error("Error marking friend requests as seen:", e);
    }
  }

  const startConversation = async () => {
    setChatButtonLoading(true);
    try {
      const res = await findOrCreateConversation(userId, friendId);
      if (res.status === 200 && res.data?.id) {
        dispatch(updateConversationId(res.data.id));
        dispatch(updateIsOpenChatbox(true)); // Open chatbox after conversationId is set
      } else {
        console.log("Failed to find/create conversation");
      }
    } catch (e) {
      console.log(`Failed to fetch conversation: ${e}`);
    }
    setChatButtonLoading(false);
  };

  const initialFetchInbox = async () => {
    console.log(`initialFetchInbox executed`);
    try{
      console.log(`userId: ${userId}`);
      const result = await fetchUserConversations(userId);
      if (result.status === 200 && result.data) {
        // setInboxConversations(result.data);
        dispatch(updateConversations(result.data));
      } else {
        console.error("Failed to fetch inbox conversations");
      }
    }catch(e){
      console.log(e);
    }
  }

  const handleToggleInbox = async () => {
    const newValue = !showInbox;
    setShowInbox(newValue);
    if (newValue) {
      // Fetch inbox data when opened
      setInboxLoading(true);
      try{
      const result = await fetchUserConversations(userId);
      if (result.status === 200 && result.data) {
        // setInboxConversations(result.data);
        dispatch(updateConversations(result.data));
      } else {
        console.error("Failed to fetch inbox conversations");
      }
      }catch(e){
        console.log(e);
      }
      setInboxLoading(false);
    }
  };

  return (
    <div className="bg-white w-screen h-screen flex overflow-auto overflow-x-hidden">
      <RenderClientOnly loading={<div></div>}>
        <Popups>
          <div className="flex h-full">
            {/** Layout */}
            <div className="flex">
              <div style={{ width: 315 }}>{leftSide}</div>
              <div className="flex-1">{rightSide}</div>
            </div>

            {/**Inbox Popup */}
            {showInbox && (
              <div
                className="flex flex-col absolute bg-white border-gray-300 border shadow-md rounded-lg p-4 flex flex-col gap-4"
                style={{
                  zIndex: 100,
                  top: 40,
                  right: 30,
                  width: 250,
                  height: 300,
                }}
              >
                <div className="flex h-4 justify-start text-xl">
                  <p>Messages</p>
                </div>
                <div className="flex-1 flex flex-col">
                  {inboxLoading ? (
                    <div className="flex items-center justify-center flex-1 text-gray-500">
                      Loading...
                    </div>
                  ) : inboxConversations.length > 0 ? (
                    inboxConversations.map((conversation) => (
                      <div key={conversation.conversationId}>
                        <button
                          className="flex items-center gap-4 p-2 hover:bg-gray-100 rounded-lg w-full text-left"
                          onClick={async () => {
                            setShowInbox(false);
                            // Set friend data and open chatbox
                            dispatch(updateConversationId(conversation.conversationId));
                            dispatch(updateFriendId(conversation.friend.id));
                            dispatch(updateFriendFirstName(conversation.friend.name));
                            dispatch(updateIsOpenChatbox(true));
                          }}
                        >
                          <UserProfileImage
                            userId={conversation.friend.id}
                            userName={conversation.friend.name}
                            width={30}
                            height={30}
                            alt={conversation.friend.name}
                          />
                          <div className="flex-1 text-sm font-medium">
                            {conversation.friend.name}
                          </div>
                          {conversation.unreadMessageCount > 0 && (
                            <span className="bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                              {conversation.unreadMessageCount}
                            </span>
                          )}
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="pb-4 text-gray-500 text-sm font-medium text-center flex-1 flex items-center justify-center">
                      You have no messages
                    </div>
                  )}
                </div>
              </div>
            )}

            {/**Profile and Inbox button Section */}
            {width > 800 && (
              <div
                style={{ zIndex: 90, right: 20 }}
                className="absolute p-2 pr-8 flex items-center justify-between"
              >
                {/**Inbox */}
                {allowInbox && (
                  <div className="relative" style={{ marginTop: 10, marginRight: 10 }}>
                    <button onClick={handleToggleInbox} className="relative">
                      <Inbox color="gray" />
                      {inboxConversations.reduce(
                        (total, convo) => total + convo.unreadMessageCount,
                        0
                      ) > 0 && showInbox === false && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                          {inboxConversations.reduce(
                            (total, convo) => total + convo.unreadMessageCount,
                            0
                          )}
                        </span>
                      )}
                    </button>
                  </div>
                )}

                {/**Profile */}
                <button
                  className="relative"
                  onClick={() => {
                    setShowProfileOptions((prev) => !prev);
                  }}
                >
                  <UserProfileImage
                    userId={userId}
                    userName={userName}
                    width={30}
                    height={30}
                    alt={"User Profile"}
                  />
                </button>
                {showProfileOptions && (
                  <ul
                    style={{ zIndex: 100, right: 10, top: 50, width: 100 }}
                    className="flex flex-col gap-2 absolute bg-white shadow-md rounded-2xl"
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
                      {isLogout ? (
                        <Image src={loading} alt="loading" width={20} height={20} />
                      ) : (
                        <span>Log out</span>
                      )}
                    </button>
                  </ul>
                )}
              </div>
            )}

          {friendId && <div>
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
                    disabled={chatButtonLoading}
                    onClick={startConversation}
                    className={`bg-blue-500 shadow-md rounded-full p-4 ${
                      !showChatButton && "invisible"
                    }`}
                  > 
                    {chatButtonLoading ? <Image src={whiteloading} alt="white-loading" height={30} width={30}/> : <MessageSquareText color={"#ffffff"} />}
                  </button>
                )}
              </div>
            )}
          </div>}

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

                {sidebarNotificationCounter > 0 && (
                  <div
                    style={{
                      zIndex: 99,
                      width: 30,
                      height: 30,
                      marginBottom: 120,
                      marginRight: 2,
                    }}
                    className="absolute bg-red-500 flex justify-center items-center rounded-full"
                  >
                    {sidebarNotificationCounter}
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
