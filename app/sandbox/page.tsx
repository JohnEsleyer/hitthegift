'use client'

import React, { useState, useEffect, useRef } from 'react';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

const Chatbox: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { text: 'Hello!', sender: 'bot' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      setMessages([...messages, { text: newMessage, sender: 'user' }]);
      setNewMessage('');
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-[300px] border border-gray-300 rounded">
      <div className="flex-grow overflow-y-auto p-4" ref={messagesEndRef}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-2 rounded-lg p-3 max-w-[70%] ${
              message.sender === 'user'
                ? 'bg-gray-200 text-right self-end'
                : 'bg-blue-100 self-start'
            }`}
          >
            {message.text}
          </div>
        ))}
      </div>
      <div className="flex items-center p-4">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow border border-gray-300 rounded-md p-2 mr-2"
        />
        <button
          onClick={handleSendMessage}
          className="bg-green-500 hover:bg-green-600 text-white rounded-md px-4 py-2"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbox;