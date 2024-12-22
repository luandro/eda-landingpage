import { useEffect, useRef, useState } from "react";
import { Message } from "@/types/chat";

interface AnimationConfig {
  messageDisplayDuration: number;
  scrollDuration: number;
  maxVisibleMessages: number;
}

const defaultConfig: AnimationConfig = {
  messageDisplayDuration: 5000, // Increased from 3000 for slower pacing
  scrollDuration: 1500, // Increased from 1000 for smoother transitions
  maxVisibleMessages: 3,
};

export const useMessageAnimation = (
  messages: Message[],
  config: Partial<AnimationConfig> = {}
) => {
  const [visibleMessages, setVisibleMessages] = useState<Message[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  const animationConfig = { ...defaultConfig, ...config };

  useEffect(() => {
    if (!messages.length) return;

    console.log("Starting message animation cycle");
    
    const addNextMessage = () => {
      console.log(`Adding message ${currentIndex + 1}/${messages.length}`);
      
      setVisibleMessages((prev) => {
        const newMessages = [...prev, messages[currentIndex]].slice(
          -animationConfig.maxVisibleMessages
        );
        return newMessages;
      });

      setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length);
    };

    const interval = setInterval(
      addNextMessage,
      animationConfig.messageDisplayDuration
    );
    
    // Add first message immediately
    if (visibleMessages.length === 0) {
      addNextMessage();
    }

    return () => clearInterval(interval);
  }, [messages, currentIndex, animationConfig]);

  return {
    visibleMessages,
    isAnimating,
    setIsAnimating,
  };
};