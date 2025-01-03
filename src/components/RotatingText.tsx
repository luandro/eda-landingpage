import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import TypewriterEffect from "./TypewriterEffect";

export interface SubtitleItem {
  text: string;
  backgroundColor?: string;
  textColor?: "white" | "dark";
  href?: string;
}

interface RotatingTextProps {
  subtitles: SubtitleItem[];
  rotationSpeed?: number;
  className?: string;
  typewriterEnabled?: boolean;
  typewriterDelay?: number;
}

const RotatingText: React.FC<RotatingTextProps> = ({
  subtitles,
  rotationSpeed = 4000,
  className,
  typewriterEnabled = false,
  typewriterDelay = 100,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  useEffect(() => {
    const transitionDuration = 500;

    const intervalId = setInterval(() => {
      setIsVisible(false);

      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % subtitles.length);
        setIsVisible(true);
      }, transitionDuration);
    }, rotationSpeed);

    return () => clearInterval(intervalId);
  }, [rotationSpeed, subtitles.length]);

  const getTextColorClass = (
    backgroundColor?: string,
    textColor?: "white" | "dark",
  ) => {
    if (textColor === "white") return "text-white";
    if (textColor === "dark") return "text-gray-900";
    if (!backgroundColor) return "text-white";

    const r = parseInt(backgroundColor.slice(1, 3), 16);
    const g = parseInt(backgroundColor.slice(3, 5), 16);
    const b = parseInt(backgroundColor.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    return brightness > 128 ? "text-gray-900" : "text-white";
  };

  const currentSubtitle = subtitles[currentIndex];

  return (
    <span
      className={cn("transition-all duration-500", className)}
      style={{
        backgroundColor: currentSubtitle.backgroundColor || "#4CAF50",
        opacity: isVisible ? 1 : 0,
        display: "inline-block",
        verticalAlign: "baseline",
        lineHeight: "inherit",
      }}
    >
      {currentSubtitle.href ? (
        <a
          href={currentSubtitle.href}
          onClick={(e) => {
            e.preventDefault();
            if (currentSubtitle.href) {
              scrollToSection(currentSubtitle.href);
            }
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
          {typewriterEnabled ? (
            <TypewriterEffect
              text={currentSubtitle.text}
              delay={typewriterDelay}
              showCursor={false}
            />
          ) : (
            currentSubtitle.text
          )}
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
          {typewriterEnabled ? (
            <TypewriterEffect
              text={currentSubtitle.text}
              delay={typewriterDelay}
              showCursor={false}
            />
          ) : (
            currentSubtitle.text
          )}
        </span>
      )}
    </span>
  );
};

export default RotatingText;
