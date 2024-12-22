import React, { useEffect, useState } from "react";
import chatContent from "../config/chatContent.json";
import MessageList from "./MessageList";
import { useMessageAnimation } from "../hooks/useMessageAnimation";
import { Message, ChatContent } from "@/types/chat";

const ChatContainer = React.forwardRef<HTMLDivElement, { className?: string }>(
  ({ className }, ref) => {
    const [allMessages, setAllMessages] = useState<Message[]>([]);

    // Initialize messages from chat content
    useEffect(() => {
      console.log("Initializing chat container");
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

    const { visibleMessages } = useMessageAnimation(allMessages, {
      messageDisplayDuration: 5000,
      scrollDuration: 1500,
      maxVisibleMessages: 3,
    });

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
        <div
          ref={ref}
          className={`bg-black/5 rounded-lg p-6 h-[calc(100vh-200px)] flex flex-col ${className}`}
          role="region"
          aria-label="Chat messages"
        >
          <MessageList messages={visibleMessages} />
        </div>
      </div>
    );
  }
);

export default ChatContainer;