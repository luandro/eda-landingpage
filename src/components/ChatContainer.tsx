import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatMessage, { MessageType } from "./ChatMessage";
import chatContent from "../config/chatContent.json";

interface Message {
  id: string;
  type: MessageType;
  content: string;
  timestamp: string;
  steps?: string[];
}

interface Conversation {
  id: number;
  messages: Message[];
}

interface ChatContent {
  conversations: Conversation[];
}

const ChatContainer: React.FC<{ className?: string }> = ({ className }) => {
  const chatRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = React.useState<Message[]>([]);

  useEffect(() => {
    // Type assertion to ensure chatContent matches our interface
    const typedChatContent = chatContent as ChatContent;
    
    // Add validation to ensure we have conversations
    if (!typedChatContent.conversations?.length) {
      console.error("No conversations found in chat content");
      return;
    }

    const conversation = typedChatContent.conversations[0];
    
    // Validate conversation has messages
    if (!conversation?.messages?.length) {
      console.error("No messages found in conversation");
      return;
    }

    let currentIndex = 0;

    const addMessage = () => {
      if (currentIndex < conversation.messages.length) {
        setMessages((prev) => [...prev, conversation.messages[currentIndex]]);
        currentIndex++;

        if (chatRef.current) {
          chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
      }
    };

    const interval = setInterval(addMessage, 2000);
    addMessage(); // Add first message immediately

    return () => clearInterval(interval);
  }, []);

  // Add null check before rendering messages
  if (!messages.length) {
    return (
      <div 
        className={`bg-black/5 rounded-lg p-6 h-[calc(100vh-200px)] flex items-center justify-center ${className}`}
      >
        <p className="text-gray-500">Loading messages...</p>
      </div>
    );
  }

  return (
    <div
      ref={chatRef}
      className={`bg-black/5 rounded-lg p-6 h-[calc(100vh-200px)] flex flex-col space-y-6 overflow-y-auto ${className}`}
      role="region"
      aria-label="Chat messages"
    >
      <AnimatePresence>
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            type={message.type}
            content={message.content}
            timestamp={message.timestamp}
            steps={message.type === "agent" ? message.steps : undefined}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ChatContainer;