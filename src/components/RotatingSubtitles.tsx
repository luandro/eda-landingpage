import React, { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface SubtitleLink {
  subtitle: string;
  href: string;
}

interface RotatingSubtitlesProps {
  subtitles: string[];
  rotationSpeed?: number;
  backgroundColor?: string;
  textColor?: "white" | "dark";
  links?: SubtitleLink[];
  className?: string;
}

const RotatingSubtitles: React.FC<RotatingSubtitlesProps> = ({
  subtitles,
  rotationSpeed = 3000,
  backgroundColor = "#4CAF50",
  textColor = "white",
  links = [],
  className,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Function to determine if current subtitle is clickable
  const getCurrentLink = useCallback(() => {
    return links.find((link) => link.subtitle === subtitles[currentIndex]);
  }, [links, currentIndex, subtitles]);

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

  useEffect(() => {
    const transitionDuration = 500; // Duration of fade transition in ms

    const intervalId = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % subtitles.length);
        setIsVisible(true);
      }, transitionDuration);
    }, rotationSpeed);

    return () => {
      clearInterval(intervalId);
    };
  }, [rotationSpeed, subtitles.length]);

  // Calculate contrast color for text
  const getTextColorClass = () => {
    if (textColor === "white") return "text-white";
    if (textColor === "dark") return "text-gray-900";
    
    // Auto calculate based on background color
    const r = parseInt(backgroundColor.slice(1, 3), 16);
    const g = parseInt(backgroundColor.slice(3, 5), 16);
    const b = parseInt(backgroundColor.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    return brightness > 128 ? "text-gray-900" : "text-white";
  };

  const currentLink = getCurrentLink();
  const subtitle = subtitles[currentIndex];

  return (
    <div 
      className={cn(
        "h-8 flex items-center justify-center px-4 py-6 rounded-md",
        className
      )}
      style={{ backgroundColor }}
    >
      {currentLink ? (
        <button
          onClick={() => scrollToSection(currentLink.href)}
          className={cn(
            "transition-opacity duration-500 hover:underline focus:outline-none",
            getTextColorClass(),
            isVisible ? "opacity-100" : "opacity-0"
          )}
        >
          {subtitle}
        </button>
      ) : (
        <p
          className={cn(
            "transition-opacity duration-500",
            getTextColorClass(),
            isVisible ? "opacity-100" : "opacity-0"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default RotatingSubtitles;