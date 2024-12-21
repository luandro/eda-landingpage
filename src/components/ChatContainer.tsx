import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatMessage from "./ChatMessage";
import chatContent from "../config/chatContent.json";

const ChatContainer: React.FC<{ className?: string }> = ({ className }) => {
  const chatRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = React.useState<typeof chatContent.conversations[0]["messages"]>([]);

  useEffect(() => {
    const conversation = chatContent.conversations[0];
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