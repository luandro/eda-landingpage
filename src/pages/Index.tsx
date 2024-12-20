import React, { useState, useRef } from "react";
import TypewriterText from "../components/TypewriterText";
import RotatingSubtitles from "../components/RotatingSubtitles";
import AudioPlayer from "../components/AudioPlayer";
import ExampleChat from "../components/ExampleChat";
import UseCases from "../components/UseCases";
import { useSmoothScroll } from "../hooks/useSmoothScroll";

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

const Index = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentText, setCurrentText] = useState("Olá, meu nome é Eda");
  const [showRotatingSubtitles, setShowRotatingSubtitles] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { activeSection, sectionsRef, scrollToSection } = useSmoothScroll({
    threshold: 50,
    animationDuration: 800,
  });

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
    <div className="min-h-screen overflow-hidden">
      {/* Navigation Dots */}
      <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-50 space-y-2">
        {[0, 1].map((index) => (
          <button
            key={index}
            onClick={() => scrollToSection(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              activeSection === index
                ? "bg-eda-green scale-125"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Go to section ${index + 1}`}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section
        ref={(el: HTMLDivElement | null) => {
          if (el) sectionsRef.current[0] = el;
        }}
        className={`min-h-screen relative flex items-center justify-center transition-opacity duration-1000 ${
          activeSection === 0 ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="space-y-6 animate-fade-in transform translate-y-0 transition-transform duration-1000">
              <div className="text-4xl md:text-6xl font-bold text-eda-green">
                <TypewriterText text={currentText} />
              </div>
              {showRotatingSubtitles && <RotatingSubtitles />}
            </div>

            <div className="flex justify-center items-center animate-scale-in">
              <AudioPlayer
                isPlaying={isPlaying}
                onPlay={handlePlay}
                onPause={handlePause}
              />
            </div>

            <div className="block animate-slide-in-right">
              <ExampleChat />
            </div>
          </div>
        </div>
        <div 
          className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-white/20"
          style={{
            transform: `translateY(${(1 - activeSection) * 20}%)`,
            transition: 'transform 0.8s ease-in-out'
          }}
        />
      </section>

      {/* Features Section */}
      <section
        ref={(el: HTMLDivElement | null) => {
          if (el) sectionsRef.current[1] = el;
        }}
        className={`min-h-screen relative flex items-center justify-center transition-opacity duration-1000 ${
          activeSection === 1 ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="space-y-6 animate-fade-in transform translate-y-0 transition-transform duration-1000">
              <h2 className="text-4xl md:text-6xl font-bold text-eda-green">
                Explore Nossos Serviços
              </h2>
              <p className="text-lg text-gray-600">
                Descubra como a Eda pode ajudar você a fazer a diferença no mundo.
              </p>
            </div>

            <div className="flex justify-center items-center animate-scale-in">
              <AudioPlayer
                isPlaying={isPlaying}
                onPlay={handlePlay}
                onPause={handlePause}
              />
            </div>

            <div className="block animate-slide-in-right">
              <UseCases />
            </div>
          </div>
        </div>
        <div 
          className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-white/20"
          style={{
            transform: `translateY(${activeSection * 20}%)`,
            transition: 'transform 0.8s ease-in-out'
          }}
        />
      </section>

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