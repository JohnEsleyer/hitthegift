"use client";

import { RootState } from "@/lib/store";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import UserProfileImage from "./UserProfileImage";
import fetchAllConversationsByUserId from "@/app/actions/chat/fetchAllConversationsByUserId";
import { updateConversations, updateShowLoading } from "@/lib/features/chat";
import InboxSkeleton from "./skeletons/InboxSkeleton";
import { updateConversationId, updateFriendId, updateFriendName, updateIsOpenChatbox } from "@/lib/features/insideFriend";
import findOrCreateConversation from "@/app/actions/chat/findOrCreateConversation";

export default function Inbox() {
  const conversations = useSelector((state: RootState) => state.chat.conversations);
  const [isLoading, setIsLoading] = useState(true);
  const userId = useSelector((state: RootState) => state.userData.id);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchConversations = async () => {
      const response = await fetchAllConversationsByUserId(userId);
      if (response.status === 200 && response.data) {
        console.log("success");
        dispatch(updateConversations(response.data));

      } else {
        console.error("Failed to fetch conversations");
      }
      setIsLoading(false);
    };
    fetchConversations();
  }, [userId]);

  const openChatbox = async (conversationId: string, friendId: string, friendName: string) => {
    
    dispatch(updateShowLoading(true));
    dispatch(updateFriendId(friendId));
    dispatch(updateFriendName(friendName));
    dispatch(updateConversationId(conversationId));
    dispatch(updateIsOpenChatbox(true)); 
    
  }

  return (
    <div className="border">
      <div className="h-12 shadow-md flex justify-center items-center font-bold text-xl">
        Inbox
      </div>
      <ul style={{ height: 300 }} className="space-y-4 overflow-auto p-2">
        {isLoading ? <InboxSkeleton/> : <div className="flex flex-col justify-center items-center">
        {conversations.length > 0 ? conversations.map((conversation) => (
          <button
            key={conversation.conversationId}
            className="flex items-center hover:bg-gray-200 w-full pt-2"
            onClick={() => openChatbox(conversation.conversationId, conversation.friend.id, conversation.friend.name)}
          >
            <UserProfileImage
              userId={conversation.friend.id}
              userName={conversation.friend.name}
              width={50}
              height={50}
              alt={"profile"}
            />
            <div>
              <div className="font-medium pl-2">{conversation.friend.name}</div>
              {conversation.unreadMessageCount > 0 && (
                <span className="text-gray-500 text-sm">
                  ({conversation.unreadMessageCount} unread)
                </span>
              )}
            </div>
          </button>
        )) : <p className="text-gray-400">You have no conversations</p>}
        </div>
        }
      </ul>
    </div>
  );
}
