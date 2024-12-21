import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export interface SubtitleItem {
  text: string;
  backgroundColor?: string;
  textColor?: "white" | "dark";
  href?: string;
}

interface RotatingSubtitlesProps {
  subtitles: SubtitleItem[];
  rotationSpeed?: number;
  className?: string;
  typewriterEnabled?: boolean;
  typewriterDelay?: number;
}

const RotatingSubtitles: React.FC<RotatingSubtitlesProps> = ({
  subtitles,
  rotationSpeed = 4000,
  className,
  typewriterEnabled = false,
  typewriterDelay = 100,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [currentText, setCurrentText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Function to handle smooth scroll
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Typewriter effect
  useEffect(() => {
    if (!typewriterEnabled) {
      setCurrentText(subtitles[currentIndex].text);
      return;
    }

    const text = subtitles[currentIndex].text;
    if (isTyping) {
      if (currentText.length < text.length) {
        const timeout = setTimeout(() => {
          setCurrentText(text.slice(0, currentText.length + 1));
        }, typewriterDelay);
        return () => clearTimeout(timeout);
      } else {
        setIsTyping(false);
      }
    }
  }, [currentText, currentIndex, typewriterEnabled, isTyping, typewriterDelay, subtitles]);

  useEffect(() => {
    const transitionDuration = 500; // Duration of fade transition in ms

    const intervalId = setInterval(() => {
      setIsVisible(false);

      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % subtitles.length);
        if (typewriterEnabled) {
          setCurrentText("");
          setIsTyping(true);
        }
        setIsVisible(true);
      }, transitionDuration);
    }, rotationSpeed);

    return () => {
      clearInterval(intervalId);
    };
  }, [rotationSpeed, subtitles.length, typewriterEnabled]);

  // Calculate contrast color for text if not provided
  const getTextColorClass = (
    backgroundColor?: string,
    textColor?: "white" | "dark",
  ) => {
    if (textColor === "white") return "text-white";
    if (textColor === "dark") return "text-gray-900";

    if (!backgroundColor) return "text-white";

    // Auto calculate based on background color
    const r = parseInt(backgroundColor.slice(1, 3), 16);
    const g = parseInt(backgroundColor.slice(3, 5), 16);
    const b = parseInt(backgroundColor.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    return brightness > 128 ? "text-gray-900" : "text-white";
  };

  const currentSubtitle = subtitles[currentIndex];

  return (
    <span
      className={cn(
        "font-mono text-sm px-1 transition-all duration-500",
        className,
      )}
      style={{
        backgroundColor: currentSubtitle.backgroundColor || "#4CAF50",
        opacity: isVisible ? 1 : 0,
        display: "inline",
        verticalAlign: "baseline"
      }}
    >
      {currentSubtitle.href ? (
        <a
          href={currentSubtitle.href}
          onClick={(e) => {
            e.preventDefault();
            currentSubtitle.href && scrollToSection(currentSubtitle.href);
          }}
          className={cn(
            "transition-colors hover:underline focus:outline-none",
            getTextColorClass(
              currentSubtitle.backgroundColor,
              currentSubtitle.textColor,
            ),
          )}
          style={{ display: "inline" }}
        >
          {currentText}
        </a>
      ) : (
        <span
          className={cn(
            getTextColorClass(
              currentSubtitle.backgroundColor,
              currentSubtitle.textColor,
            ),
          )}
          style={{ display: "inline" }}
        >
          {currentText}
        </span>
      )}
    </span>
  );
};

export default RotatingSubtitles;
