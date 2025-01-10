import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { processMarkdown } from "@/lib/textProcessing";
import TypewriterCursor from "./TypewriterCursor";
import { calculateWordTimings, getCurrentWord } from "@/lib/narrativeUtils/wordTiming";

interface TypewriterEffectProps {
  text: string;
  delay?: number;
  className?: string;
  onComplete?: () => void;
  showCursor?: boolean;
  currentTime?: number;
  startTime?: number;
  endTime?: number;
}

const TypewriterEffect: React.FC<TypewriterEffectProps> = ({
  text,
  delay = 50,
  className,
  onComplete,
  showCursor = true,
  currentTime = 0,
  startTime = 0,
  endTime = 0,
}) => {
  const [displayText, setDisplayText] = useState("0");
  const [isTyping, setIsTyping] = useState(true);
  const [currentHighlightedWord, setCurrentHighlightedWord] = useState<string | null>(null);

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

  // Enhanced word highlighting effect
  useEffect(() => {
    if (startTime && endTime && currentTime) {
      const wordTimings = calculateWordTimings(text, startTime, endTime);
      const highlightedWord = getCurrentWord(wordTimings, currentTime);
      
      console.log('Updating highlighted word:', {
        currentTime,
        highlightedWord,
        totalWords: wordTimings.length
      });
      
      setCurrentHighlightedWord(highlightedWord);
    }
  }, [text, currentTime, startTime, endTime]);

  const highlightWord = (content: string) => {
    if (!currentHighlightedWord) return content;

    const parts = content.split(new RegExp(`(${currentHighlightedWord})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === currentHighlightedWord?.toLowerCase() ? 
        `<span class="bg-blue-200 dark:bg-blue-800 rounded px-1 py-0.5 transition-colors duration-200">${part}</span>` : 
        part
    ).join('');
  };

  const processedContent = processMarkdown(text, parseInt(displayText));
  const highlightedContent = highlightWord(processedContent);

  return (
    <span className={cn("inline-block", className)}>
      <span
        dangerouslySetInnerHTML={{
          __html: highlightedContent,
        }}
      />
      <TypewriterCursor isVisible={showCursor && isTyping} />
    </span>
  );
};

export default TypewriterEffect;