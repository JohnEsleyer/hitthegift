"use client";

import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store";
import { ChatMessage, Message } from "@/lib/types/message";
import { updateShowLoading } from "@/lib/features/chat";
import { updateIsOpenChatbox } from "@/lib/features/insideFriend";
import fetchMessages from "@/app/actions/chat/fetchMessages";
import createMessage from "@/app/actions/chat/createMessage";
import markMessagesAsRead from "@/app/actions/chat/markMessagesAsRead";
import UserProfileImage from "@/components/UserProfileImage";
import { ChatBubble } from "@/components/ChatBubble";
import ChatboxSkeleton from "@/components/skeletons/ChatBubbleSkeleton";
import { Send, RotateCcw, Minus } from "lucide-react";

export default function Chatbox() {
  const dispatch = useDispatch();

  const userId = useSelector((state: RootState) => state.userData.id);
  const friendId = useSelector(
    (state: RootState) => state.insideFriend.friendId
  );
  const friendData = useSelector(
    (state: RootState) => state.insideFriend.friendData
  );
  const conversationId = useSelector(
    (state: RootState) => state.insideFriend.conversationId
  );

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageContent, setMessageContent] = useState("");

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasFetchedInitially = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  // Helper to merge new fetched messages into existing state
  const mergeMessages = (fetched: ChatMessage[]) => {
    setMessages((prev) => {
      const existingIds = new Set(prev.map((m) => m.message.id));
      const newOnes = fetched.filter(
        (m) => m.message.id && !existingIds.has(m.message.id)
      );
      return [...prev, ...newOnes];
    });
  };

  // Load all messages initially
  const loadMessages = async () => {
    if (!conversationId) return;
    setLoading(true);
    try {
      const results = await fetchMessages(conversationId);
      if (results?.data) {
        const fetchedMessages: ChatMessage[] = results.data.map(
          (m: Message) => ({
            message: {
              ...m,
              timestamp: new Date(m.timestamp),
            },
            status: "sent",
          })
        );

        // Mark as read
        await markMessagesAsRead(userId, conversationId);

        // Initial load: Replace the entire state
        setMessages(fetchedMessages);
      }
    } catch (e) {
      console.log("Failed to fetch messages:", e);
    } finally {
      setLoading(false);
      dispatch(updateShowLoading(false));
      hasFetchedInitially.current = true;
      startBackgroundPolling();
    }
  };

  // Load only new messages without resetting the entire list
  const loadNewMessages = async () => {
    if (!conversationId) return;
    try {
      const results = await fetchMessages(conversationId);
      if (results?.data) {
        const fetchedMessages: ChatMessage[] = results.data.map(
          (m: Message) => ({
            message: {
              ...m,
              timestamp: new Date(m.timestamp),
            },
            status: "sent",
          })
        );
        // Mark as read
        await markMessagesAsRead(userId, conversationId);

        // Merge instead of replacing
        mergeMessages(fetchedMessages);
      }
    } catch (e) {
      console.log("Failed to fetch new messages:", e);
    }
  };

  const startBackgroundPolling = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (hasFetchedInitially.current) {
        loadNewMessages();
      }
    }, 5000);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Initial load when conversationId changes
  useEffect(() => {
    if (conversationId) {
      loadMessages();
    }
  }, [conversationId]);

  // Sending a new message
  const handleSend = async () => {
    const content = messageContent.trim();
    if (!content || sending || !conversationId) return;

    // Optimistic message
    const tempMessage: ChatMessage = {
      message: {
        id: "", // Temporary ID
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
      // Suppose createMessage returns an object with { id: string } but no timestamp
      const response = await createMessage(userId, conversationId, content);
      const newMessageFromServer: Message = {
        id: response?.messageId || "",
        sender: userId,
        conversationId,
        content,
        timestamp: new Date(), // approximate local time or set to Date.now
        senderIsRead: true,
        receiverIsRead: false,
      };

      setMessages((prev) => {
        const updated = [...prev];
        const lastMsgIndex = updated.findIndex(
          (m) => m.status === "sending" && m.message.content === content
        );
        if (lastMsgIndex !== -1) {
          updated[lastMsgIndex] = {
            message: newMessageFromServer,
            status: "sent",
          };
        }
        return updated;
      });
    } catch (e) {
      console.error("Failed to send message:", e);
      // If failed, mark the message as "failed"
      setMessages((prev) => {
        const updated = [...prev];
        const lastMsgIndex = updated.findIndex(
          (m) => m.status === "sending" && m.message.content === content
        );
        if (lastMsgIndex !== -1) {
          updated[lastMsgIndex] = {
            ...updated[lastMsgIndex],
            status: "failed",
          };
        }
        return updated;
      });
    } finally {
      setSending(false);
    }
  };

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
                key={chatMessage.message.id || index} // Use message ID if available
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