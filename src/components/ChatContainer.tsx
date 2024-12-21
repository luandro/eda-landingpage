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
  const [showScrollPrompt, setShowScrollPrompt] = React.useState(true);

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
        if (newMessage && typeof newMessage.type === 'string') {
          setMessages((prev) => [...prev, newMessage]);
          currentIndex++;

          if (chatRef.current) {
            // Create smooth auto-scroll animation
            chatRef.current.scrollTo({
              top: chatRef.current.scrollHeight,
              behavior: 'smooth'
            });
          }
        } else {
          console.error("Invalid message format:", newMessage);
        }
      }
    };

    const interval = setInterval(addMessage, 2000);
    addMessage(); // Add first message immediately

    // Hide scroll prompt after a delay
    const promptTimeout = setTimeout(() => {
      setShowScrollPrompt(false);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(promptTimeout);
    };
  }, []);

  // Add null check before rendering messages
  if (!messages?.length) {
    return (
      <div 
        className={`bg-black/5 rounded-lg p-6 h-[calc(100vh-200px)] flex items-center justify-center ${className}`}
      >
        <p className="text-gray-500">Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        ref={chatRef}
        className={`bg-black/5 rounded-lg p-6 h-[calc(100vh-200px)] flex flex-col space-y-6 overflow-y-auto scroll-smooth ${className}`}
        role="region"
        aria-label="Chat messages"
      >
        <AnimatePresence>
          {messages.map((message) => (
            message && message.type && (
              <ChatMessage
                key={message.id}
                type={message.type}
                content={message.content}
                timestamp={message.timestamp}
                steps={message.type === "agent" ? message.steps : undefined}
              />
            )
          ))}
        </AnimatePresence>
      </div>
      
      {/* Scroll Prompt */}
      <AnimatePresence>
        {showScrollPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-eda-green text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2"
          >
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-4 h-4 border-t-2 border-r-2 border-white transform rotate-135"
            />
            <span className="text-sm">Scroll to see more</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatContainer;