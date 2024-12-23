import React from "react";
import TypewriterText from "../TypewriterText";
import AudioPlayer from "../AudioPlayer";
import Features from "../Features";
import DividingLine from "../DividingLine";

interface FeaturesSectionProps {
  selectedFeature: number | null;
  onFeatureSelect: (featureId: number) => void;
  currentText: string;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  activeSection: number;
  isComplete?: boolean;
  onRestart?: () => void;
}

const subtitlesFeatures = [
  {
    text: "Voice Assistant",
    backgroundColor: "#FF5722",
    textColor: "white" as const,
  },
  {
    text: "Smart Analytics",
    backgroundColor: "#FFB74D",
    textColor: "white" as const,
  },
  {
    text: "Eco Tracking",
    backgroundColor: "#FF5722",
    textColor: "white" as const,
  },
];

const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  selectedFeature,
  onFeatureSelect,
  isPlaying,
  onPlay,
  onPause,
  currentText,
}) => {
  return (
    <div className="relative grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
      <DividingLine />
      <div className="mb-12 text-2xl md:text-3xl lg:text-4xl space-y-6 animate-fade-in transform translate-y-0 transition-transform duration-1000">
        <div className="h-[5vh] sm:h-[15vh] md:h-[15vh] font-bold text-eda-orange items-start">
          <TypewriterText
            text={currentText}
            subtitles={subtitlesFeatures}
            rotationSpeed={4000}
            delay={50}
          />
        </div>
      </div>

      <div className="flex justify-center items-center animate-scale-in mb-12 md:mb-0">
        <AudioPlayer isPlaying={isPlaying} onPlay={onPlay} onPause={onPause} />
      </div>

      <div className="block animate-slide-in-right h-[60vh]">
        <Features selectedFeature={selectedFeature} onFeatureSelect={onFeatureSelect} />
      </div>
    </div>
  );
};

export default FeaturesSection;
