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

    // Calculate total visible characters by processing the text segments
    const segments = processMarkdownSegments(text);
    const totalLength = segments.reduce((total, segment) =>
      total + Array.from(segment.text).length, 0);
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

  // Function to process markdown text into segments
  const processMarkdownSegments = (text: string) => {
    const segments: {
      text: string;
      isLink: boolean;
      url?: string;
      startIndex: number;
      endIndex: number;
    }[] = [];

    let lastIndex = 0;
    let charCount = 0;

    // Match markdown links with proper UTF-8 handling
    const sanitizedText = text.normalize('NFC');
    const pattern = /\[((?:[^\]]|\\\])*)\]\(((?:[^)]|\\\))*)\)/g;
    const matches = Array.from(sanitizedText.matchAll(pattern));

    for (let i = 0; i < matches.length; i++) {
      const match = matches[i];
      const [fullMatch, linkText, url] = match;
      const matchIndex = match.index!;

      // Add text before the link
      if (matchIndex > lastIndex) {
        const beforeText = text.slice(lastIndex, matchIndex);
        if (beforeText.length > 0) {
          const beforeChars = Array.from(beforeText);
          segments.push({
            text: beforeText,
            isLink: false,
            startIndex: charCount,
            endIndex: charCount + beforeChars.length
          });
          charCount += beforeChars.length;
        }
      }

      // Add the link as a segment
      if (linkText.length > 0) {
        // Decode any escaped characters in the link text
        const decodedText = linkText.replace(/\\(.)/g, '$1');
        const decodedUrl = url.replace(/\\(.)/g, '$1');
        const linkChars = Array.from(decodedText);
        segments.push({
          text: decodedText,
          isLink: true,
          url: decodedUrl,
          startIndex: charCount,
          endIndex: charCount + linkChars.length
        });
        charCount += linkChars.length;
      }

      lastIndex = matchIndex + fullMatch.length;
    }

    // Add remaining text after last link
    if (lastIndex < text.length) {
      const remainingText = text.slice(lastIndex);
      const remainingChars = Array.from(remainingText);
      if (remainingChars.length > 0) {
        segments.push({
          text: remainingText,
          isLink: false,
          startIndex: charCount,
          endIndex: charCount + remainingChars.length
        });
      }
    }

    return segments;
  };

    // Function to render segments with typewriter effect
  const processMarkdown = (text: string, visibleChars: number) => {
    const segments = processMarkdownSegments(text);
    let result = '';
    let currentPos = 0;

    for (const segment of segments) {
      if (currentPos >= visibleChars) break;

      // Ensure proper UTF-8 character handling
      const chars = Array.from(segment.text.normalize('NFC'));
      const remainingChars = visibleChars - currentPos;
      const visibleCount = Math.min(chars.length, remainingChars);

      if (visibleCount <= 0) continue;

      const visibleText = chars.slice(0, visibleCount).join('');

      // Handle UTF-8 characters and links properly
      if (segment.isLink) {
        // Always show the visible text normally while typing
        result += visibleText;

        // When the full text is visible, wrap it in a link
        if (visibleCount === chars.length) {
          const encoded = encodeURI(segment.url || '');
          result = result.slice(0, -(visibleText.length)) +
            `<a href="${encoded}" class="inline-block">${visibleText}</a>`;
        }
      } else {
        result += visibleText;
      }

      currentPos += visibleCount;
    }

    return result;
  };

  return (
    <span
      className={cn("inline-block", className)}
      dangerouslySetInnerHTML={{
        __html:
          processMarkdown(text, parseInt(displayText)) +
          (showCursor && isTyping ? '<span class="animate-blink ml-0.5">|</span>' : ""),
      }}
    />
    );
};

export default TypewriterEffect;
