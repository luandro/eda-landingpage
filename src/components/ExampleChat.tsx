import React from "react";
import ChatContainer from "./ChatContainer";

interface ExampleChatProps {
  className?: string;
}

const ExampleChat: React.FC<ExampleChatProps> = ({ className }) => (
  <ChatContainer className={className} />
);

export default ExampleChat;
