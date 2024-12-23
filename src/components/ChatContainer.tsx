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
      messageDisplayDuration: 2000,
      scrollDuration: 500,
      maxVisibleMessages: 3,
    });

    if (!visibleMessages?.length) {
      return (
        <div className="relative">
          <div
            className={`bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800
            backdrop-blur-sm shadow-lg rounded-xl p-8 h-[calc(100vh-200px)]
            flex items-center justify-center border border-gray-200/20 ${className}`}
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                Loading conversation...
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="relative overflow-hidden">
        <div
          ref={ref}
          className={`bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800
          backdrop-blur-sm shadow-lg rounded-xl p-8 h-[calc(100vh-200px)]
          flex flex-col border border-gray-200/20 ${className}`}
          role="region"
          aria-label="Chat messages"
        >
          <MessageList
            messages={visibleMessages}
            className="scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700
            scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-600"
          />
        </div>
      </div>
    );
  },
);

export default ChatContainer;
