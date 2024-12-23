import React, { useState, useEffect } from "react";
import RotatingSubtitles from "./RotatingSubtitles";
import { SubtitleItem } from "./RotatingSubtitles";
import { useNarrative } from "@/contexts/NarrativeContext";

interface TypewriterTextProps {
  text: string;
  subtitles: SubtitleItem[];
  rotationSpeed?: number;
  delay?: number;
  initialDelay?: number;
  onComplete?: () => void;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  subtitles,
  rotationSpeed = 4000,
  delay = 100,
  initialDelay = 0,
  onComplete,
}) => {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showRotating, setShowRotating] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const { progress, isComplete } = useNarrative();

  // Split the text into parts (before and after the first period)
  const processedText = text
    .replace(/\[(.*?)\]\((.*?)\)/g, (_, text, url) => `<a href="${url}">${text}</a>`)
    .split(".")[0] + "... " + (text.split(".")[1] || "");

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      setHasStarted(true);
    }, initialDelay);

    return () => clearTimeout(startTimeout);
  }, [initialDelay]);

  useEffect(() => {
    if (!hasStarted) return;

    if (currentIndex < processedText.length) {
      const timeout = setTimeout(() => {
        setCurrentText((prevText) => prevText + processedText[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);

        // Show subtitles when we reach the "..."
        if (processedText.substring(0, currentIndex + 1).includes("...")) {
          setShowRotating(true);
        }
      }, delay);

      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, delay, processedText, onComplete, hasStarted]);

  // Split the current text at the "..." position
  const currentParts = currentText.split("...");

  return (
    <div className="font-mono tabular-nums relative">
      <div 
        className="absolute inset-0 bg-blue-500/10 transition-all duration-300 ease-linear rounded"
        style={{
          width: `${isComplete ? 100 : progress}%`,
        }}
      />
      <div className="relative z-10">
        {currentParts.map((part, index) => (
          <React.Fragment key={index}>
            <span
              dangerouslySetInnerHTML={{
                __html: part,
              }}
              className="[&_a]:text-white [&_a]:hover:text-white/80 [&_a]:transition-colors [&_a]:bg-blue-500 [&_a]:px-1 [&_a]:py-0.5 [&_a]:rounded"
            />
            {index < currentParts.length - 1 && showRotating && (
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
        <span className="animate-blink">|</span>
      </div>
    </div>
  );
};

export default TypewriterText;