import React from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCw } from "lucide-react";
import TypewriterText from "../TypewriterText";
import { motion } from "framer-motion";

interface HeroSectionProps {
  currentText: string;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  activeSection: number;
  isComplete?: boolean;
  onRestart?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  currentText,
  isPlaying,
  onPlay,
  onPause,
  activeSection,
  isComplete,
  onRestart,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: activeSection === 0 ? 1 : 0, y: activeSection === 0 ? 0 : 20 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <h1 className="text-4xl md:text-6xl font-bold">
          Interactive Experience
        </h1>
        
        <div className="max-w-2xl mx-auto">
          <TypewriterText
            text={currentText}
            subtitles={[
              { text: "Welcome!" },
              { text: "Let's begin..." },
              { text: "Are you ready?" },
            ]}
          />
        </div>

        <Button
          onClick={isComplete ? onRestart : (isPlaying ? onPause : onPlay)}
          size="lg"
          className="animate-fade-in"
        >
          {isComplete ? (
            <>
              <RotateCw className="mr-2" />
              Restart
            </>
          ) : isPlaying ? (
            <>
              <Pause className="mr-2" />
              Pause
            </>
          ) : (
            <>
              <Play className="mr-2" />
              Play
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
};

export default HeroSection;