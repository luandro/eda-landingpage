import React, { useState, useRef } from "react";
import TypewriterText from "../components/TypewriterText";
import RotatingSubtitles from "../components/RotatingSubtitles";
import AudioPlayer from "../components/AudioPlayer";
import { MessageSquare } from "lucide-react";

const subtitles = [
  {
    startTime: 0.76,
    endTime: 3.44,
    text: "Olá, meu nome é Eda.",
  },
  {
    startTime: 5.84,
    endTime: 13.6,
    text: "Sou uma assistente virtual de voz para Guardiões da Terra.",
  },
];

const ExampleChat = () => (
  <div className="bg-black/5 rounded-lg p-6 space-y-4 h-[600px] overflow-y-auto">
    <div className="flex items-start gap-4">
      <div className="bg-eda-green text-white p-2 rounded-full">
        <MessageSquare size={20} />
      </div>
      <div className="flex-1 bg-white rounded-lg p-4 shadow-sm">
        <p className="text-sm">Como posso ajudar a proteger o meio ambiente?</p>
      </div>
    </div>
    <div className="flex items-start gap-4 flex-row-reverse">
      <div className="bg-eda-orange text-white p-2 rounded-full">
        <MessageSquare size={20} />
      </div>
      <div className="flex-1 bg-eda-orange/10 rounded-lg p-4 shadow-sm">
        <p className="text-sm">Existem várias maneiras de proteger o meio ambiente! Você pode começar reduzindo seu consumo de plástico, economizando água e energia, reciclando corretamente, e apoiando iniciativas locais de conservação.</p>
      </div>
    </div>
  </div>
);

const Index = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentText, setCurrentText] = useState("Olá, meu nome é Eda");
  const [showRotatingSubtitles, setShowRotatingSubtitles] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
      setShowRotatingSubtitles(false);
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setShowRotatingSubtitles(true);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentTime = audioRef.current.currentTime;
      const currentSubtitle = subtitles.find(
        (subtitle) =>
          currentTime >= subtitle.startTime && currentTime <= subtitle.endTime
      );
      if (currentSubtitle) {
        setCurrentText(currentSubtitle.text);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-eda-green-light/10 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Left Column - Text */}
          <div className="space-y-6">
            <div className="text-4xl md:text-6xl font-bold text-eda-green">
              <TypewriterText text={currentText} />
            </div>
            {showRotatingSubtitles && <RotatingSubtitles />}
          </div>

          {/* Center Column - Play Button */}
          <div className="flex justify-center items-center">
            <AudioPlayer
              isPlaying={isPlaying}
              onPlay={handlePlay}
              onPause={handlePause}
            />
          </div>

          {/* Right Column - Example Chat */}
          <div className="hidden md:block">
            <ExampleChat />
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => {
          setIsPlaying(false);
          setShowRotatingSubtitles(true);
        }}
      >
        <source src="/path-to-your-audio.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default Index;