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
  const [visibleMessages, setVisibleMessages] = React.useState<Message[]>([]);

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
    visibleMessages,
    setVisibleMessages,
  };
};

const ChatContainer = React.forwardRef<HTMLDivElement, { className?: string }>(
  ({ className }, ref) => {
    const {
      contentRef,
      scrollHeight,
      isScrolling,
      visibleMessages,
      setVisibleMessages,
    } = useAutoScroll();
    const [allMessages, setAllMessages] = React.useState<Message[]>([]);
    const [currentIndex, setCurrentIndex] = React.useState(0);

    // Initialize messages from chat content
    useEffect(() => {
      console.log("Initializing chat container with auto-scroll animation");
      const typedChatContent = chatContent as ChatContent;

      if (!typedChatContent.conversations?.length) {
        console.error("No conversations found in chat content");
        return;
      }

      const conversation = typedChatContent.conversations[0];
      if (!conversation?.messages?.length) {
        console.error("No messages found in conversation");
        return;
      }

      setAllMessages(conversation.messages);
    }, []);

    // Handle message animation cycle
    useEffect(() => {
      if (!allMessages.length) return;

      const messageDisplayDuration = 3000; // Time each message is displayed
      const scrollDuration = 1000; // Time taken to scroll

      const addNextMessage = () => {
        console.log(`Adding message ${currentIndex + 1}/${allMessages.length}`);
        
        setVisibleMessages((prev) => {
          // Keep only the last 3 messages to prevent DOM overload
          const newMessages = [...prev, allMessages[currentIndex]].slice(-3);
          return newMessages;
        });

        setCurrentIndex((prevIndex) => (prevIndex + 1) % allMessages.length);
      };

      const interval = setInterval(addNextMessage, messageDisplayDuration);
      addNextMessage(); // Add first message immediately

      return () => clearInterval(interval);
    }, [allMessages, currentIndex]);

    if (!visibleMessages?.length) {
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
      <div className="relative overflow-hidden">
        <motion.div
          ref={(node) => {
            if (typeof ref === "function") ref(node);
            else if (ref) ref.current = node;
            contentRef.current = node;
          }}
          className={`bg-black/5 rounded-lg p-6 h-[calc(100vh-200px)] flex flex-col space-y-6 ${className}`}
          role="region"
          aria-label="Chat messages"
        >
          <AnimatePresence mode="popLayout">
            {visibleMessages.map((message) => (
              <motion.div
                key={`${message.id}-${message.timestamp}`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                }}
              >
                <ChatMessage
                  type={message.type}
                  content={message.content}
                  timestamp={message.timestamp}
                  steps={message.type === "agent" ? message.steps : undefined}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    );
  }
);

export default ChatContainer;
