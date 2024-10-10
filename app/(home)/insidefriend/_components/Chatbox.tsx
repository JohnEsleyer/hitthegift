"use client";

import createMessage from "@/app/actions/chat/createMessage";
import fetchMessages from "@/app/actions/chat/fetchMessages";
import { ChatBubble } from "@/components/ChatBubble";
import ChatboxSkeleton from "@/components/skeletons/ChatboxSkeleton";
import { updateIsOpenChatbox } from "@/lib/features/insideFriend";
import { RootState } from "@/lib/store";
import { ChatMessage, Message } from "@/lib/types/message";
import { getLastElement } from "@/utils/getLastElement";
import Avvvatars from "avvvatars-react";
import { Minus, Send } from "lucide-react";
import { WithId } from "mongodb";
import { useEffect, useState, useTransition } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Chatbox() {
  const dispatch = useDispatch();
  const friendName = useSelector(
    (state: RootState) => state.insideFriend.friendName
  );
  const friendId = useSelector(
    (state: RootState) => state.insideFriend.friendId
  );
  const [messageContent, setMessageContent] = useState("");
  const userId = useSelector((state: RootState) => state.userData.id);
  const conversationId = useSelector(
    (state: RootState) => state.insideFriend.conversationId
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isPending, startChatTransition] = useTransition();
  const [isSending, startSendingTransition] = useTransition();

  const handleSend = () => {


    setMessages((prev) => [
      ...prev,
      {
        message: {
          id: "",
          sender: userId,
          conversationId: conversationId,
          content: messageContent,
          timestamp: new Date(),
        },
        status: "sending",
      },
    ]);

    startSendingTransition(async () => {
      try {
        const res = await createMessage(userId, conversationId, messageContent);
        console.log(res.status);
      
      } catch (e) {
        console.log(e);
      }
    })
    setMessageContent('');
  };

  useEffect(() => {
    if (!isSending){
       // Display sent on the latest message 

      //Delete the last message and replace it with the updated one
       const temp: ChatMessage | undefined = getLastElement(messages);
       if (temp){
        setMessages((messages) => (messages.filter((message, index) => (index !== messages.length-1))));

        setMessages((messages) => ([...messages, {
         ...temp,
         status: 'sent',
       }]))
       }else{
        console.log('undefined last message');
       }
     
    }
  },[isSending])


  useEffect(() => {
    startChatTransition(async () => {
      console.log(`id sent to server: ${userId}`);
      try{
        const results = await fetchMessages(conversationId);
        console.log(results.status);
        if (results){
          const messagesList: ChatMessage[] = (results.data as Message[]).map((message) => (
            {
              message: {
                id: message.id,
                sender: message.sender,
                conversationId: message.conversationId,
                content: message.content,
                timestamp: message.timestamp,
            },
            status: "sent" as  "sent" | "sending" | "failed",
          }
          ));

          // Sort the messages from oldest to latest
          const sortedMessages = [...messagesList].sort((a, b) => {
            return new Date(a.message.timestamp).getTime() - new Date(b.message.timestamp).getTime();
          });
          setMessages(sortedMessages);
        }
      }catch(e){
        console.log(e);
      }
    })
  }, []);


  return (
    <div
      style={{ height: 400, width: 300 }}
      className="flex flex-col shadow-md bg-white"
    >
      <div className="w-full flex justify-between shadow-md p-2 h-12 ">
        <div className="flex items-center gap-2">
          <Avvvatars value={friendName} />
          <span>{friendName}</span>
        </div>
        <div className="p-2">
          <button
            onClick={() => {
              dispatch(updateIsOpenChatbox(false));
            }}
          >
            <Minus />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto overflow-x-hidden ">
        {!isPending ? (
          <div style={{ maxWidth: "400px", margin: "0 auto" }}>
            {messages.map((chatMessage, index) => {
              // const isUserMessage = chatMessage.message.sender === userId;

              return (<ChatBubble
                key={index}
                avatarUrl={''}
                timestamp={`${chatMessage.message.timestamp.getFullYear()}/${chatMessage.message.timestamp.getMonth()}/${chatMessage.message.timestamp.getDate()} `}
                message={chatMessage.message.content}
                deliveryStatus={chatMessage.status}
                isSender={chatMessage.message.sender == userId}
              />);
            })}
          </div>
        ) : (
          <div className="flex-1 overflow-auto overflow-x-hidden">
            <ChatboxSkeleton/>
          </div>
        )}
      </div>
      <div className="shadow-md border-t flex p-2 h-12">
        <input
          className="border p-2 rounded-2xl"
          value={messageContent}
          onChange={(e) => {
            setMessageContent(e.target.value);
          }}
        />
        <button onClick={handleSend}>
          <Send color="#4298f5" />
        </button>
      </div>
    </div>
  );
}
