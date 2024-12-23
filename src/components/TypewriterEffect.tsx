import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface TypewriterEffectProps {
  text: string;
  delay?: number;
  className?: string;
  onComplete?: () => void;
  showCursor?: boolean;
}

const TypewriterEffect: React.FC<TypewriterEffectProps> = ({
  text,
  delay = 50,
  className,
  onComplete,
  showCursor = true,
}) => {
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    setDisplayText("");
    setIsTyping(true);
  }, [text]);

  useEffect(() => {
    if (!text || displayText.length >= text.length) {
      setIsTyping(false);
      onComplete?.();
      return;
    }

    const timeout = setTimeout(() => {
      setDisplayText(text.slice(0, displayText.length + 1));
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, displayText, delay, onComplete]);

  return (
    <span className={cn("inline-block", className)}>
      {displayText}
      {showCursor && isTyping && (
        <span className="animate-blink ml-0.5">|</span>
      )}
    </span>
  );
};

export default TypewriterEffect;
