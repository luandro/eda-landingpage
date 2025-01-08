import React from 'react';
import { cn } from "@/lib/utils";
import TypewriterEffect from "./TypewriterEffect";
import { SubtitleItem } from "./RotatingText";

interface RotatingTextAnimationProps {
  subtitle: SubtitleItem;
  isVisible: boolean;
  typewriterEnabled: boolean;
  typewriterDelay: number;
  onScrollToSection?: (href: string) => void;
}

const RotatingTextAnimation: React.FC<RotatingTextAnimationProps> = ({
  subtitle,
  isVisible,
  typewriterEnabled,
  typewriterDelay,
  onScrollToSection,
}) => {
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

  const content = typewriterEnabled ? (
    <TypewriterEffect
      text={subtitle.text}
      delay={typewriterDelay}
      showCursor={false}
    />
  ) : (
    subtitle.text
  );

  if (subtitle.href) {
    return (
      <a
        href={subtitle.href}
        onClick={(e) => {
          e.preventDefault();
          if (subtitle.href && onScrollToSection) {
            onScrollToSection(subtitle.href);
          }
        }}
        className={cn(
          "transition-colors hover:underline focus:outline-none",
          getTextColorClass(subtitle.backgroundColor, subtitle.textColor),
        )}
        style={{ display: "inline" }}
      >
        {content}
      </a>
    );
  }

  return (
    <span
      className={cn(
        getTextColorClass(subtitle.backgroundColor, subtitle.textColor),
      )}
      style={{ display: "inline" }}
    >
      {content}
    </span>
  );
};

export default RotatingTextAnimation;