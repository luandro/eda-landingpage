import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import RotatingTextAnimation from "./RotatingTextAnimation";

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
      <RotatingTextAnimation
        subtitle={currentSubtitle}
        isVisible={isVisible}
        typewriterEnabled={typewriterEnabled}
        typewriterDelay={typewriterDelay}
        onScrollToSection={scrollToSection}
      />
    </span>
  );
};

export default RotatingText;