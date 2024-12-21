import React, { useState, useEffect } from "react";
import RotatingSubtitles from "./RotatingSubtitles";
import { SubtitleItem } from "./RotatingSubtitles";

interface TypewriterTextProps {
  text: string;
  delay?: number;
  onComplete?: () => void;
  subtitles?: SubtitleItem[];
  showSubtitles?: boolean;
  rotationSpeed?: number;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  delay = 100,
  onComplete,
  subtitles = [],
  showSubtitles = false,
  rotationSpeed = 4000,
}) => {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showRotating, setShowRotating] = useState(false);

  // Find the placeholder position for subtitles
  const subtitlePlaceholder = "...";
  const parts = text.split(subtitlePlaceholder);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText((prevText) => prevText + text[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);

        // Check if we've reached the placeholder position
        if (text.substring(0, currentIndex + 1).includes(subtitlePlaceholder)) {
          setShowRotating(true);
        }
      }, delay);

      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, delay, text, onComplete]);

  // Split the current text at the placeholder position
  const currentParts = currentText.split(subtitlePlaceholder);

  return (
    <div className={`font-mono tabular-nums`}>
      {currentParts.map((part, index) => (
        <React.Fragment key={index}>
          {part}{''}
          {index < currentParts.length - 1 && showSubtitles && showRotating && (
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
