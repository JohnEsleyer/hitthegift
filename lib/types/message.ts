
export type Message = {
    id: string,
    sender: string, // Sender's ID
    conversationId: string,
    content: string,
    timestamp: Date,
}

// used by Chatbox component and redux 
export type ChatMessage = {
    message: Message;
    status: "sent" | "sending" | "failed";
  }