import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { processMarkdown } from "@/lib/textProcessing";
import TypewriterCursor from "./TypewriterCursor";

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
  const [displayText, setDisplayText] = useState("0");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    setDisplayText("0");
    setIsTyping(true);
  }, [text]);

  useEffect(() => {
    if (!text) {
      setIsTyping(false);
      onComplete?.();
      return;
    }

    const totalLength = Array.from(text).length;
    const currentLength = parseInt(displayText);

    if (currentLength >= totalLength) {
      setIsTyping(false);
      onComplete?.();
      return;
    }

    const timeout = setTimeout(() => {
      setDisplayText((currentLength + 1).toString());
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, displayText, delay, onComplete]);

  return (
    <span className={cn("inline-block", className)}>
      <span
        dangerouslySetInnerHTML={{
          __html: processMarkdown(text, parseInt(displayText)),
        }}
      />
      <TypewriterCursor isVisible={showCursor && isTyping} />
    </span>
  );
};

export default TypewriterEffect;