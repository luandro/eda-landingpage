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

const ChatContainer = React.forwardRef<HTMLDivElement, { className?: string }>(({ className }, ref) => {
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
        const newMessage = conversation.messages[currentIndex];
        // Validate message before adding
        if (newMessage && typeof newMessage.type === "string") {
          setMessages((prev) => [...prev, newMessage]);
          currentIndex++;

          // No need for auto-scroll since we have continuous animation
        } else {
          console.error("Invalid message format:", newMessage);
        }
      }
    };

    const interval = setInterval(addMessage, 2000);
    addMessage(); // Add first message immediately

    return () => {
      clearInterval(interval);
    };
  }, []);

  // Add null check before rendering messages
  if (!messages?.length) {
    return (
      <div className="relative">
        <div
          className={`bg-black/5 rounded-lg p-6 h-[calc(100vh-200px)] flex items-center justify-center ${className}`}
        >
          <p className="text-gray-500">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <motion.div
        ref={ref}
        className={`bg-black/5 rounded-lg p-6 h-[calc(100vh-200px)] flex flex-col space-y-6 overflow-hidden ${className}`}
        role="region"
        aria-label="Chat messages"
        animate={{
          y: [0, `-${messages.length * 150}px`, `-${messages.length * 150}px`, 0],
        }}
        transition={{
          duration: messages.length * 2, // 2 seconds per message for scrolling
          times: [0, 0.4, 0.5, 1], // Pause for 3 seconds at the end (0.4 to 0.5 represents the pause)
          repeat: Infinity,
          ease: 'linear',
          repeatDelay: 3, // Add a 3-second pause at the end
        }}
        data-testid="chat-container"
      >
        <AnimatePresence>
          {messages.map(
            (message) =>
              message &&
              message.type && (
                <ChatMessage
                  key={message.id}
                  type={message.type}
                  content={message.content}
                  timestamp={message.timestamp}
                  steps={message.type === "agent" ? message.steps : undefined}
                />
              ),
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
});

export default ChatContainer;
