import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCw } from "lucide-react";
import TypewriterText from "../TypewriterText";
import ExampleChat from "../ExampleChat";
import DividingLine from "../DividingLine";
import AudioPlayer from "../AudioPlayer";
import { useSRTScroll } from "@/hooks/useSRTScroll";
import { parseSRT } from "@/utils/srtParser";

interface HeroSectionProps {
  currentTime: number;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  isComplete?: boolean;
  onRestart?: () => void;
}

// Define section mappings for SRT subtitles
const sectionMapping = {
  1: 0, // First subtitle maps to first section
  2: 1, // Second subtitle maps to second section
  3: 2, // Third subtitle maps to third section
  4: 3, // Fourth subtitle maps to fourth section
};

// Default texts when no subtitle is active
const defaultTexts = [
  "Explore nossa plataforma",
  "Descubra novos recursos",
  "Conecte-se com a comunidade",
  "Comece sua jornada",
];

const HeroSection: React.FC<HeroSectionProps> = ({
  currentTime,
  isPlaying,
  onPlay,
  onPause,
  isComplete,
  onRestart,
}) => {
  const [subtitles, setSubtitles] = useState([]);

  useEffect(() => {
    // Load and parse SRT file
    fetch("/subtitles.srt")
      .then((response) => response.text())
      .then((content) => {
        const parsed = parseSRT(content);
        setSubtitles(parsed);
      });
  }, []);

  const { currentSubtitle, activeSection, sectionsRef, getCurrentText } =
    useSRTScroll({
      subtitles,
      currentTime,
      sectionMapping,
      defaultTexts,
    });

  return (
    <div
      className="relative grid grid-cols-1 md:grid-cols-3 gap-2 items-center"
      ref={(el) => (sectionsRef.current[0] = el)}
    >
      <DividingLine />
      <div className="mb-12 text-2xl md:text-3xl lg:text-4xl space-y-6 animate-fade-in transform translate-y-0 transition-transform duration-1000">
        <div className="h-[17vh] sm:h-[15vh] md:h-[15vh] font-bold text-eda-green items-start">
          <TypewriterText
            text={getCurrentText(activeSection)}
            delay={50}
            key={getCurrentText(activeSection)} // Force re-render on text change
          />
        </div>
        {!isPlaying && (
          <div className="text-md h-[7vh] sm:h-[15vh] md:h-[15vh] text-eda-green">
            <TypewriterText
              text={"Aperte o Play para iniciar"}
              initialDelay={1000}
              delay={50}
              animatedBar={false}
            />
          </div>
        )}
      </div>

      <div
        className="flex justify-center items-center animate-scale-in -mb-12 md:mb-0"
        ref={(el) => (sectionsRef.current[1] = el)}
      >
        <AudioPlayer
          isPlaying={isPlaying}
          onPlay={onPlay}
          onPause={onPause}
          isComplete={isComplete}
          onRestart={onRestart}
        />
      </div>

      <div
        className="block animate-slide-in-right"
        ref={(el) => (sectionsRef.current[2] = el)}
      >
        <ExampleChat />
      </div>
    </div>
  );
};

export default HeroSection;
