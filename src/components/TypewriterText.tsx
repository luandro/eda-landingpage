import React, { useState, useEffect } from "react";
import RotatingSubtitles from "./RotatingSubtitles";
import { SubtitleItem } from "./RotatingSubtitles";
import TypewriterEffect from "./TypewriterEffect";
import { useNarrative } from "@/contexts/NarrativeContext";

interface TypewriterTextProps {
  text: string;
  subtitles?: SubtitleItem[];
  rotationSpeed?: number;
  delay?: number;
  initialDelay?: number;
  onComplete?: () => void;
  animatedBar?: boolean;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  subtitles,
  rotationSpeed = 4000,
  delay = 100,
  initialDelay = 0,
  onComplete,
  animatedBar = true,
}) => {
  const [showRotating, setShowRotating] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const {
    progress,
    isComplete,
    isPlaying,
    currentText: narrativeText,
  } = useNarrative();

  const displayText = isPlaying ? narrativeText : text;
  const processedText =
    displayText
      .replace(
        /\[(.*?)\]\((.*?)\)/g,
        (_, text, url) => `<a href="${url}">${text}</a>`,
      )
      .split(".")[0] +
    "... " +
    (isPlaying ? narrativeText.split(".")[1] || "" : text.split(".")[1] || "");

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      setHasStarted(true);
    }, initialDelay);

    return () => clearTimeout(startTimeout);
  }, [initialDelay]);

  if (!hasStarted) return null;

  const handleComplete = () => {
    setShowRotating(true);
    onComplete?.();
  };

  const currentParts = processedText.split("...");

  return (
    <div className="font-mono tabular-nums relative">
      <div
        className="absolute inset-0 bg-blue-500/10 transition-all duration-300 ease-linear rounded"
        style={{
          width: `${isComplete ? 100 : progress}%`,
          opacity: isPlaying ? 1 : 0,
        }}
      />
      <div className="relative z-10">
        {currentParts.map((part, index) => (
          <React.Fragment key={index}>
            <TypewriterEffect
              text={part}
              delay={delay}
              onComplete={handleComplete}
              showCursor={false}
              className="[&_a]:text-white [&_a]:hover:text-white/80 [&_a]:transition-colors [&_a]:bg-blue-500 [&_a]:px-1 [&_a]:py-0.5 [&_a]:rounded"
            />
            {index < currentParts.length - 1 &&
              showRotating &&
              !isPlaying &&
              subtitles?.length > 0 && (
                <RotatingSubtitles
                  subtitles={subtitles}
                  rotationSpeed={rotationSpeed}
                  className="ml-1 !rounded-none !px-1 !py-0 !inline"
                  typewriterEnabled={true}
                  typewriterDelay={delay}
                />
              )}
          </React.Fragment>
        ))}
        {animatedBar && <span className="animate-blink">|</span>}
      </div>
    </div>
  );
};

export default TypewriterText;
