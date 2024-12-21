import React, { useState, useEffect } from "react";
import RotatingSubtitles from "./RotatingSubtitles";
import { SubtitleItem } from "./RotatingSubtitles";

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

  // Split the text into parts (before and after the first period)
  const processedText = text.replace(/\[(.*?)\]\((.*?)\)/g, (_, text, url) => `<a href="${url}">${text}</a>`).split(".")[0] + "... " + (text.split(".")[1] || "");

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
    <div className="font-mono tabular-nums">
      {currentParts.map((part, index) => (
        <React.Fragment key={index}>
          <span
            dangerouslySetInnerHTML={{
              __html: part
            }}
            className="[&_a]:text-eda-green [&_a]:underline [&_a]:hover:text-eda-green/80 [&_a]:transition-colors"
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
  );
};

export default TypewriterText;
