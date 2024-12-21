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

const useAutoScroll = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [scrollHeight, setScrollHeight] = React.useState(0);
  const [isScrolling, setIsScrolling] = React.useState(true);

  useEffect(() => {
    if (!contentRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setScrollHeight(entry.target.scrollHeight);
      }
    });

    observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, []);

  return {
    contentRef,
    scrollHeight,
    isScrolling,
    setIsScrolling,
  };
};

const ChatContainer = React.forwardRef<HTMLDivElement, { className?: string }>(({ className }, ref) => {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const { contentRef, scrollHeight, isScrolling } = useAutoScroll();

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
        ref={(node) => {
          // Handle both refs
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
          contentRef.current = node;
        }}
        className={`bg-black/5 rounded-lg p-6 h-[calc(100vh-200px)] flex flex-col space-y-6 overflow-hidden ${className}`}
        role="region"
        aria-label="Chat messages"
        animate={isScrolling ? {
          y: [0, -scrollHeight, -scrollHeight, 0],
        } : {
          y: 0
        }}
        transition={{
          duration: Math.max(scrollHeight / 50, 10), // Smoother scroll speed
          times: [0, 0.4, 0.6, 1],
          repeat: Infinity,
          ease: "linear",
          repeatDelay: 3,
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
