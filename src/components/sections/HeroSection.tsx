import React from "react";
import TypewriterText from "../TypewriterText";
import AudioPlayer from "../AudioPlayer";
import ExampleChat from "../ExampleChat";
import DividingLine from "../DividingLine";

interface HeroSectionProps {
  currentText: string;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  activeSection: number;
}

const subtitlesCases = [
  {
    text: "a desenvolver projetos",
    backgroundColor: "#4CAF50",
    textColor: "white" as const,
    href: "#/category/3",

  },
  {
    text: "com cursos online",
    backgroundColor: "#FF5722",
    textColor: "white" as const,
    href: "#/category/3",
  },
  {
    text: "a dominar novas ferramentas",
    backgroundColor: "#2196F3",
    textColor: "white" as const,
    href: "#/category/3",
  },
  {
    text: "a desenvolver sua autonomia",
    backgroundColor: "#4CAF50",
    textColor: "white" as const,
    href: "#/category/3",
  },
];

const subtitlesFeatures = [
  {
    text: "por WhatsApp",
    backgroundColor: "#4CAF50",
    textColor: "white" as const,
  },
  {
    text: "de voz",
    backgroundColor: "#FF5722",
    textColor: "white" as const,
  },
  {
    text: "de IA",
    backgroundColor: "#2196F3",
    textColor: "white" as const,
    href: "#community",
  },
  {
    text: "super acessível",
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
    <div className="relative grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
      <DividingLine />
      <div className="mb-12 text-2xl md:text-3xl lg:text-4xl space-y-6 animate-fade-in transform translate-y-0 transition-transform duration-1000">
        <div className="h-[17vh] sm:h-[15vh] md:h-[15vh] font-bold text-eda-green items-start">
          <TypewriterText
            text={'Olá sou a <span style="color: orange;">EDA</span>! Uma assistente...'}
            subtitles={subtitlesFeatures}
            rotationSpeed={4000}
            delay={50}
          />
        </div>
        <div className="h-[17vh] sm:h-[15vh] md:h-[15vh] font-bold text-eda-green">
          <TypewriterText
            text={'Fui desenvovida por uma [ aliança de organizações](#about) para te auxiliar...'}
            subtitles={subtitlesCases}
            rotationSpeed={8000}
            initialDelay={6000}
            delay={50}
          />
        </div>
      </div>

      <div className="flex justify-center items-center animate-scale-in -mb-12 md:mb-0">
        <AudioPlayer isPlaying={isPlaying} onPlay={onPlay} onPause={onPause} />
      </div>

      <div className="block animate-slide-in-right">
        <ExampleChat />
      </div>
    </div>
  );
};

export default HeroSection;
