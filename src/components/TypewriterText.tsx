import React, { useState, useEffect } from "react";
import RotatingSubtitles from "./RotatingSubtitles";
import { SubtitleItem } from "./RotatingSubtitles";
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
  console.log('TypewriterText props:', { text, defaultMarkdown, rotatingText, rotationSpeed, delay, initialDelay, animatedBar });

  const [showRotating, setShowRotating] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const {
    progress,
    isComplete,
    isPlaying,
    currentText: narrativeText,
  } = useNarrative();

  console.log('TypewriterText state:', { showRotating, hasStarted, progress, isComplete, isPlaying, narrativeText });

  // Use SRT data when playing, defaultMarkdown when not playing
  const displayText = isPlaying ? narrativeText : defaultMarkdown || text;
  console.log('Display text:', { displayText, isPlaying });

  useEffect(() => {
    console.log('Setting up initial delay timer:', { initialDelay });
    const startTimeout = setTimeout(() => {
      console.log('Initial delay complete, setting hasStarted to true');
      setHasStarted(true);
    }, initialDelay);

    return () => {
      console.log('Cleaning up initial delay timer');
      clearTimeout(startTimeout);
    };
  }, [initialDelay]);

  if (!hasStarted) {
    console.log('Component not started yet, returning null');
    return null;
  }

  const handleComplete = () => {
    console.log('TypewriterEffect complete, enabling rotating subtitles');
    setShowRotating(true);
    onComplete?.();
  };

  console.log('Current text:', displayText);

  const getProgressBars = () => {
    console.log('Progress bars:', {
      isComplete,
      progress,
      isPlaying,
      calculatedWidth: `${isComplete ? 100 : progress}%`,
      calculatedOpacity: isPlaying ? 1 : 0
    });

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
          className="[&_a]:text-white [&_a]:hover:text-white/80 [&_a]:transition-colors [&_a]:bg-blue-500 [&_a]:px-1 [&_a]:py-0.5 [&_a]:rounded"
        />
        {showRotating && !isPlaying && rotatingText?.length > 0 && (
          <RotatingSubtitles
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
