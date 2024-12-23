import React from "react";
import { motion } from "framer-motion";
import ChatMessage from "./ChatMessage";
import { Message } from "@/types/chat";

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble = React.forwardRef<HTMLDivElement, MessageBubbleProps>(
  ({ message }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{
          type: "spring",
          stiffness: 300, // Reduced for smoother animation
          damping: 25, // Adjusted for better bounce
          duration: 0.8, // Increased duration
        }}
      >
        <ChatMessage
          type={message.type}
          content={message.content}
          timestamp={message.timestamp}
          steps={message.type === "agent" ? message.steps : undefined}
        />
      </motion.div>
    );
  },
);

export default MessageBubble;
