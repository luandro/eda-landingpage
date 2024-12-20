import React, { useState, useEffect } from "react";

interface TypewriterTextProps {
  text: string;
  delay?: number;
  onComplete?: () => void;
  isUnwriting?: boolean;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  delay = 100,
  onComplete,
  isUnwriting = false,
}) => {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (isUnwriting) {
      if (currentText.length > 0) {
        const timeout = setTimeout(() => {
          setCurrentText((prevText) => prevText.slice(0, -1));
        }, delay);
        return () => clearTimeout(timeout);
      } else if (onComplete) {
        onComplete();
      }
    } else {
      if (currentIndex < text.length) {
        const timeout = setTimeout(() => {
          setCurrentText((prevText) => prevText + text[currentIndex]);
          setCurrentIndex((prevIndex) => prevIndex + 1);
        }, delay);
        return () => clearTimeout(timeout);
      } else if (onComplete) {
        onComplete();
      }
    }
  }, [currentIndex, delay, text, onComplete, isUnwriting, currentText]);

  return (
    <div className="font-mono relative overflow-hidden">
      <div className={`${isUnwriting ? "animate-unwrite" : "animate-write"}`}>
        {currentText}
        <span className="animate-blink">|</span>
      </div>
    </div>
  );
};

export default TypewriterText;