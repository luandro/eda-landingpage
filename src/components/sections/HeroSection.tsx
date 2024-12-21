import React from "react";
import TypewriterText from "../TypewriterText";
import RotatingSubtitles from "../RotatingSubtitles";
import AudioPlayer from "../AudioPlayer";
import ExampleChat from "../ExampleChat";
import { motion } from "framer-motion";

interface HeroSectionProps {
  currentText: string;
  isPlaying: boolean;
  showRotatingSubtitles: boolean;
  onPlay: () => void;
  onPause: () => void;
  activeSection: number;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  currentText,
  isPlaying,
  showRotatingSubtitles,
  onPlay,
  onPause,
  activeSection,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
      <div className="space-y-6 animate-fade-in transform translate-y-0 transition-transform duration-1000">
        <div className="text-4xl md:text-6xl font-bold text-eda-green">
          <TypewriterText text={currentText} />
        </div>
        {showRotatingSubtitles && <RotatingSubtitles />}
      </div>

      <div className="flex justify-center items-center animate-scale-in">
        <AudioPlayer isPlaying={isPlaying} onPlay={onPlay} onPause={onPause} />
      </div>

      <div className="block animate-slide-in-right">
        <ExampleChat />
      </div>

      <div
        className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-white/20"
        style={{
          transform: `translateY(${(1 - activeSection) * 20}%)`,
          transition: "transform 0.8s ease-in-out",
        }}
      />
    </div>
  );
};

export default HeroSection;