import React from "react";
import TypewriterText from "../TypewriterText";
import AudioPlayer from "../AudioPlayer";
import ExampleChat from "../ExampleChat";

interface HeroSectionProps {
  currentText: string;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  activeSection: number;
}

const subtitles = [
  {
    text: "Protegendo nossa casa comum",
    backgroundColor: "#4CAF50",
    textColor: "white" as const,
  },
  {
    text: "Defendendo os direitos da natureza",
    backgroundColor: "#FF5722",
    textColor: "white" as const,
  },
  {
    text: "Unindo vozes pela Terra",
    backgroundColor: "#2196F3",
    textColor: "white" as const,
    href: "#community",
  },
  {
    text: "Construindo um futuro sustentável",
    backgroundColor: "#4CAF50",
    textColor: "white" as const,
    href: "#sustainability",
  },
];

const HeroSection: React.FC<HeroSectionProps> = ({
  isPlaying,
  onPlay,
  onPause,
  activeSection,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
      <div className="space-y-6 animate-fade-in transform translate-y-0 transition-transform duration-1000">
        <div className="md:-mt-48 text-4xl md:text-6xl font-bold text-eda-green h-[15vh] md:h-[32vh] items-start">
          <TypewriterText
            text={'Olá sou a Eda'}
            subtitles={subtitles}
            rotationSpeed={4000}
          />
        </div>
        <div className="text-4xl md:text-6xl font-bold text-eda-green h-[10vh]">
          <TypewriterText
            text={'Sua assistente por voz para'}
            subtitles={subtitles}
            rotationSpeed={4000}
          />
        </div>
      </div>

      <div className="flex justify-center items-center animate-scale-in">
        <AudioPlayer isPlaying={isPlaying} onPlay={onPlay} onPause={onPause} />
      </div>

      <div className="block animate-slide-in-right">
        <ExampleChat />
      </div>
    </div>
  );
};

export default HeroSection;
