import React, { useState, useEffect } from "react";
import RotatingSubtitles from "./RotatingSubtitles";
import { SubtitleItem } from "./RotatingSubtitles";

interface TypewriterTextProps {
  text: string;
  subtitles: SubtitleItem[];
  rotationSpeed?: number;
  delay?: number;
  onComplete?: () => void;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  subtitles,
  rotationSpeed = 4000,
  delay = 100,
  onComplete,
}) => {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showRotating, setShowRotating] = useState(false);

  // Split the text into parts (before and after the first period)
  const processedText = `${text.split(".")[0]}... ${text.split(".")[1] || ""}`;

  useEffect(() => {
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
  }, [currentIndex, delay, processedText, onComplete]);

  // Split the current text at the "..." position
  const currentParts = currentText.split("...");

  return (
    <div className="font-mono tabular-nums">
      {currentParts.map((part, index) => (
        <React.Fragment key={index}>
          {part}
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
  );
};

export default TypewriterText;
