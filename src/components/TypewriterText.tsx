import React, { useState, useEffect } from "react";
import RotatingText from "./RotatingText";
import { SubtitleItem } from "./RotatingText";
import TypewriterEffect from "./TypewriterEffect";
import { useNarrative } from "@/contexts/NarrativeContext";

interface TypewriterTextProps {
  text: string;
  defaultMarkdown?: string;
  rotatingText?: SubtitleItem[];
  rotationSpeed?: number;
  delay?: number;
  initialDelay?: number;
  onComplete?: () => void;
  animatedBar?: boolean;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  defaultMarkdown = "",
  rotatingText,
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
    audioRef,
  } = useNarrative();

  const displayText = isPlaying ? narrativeText : defaultMarkdown || text;
  const currentTime = audioRef.current?.currentTime || 0;

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      setHasStarted(true);
    }, initialDelay);

    return () => clearTimeout(startTimeout);
  }, [initialDelay]);

  if (!hasStarted) {
    return null;
  }

  const handleComplete = () => {
    setShowRotating(true);
    onComplete?.();
  };

  const getProgressBars = () => {
    return (
      <>
        <div
          className="absolute bottom-0 left-0 h-0.5 bg-blue-500/30 transition-all duration-1000 ease-linear rounded"
          style={{
            width: `${isComplete ? 100 : progress}%`,
            opacity: isPlaying ? 1 : 0,
          }}
        />
        <div
          className="absolute inset-0 left-0 bg-blue-500/10 transition-all duration-300 ease-linear rounded"
          style={{
            width: `${isComplete ? 100 : Math.min(100, progress * 1.2)}%`,
            opacity: isPlaying ? 1 : 0,
          }}
        />
      </>
    );
  };

  return (
    <div className="font-mono tabular-nums relative">
      {getProgressBars()}
      <div className="relative z-10">
        <TypewriterEffect
          text={displayText}
          delay={delay}
          onComplete={handleComplete}
          showCursor={false}
          currentTime={currentTime * 1000}
          startTime={0}
          endTime={audioRef.current?.duration ? audioRef.current.duration * 1000 : 0}
          className="[&_a]:text-white [&_a]:hover:text-white/80 [&_a]:transition-colors [&_a]:bg-blue-500 [&_a]:px-1 [&_a]:py-0.5 [&_a]:rounded"
        />
        {showRotating && !isPlaying && rotatingText?.length > 0 && (
          <RotatingText
            subtitles={rotatingText}
            rotationSpeed={rotationSpeed}
            className="ml-1 !rounded-none !px-1 !py-0 !inline"
            typewriterEnabled={true}
            typewriterDelay={delay}
          />
        )}
        {animatedBar && <span className="animate-blink">|</span>}
      </div>
    </div>
  );
};

export default TypewriterText;