import { useEffect, useRef, useState } from "react";
import { Message } from "@/types/chat";

interface AnimationConfig {
  messageDisplayDuration: number;
  scrollDuration: number;
  maxVisibleMessages: number;
}

const defaultConfig: AnimationConfig = {
  messageDisplayDuration: 5000,
  scrollDuration: 1500,
  maxVisibleMessages: 3,
};

export const useMessageAnimation = (
  messages: Message[],
  config: Partial<AnimationConfig> = {},
) => {
  const [visibleMessages, setVisibleMessages] = useState<Message[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);

  const animationConfig = { ...defaultConfig, ...config };
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!messages.length) return;

    const addNextMessage = () => {
      setIsScrolling(true);

      // Add new message with scroll animation
      setVisibleMessages((prev) => {
        const newMessages = [...prev, messages[currentIndex]].slice(
          -animationConfig.maxVisibleMessages,
        );
        return newMessages;
      });

      // Reset scroll state after animation
      timeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, animationConfig.scrollDuration);

      setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length);
    };

    const interval = setInterval(
      addNextMessage,
      animationConfig.messageDisplayDuration,
    );

    // Add first message immediately
    if (visibleMessages.length === 0) {
      addNextMessage();
    }

    return () => {
      clearInterval(interval);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [messages, currentIndex, animationConfig]);

  return {
    visibleMessages,
    isAnimating,
    setIsAnimating,
    isScrolling,
  };
};
