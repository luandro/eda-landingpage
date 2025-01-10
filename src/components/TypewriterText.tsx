import React from "react";
import { SubtitleItem } from "./RotatingText";
import TypewriterEffect from "./TypewriterEffect";
import { ProgressBars } from "./ui/progress-bars";
import RotatingTextWrapper from "./RotatingTextWrapper";
import { useTypewriterState } from "@/hooks/useTypewriterState";

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
  console.log('TypewriterText props:', { text, defaultMarkdown, rotatingText, rotationSpeed, delay, initialDelay, animatedBar });

  const {
    showRotating,
    setShowRotating,
    hasStarted,
    progress,
    isComplete,
    isPlaying,
    narrativeText,
    getCurrentTime,
    getEndTime,
  } = useTypewriterState(initialDelay);

  const displayText = isPlaying ? narrativeText : defaultMarkdown || text;
  console.log('Display text:', { displayText, isPlaying });

  if (!hasStarted) {
    console.log('Component not started yet, returning null');
    return null;
  }

  const handleComplete = () => {
    console.log('TypewriterEffect complete, enabling rotating subtitles');
    setShowRotating(true);
    onComplete?.();
  };

  return (
    <div className="font-mono tabular-nums relative">
      <ProgressBars
        isComplete={isComplete}
        progress={progress}
        isPlaying={isPlaying}
      />
      <div className="relative z-10">
        <TypewriterEffect
          text={displayText}
          delay={delay}
          onComplete={handleComplete}
          showCursor={false}
          currentTime={getCurrentTime()}
          startTime={0}
          endTime={getEndTime()}
          className="[&_a]:text-white [&_a]:hover:text-white/80 [&_a]:transition-colors [&_a]:bg-blue-500 [&_a]:px-1 [&_a]:py-0.5 [&_a]:rounded"
        />
        <RotatingTextWrapper
          show={showRotating && !isPlaying}
          subtitles={rotatingText || []}
          rotationSpeed={rotationSpeed}
          delay={delay}
        />
        {animatedBar && <span className="animate-blink">|</span>}
      </div>
    </div>
  );
};

export default TypewriterText;