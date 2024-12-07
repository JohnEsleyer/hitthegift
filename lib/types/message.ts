export type Message = {
    id: string;
    sender: string; // Sender's ID
    conversationId: string;
    content: string;
    timestamp: Date;
    senderIsRead: boolean;
    receiverIsRead: boolean;
  }
  
  export type ChatMessage = {
    message: Message;
    status: "sent" | "sending" | "failed";
  }
  