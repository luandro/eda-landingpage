import React from "react";
import { MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type MessageType = "user" | "agent";

export interface ChatMessageProps {
  type: MessageType;
  content: string;
  timestamp: string;
  steps?: string[];
  className?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  type,
  content,
  timestamp,
  steps,
  className,
}) => {
  const isAgent = type === "agent";

  return (
    <motion.div
      className={cn(
        "flex items-start gap-4",
        isAgent ? "flex-row-reverse" : "",
        className,
      )}
      initial={{ opacity: 0, x: isAgent ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div
        className={cn(
          "text-white p-2 rounded-full",
          isAgent ? "bg-eda-orange" : "bg-eda-green",
        )}
        aria-hidden="true"
      >
        <MessageSquare size={20} />
      </div>
      <div className="flex-1 space-y-2">
        {steps && (
          <motion.div
            className="space-y-2 mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="text-sm text-gray-500 italic"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.5 }}
              >
                {step}
                <span className="animate-blink">...</span>
              </motion.div>
            ))}
          </motion.div>
        )}
        <div
          className={cn(
            "rounded-lg p-6 shadow-sm",
            isAgent ? "bg-eda-orange/10" : "bg-white",
          )}
          role="article"
          aria-label={`${type} message`}
        >
          <p className="text-base leading-relaxed whitespace-pre-line">
            {content}
          </p>
          <span className="text-xs text-gray-500 mt-2 block">{timestamp}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
