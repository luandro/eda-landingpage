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
    text: "buscar e escrever financiamentos",
    backgroundColor: "#4CAF50",
    textColor: "white" as const,
  },
  {
    text: "aprender com cursos online",
    backgroundColor: "#FF5722",
    textColor: "white" as const,
  },
  {
    text: "dominar novas ferramentas",
    backgroundColor: "#2196F3",
    textColor: "white" as const,
    href: "#tools",
  },
  {
    text: "desenvolver sua autonomia",
    backgroundColor: "#4CAF50",
    textColor: "white" as const,
    href: "#autonomy",
  },
];

const missionSubtitles = [
  {
    text: "revolucionar a defesa do meio ambiente",
    backgroundColor: "#4CAF50",
    textColor: "white" as const,
  },
  {
    text: "dar voz à natureza e seus defensores",
    backgroundColor: "#FF5722",
    textColor: "white" as const,
  },
  {
    text: "fortalecer a luta socioambiental",
    backgroundColor: "#2196F3",
    textColor: "white" as const,
    href: "#community",
  },
  {
    text: "democratizar o acesso à justiça ambiental",
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
    <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
      <DividingLine />
      <div className="mb-12 text-2xl md:text-3xl lg:text-4xl space-y-6 animate-fade-in transform translate-y-0 transition-transform duration-1000">
        <div className="h-[15vh] md:h-[34vh] font-bold text-eda-green items-start">
          <TypewriterText
            text={'Olá sou a <span style="color: orange;">EDA</span>! Uma assistente por voz para lhe auxiliar a...'}
            subtitles={subtitlesCases}
            rotationSpeed={4000}
            delay={50}
          />
        </div>
        <div className="h-[10vh] md:h-[34vh] font-bold text-eda-green">
          <TypewriterText
            text={'Fui desenvovida por uma [coligação de organizações](#about) para...'}
            subtitles={missionSubtitles}
            rotationSpeed={6000}
            initialDelay={8000}
            delay={50}
          />
        </div>
      </div>

      <div className="flex justify-center items-center animate-scale-in -mb-12">
        <AudioPlayer isPlaying={isPlaying} onPlay={onPlay} onPause={onPause} />
      </div>

      <div className="block animate-slide-in-right">
        <ExampleChat />
      </div>
    </div>
  );
};

export default HeroSection;
