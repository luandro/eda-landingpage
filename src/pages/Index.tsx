import React, { useState, useRef } from "react";
import { ArrowLeft, Mail, Phone, Globe, Github } from "lucide-react";
import TypewriterText from "../components/TypewriterText";
import RotatingSubtitles from "../components/RotatingSubtitles";
import AudioPlayer from "../components/AudioPlayer";
import ExampleChat from "../components/ExampleChat";
import UseCases from "../components/UseCases";
import { useSmoothScroll } from "../hooks/useSmoothScroll";
import { Button } from "@/components/ui/button";

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

const categories = [
  { id: 1, title: "Sustentabilidade", description: "Práticas sustentáveis e conservação" },
  { id: 2, title: "Educação", description: "Recursos educacionais ambientais" },
  { id: 3, title: "Comunidade", description: "Iniciativas comunitárias" },
  { id: 4, title: "Inovação", description: "Soluções tecnológicas verdes" },
];

const Index = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentText, setCurrentText] = useState("Olá, meu nome é Eda");
  const [showRotatingSubtitles, setShowRotatingSubtitles] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
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

  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategory(categoryId);
  };

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Navigation Dots */}
      <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-50 space-y-2">
        {[0, 1, 2].map((index) => (
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

      {/* Categories Section */}
      <section
        ref={(el: HTMLDivElement | null) => {
          if (el) sectionsRef.current[1] = el;
        }}
        className={`min-h-screen relative flex items-center justify-center transition-all duration-1000 ${
          activeSection === 1 ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="container mx-auto px-4 py-12">
          <div className="relative w-full h-full">
            {/* Categories Grid */}
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-transform duration-500 ${
              selectedCategory !== null ? "-translate-x-full" : "translate-x-0"
            }`}>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  className="group p-6 bg-white/5 rounded-lg border border-gray-200 hover:border-eda-green transition-all duration-300 text-left"
                  aria-label={`Select ${category.title} category`}
                >
                  <h3 className="text-xl font-semibold text-eda-green mb-2 group-hover:translate-x-2 transition-transform">
                    {category.title}
                  </h3>
                  <p className="text-gray-600">{category.description}</p>
                </button>
              ))}
            </div>

            {/* Chat Interface */}
            <div className={`absolute top-0 left-0 w-full h-full transition-transform duration-500 ${
              selectedCategory !== null ? "translate-x-0" : "translate-x-full"
            }`}>
              <div className="relative h-full bg-white p-6 rounded-lg shadow-lg">
                <Button
                  variant="ghost"
                  onClick={() => setSelectedCategory(null)}
                  className="absolute top-4 left-4"
                  aria-label="Go back to categories"
                >
                  <ArrowLeft className="mr-2" />
                  Voltar
                </Button>
                <ExampleChat />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        ref={(el: HTMLDivElement | null) => {
          if (el) sectionsRef.current[2] = el;
        }}
        className={`min-h-screen relative flex items-center justify-center bg-gradient-to-b from-white to-gray-50 transition-opacity duration-1000 ${
          activeSection === 2 ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8 animate-fade-in">
              <h2 className="text-3xl font-bold text-eda-green mb-6">Entre em Contato</h2>
              <div className="space-y-4">
                <a href="mailto:contact@example.com" className="flex items-center space-x-3 text-gray-600 hover:text-eda-green transition-colors">
                  <Mail className="h-5 w-5" />
                  <span>contact@example.com</span>
                </a>
                <a href="tel:+123456789" className="flex items-center space-x-3 text-gray-600 hover:text-eda-green transition-colors">
                  <Phone className="h-5 w-5" />
                  <span>+55 (11) 1234-5678</span>
                </a>
                <a href="https://example.com" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 text-gray-600 hover:text-eda-green transition-colors">
                  <Globe className="h-5 w-5" />
                  <span>www.example.com</span>
                </a>
                <a href="https://github.com/example" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 text-gray-600 hover:text-eda-green transition-colors">
                  <Github className="h-5 w-5" />
                  <span>GitHub</span>
                </a>
              </div>
            </div>

            {/* Acknowledgments */}
            <div className="space-y-8 animate-fade-in delay-200">
              <h2 className="text-3xl font-bold text-eda-green mb-6">Agradecimentos</h2>
              <div className="grid grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((index) => (
                  <div key={index} className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full" />
                    <h3 className="text-lg font-semibold text-center mb-2">Organização {index}</h3>
                    <p className="text-sm text-gray-600 text-center">Breve descrição da contribuição desta organização para o projeto.</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
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
