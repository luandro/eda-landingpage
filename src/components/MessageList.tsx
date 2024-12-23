import React from "react";
import { AnimatePresence } from "framer-motion";
import MessageBubble from "./MessageBubble";
import { Message } from "@/types/chat";

interface MessageListProps {
  messages: Message[];
  className?: string;
}

const MessageList: React.FC<MessageListProps> = ({ messages, className }) => {
  return (
    <div className={`flex flex-col space-y-6 ${className}`}>
      <AnimatePresence mode="popLayout">
        {messages.map((message) => (
          <MessageBubble
            key={`${message.id}-${message.timestamp}`}
            message={message}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default MessageList;
