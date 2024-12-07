"use client";

import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store";
import { ChatMessage, Message } from "@/lib/types/message";
import { UserConversation } from "@/lib/types/conversation";
import { updateShowLoading } from "@/lib/features/chat";
import { updateIsOpenChatbox } from "@/lib/features/insideFriend";

import findOrCreateConversation from "@/app/actions/chat/findOrCreateConversation";
import fetchMessages from "@/app/actions/chat/fetchMessages";
import createMessage from "@/app/actions/chat/createMessage";
import markMessagesAsRead from "@/app/actions/chat/markMessagesAsRead";

import UserProfileImage from "@/components/UserProfileImage";
import { ChatBubble } from "@/components/ChatBubble";
import ChatboxSkeleton from "@/components/skeletons/ChatBubbleSkeleton";

import { Send, RotateCcw, Minus } from "lucide-react";

export default function Chatbox() {
  const dispatch = useDispatch();
  
  // From the Redux store, we get the necessary IDs and flags
  const userId = useSelector((state: RootState) => state.userData.id);
  const friendId = useSelector((state: RootState) => state.insideFriend.friendId);
  const friendData = useSelector((state: RootState) => state.insideFriend.friendData);
  const conversationId = useSelector((state: RootState) => state.insideFriend.conversationId);
  
  // Local states
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageContent, setMessageContent] = useState("");
  
  // Loading states
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  // Fetch messages from server
  const loadMessages = async () => {
    if (!conversationId) return;
    setLoading(true);
    try {
      const results = await fetchMessages(conversationId);
      if (results?.data) {
        const fetchedMessages = results.data.map((m: Message): ChatMessage => ({
          message: {
            ...m,
            timestamp: new Date(m.timestamp)
          },
          status: "sent"
        }));

        // Mark as read
        await markMessagesAsRead(userId, conversationId);

        // Adjust the read status locally if needed
        // (You can do this if you want to ensure UI shows updated read states)

        setMessages(fetchedMessages);
      }
    } catch (e) {
      console.log("Failed to fetch messages:", e);
    } finally {
      setLoading(false);
      dispatch(updateShowLoading(false));
    }
  };

  // Load messages whenever conversationId changes or when component mounts
  useEffect(() => {
    loadMessages();
  }, [conversationId]);

  // Handle sending a message
  const handleSend = async () => {
    const content = messageContent.trim();
    if (!content || sending || !conversationId) return;

    // Optimistically add the message to the UI
    const tempMessage: ChatMessage = {
      message: {
        id: "",
        sender: userId,
        conversationId: conversationId,
        content: content,
        timestamp: new Date(),
        senderIsRead: true,
        receiverIsRead: false,
      },
      status: "sending",
    };

    setMessages((prev) => [...prev, tempMessage]);
    setMessageContent("");
    setSending(true);

    try {
      await createMessage(userId, conversationId, content);

      // Replace last message with a "sent" version
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          status: "sent",
        };
        return updated;
      });
    } catch (e) {
      console.error("Failed to send message:", e);
      // If failed, mark the message as "failed"
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          status: "failed",
        };
        return updated;
      });
    } finally {
      setSending(false);
    }
  };

  // Handle refetching messages from UI
  const handleRefetch = () => {
    loadMessages();
  };

  return (
    <div
      style={{ height: 400, width: 300 }}
      className="flex flex-col shadow-md bg-white border"
    >
      <div className="w-full flex justify-between shadow-md p-2 h-12">
        <div className="flex items-center gap-2">
          <UserProfileImage
            userId={friendId}
            userName={friendData?.firstName || ""}
            alt={""}
            width={30}
            height={30}
          />
          <span>{friendData?.firstName || ""}</span>
        </div>
        <div className="flex items-center gap-1 p-2">
          <button onClick={handleRefetch}>
            <RotateCcw size={20} />
          </button>
          <button
            onClick={() => {
              dispatch(updateIsOpenChatbox(false));
            }}
          >
            <Minus />
          </button>
        </div>
      </div>

      <div
        ref={messagesEndRef}
        className="flex-1 overflow-auto overflow-x-hidden hide-scrollbar"
      >
        {loading ? (
          <ChatboxSkeleton />
        ) : messages.length > 0 ? (
          <div style={{ maxWidth: "400px", margin: "0 auto" }}>
            {messages.map((chatMessage, index) => (
              <ChatBubble
                key={index}
                timestamp={chatMessage.message.timestamp.toLocaleString()}
                message={chatMessage.message.content}
                deliveryStatus={chatMessage.status}
                isSender={chatMessage.message.sender === userId}
              />
            ))}
          </div>
        ) : (
          <div
            style={{ height: 250 }}
            className="w-full flex justify-center items-center text-gray-400"
          >
            No Messages
          </div>
        )}
      </div>

      <div className="w-full flex shadow-md border-t border-gray-400 p-2 h-12">
        <input
          className="flex-1 border border-gray-400 p-2 rounded-2xl"
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
          placeholder="Type your message..."
        />
        <button className="w-8" onClick={handleSend}>
          <Send color="#4298f5" />
        </button>
      </div>
    </div>
  );
}
