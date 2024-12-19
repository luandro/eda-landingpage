import React, { useState, useRef, useEffect } from "react";
import TypewriterText from "../components/TypewriterText";
import RotatingSubtitles from "../components/RotatingSubtitles";
import AudioPlayer from "../components/AudioPlayer";
import { MessageSquare, BookOpen, Sprout, Brain, PiggyBank } from "lucide-react";

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
  <div className="bg-black/5 rounded-lg p-6 space-y-4 h-[400px] md:h-[600px] overflow-y-auto">
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

const UseCases = () => (
  <div className="grid grid-cols-2 gap-4">
    {[
      {
        icon: <PiggyBank className="h-8 w-8" />,
        title: "Fundraising",
        description: "Apoie projetos ambientais",
        bgImage: "photo-1581091226825-a6a2a5aee158"
      },
      {
        icon: <BookOpen className="h-8 w-8" />,
        title: "Courses",
        description: "Aprenda sobre sustentabilidade",
        bgImage: "photo-1487058792275-0ad4aaf24ca7"
      },
      {
        icon: <Sprout className="h-8 w-8" />,
        title: "Agro-ecology",
        description: "Práticas sustentáveis",
        bgImage: "photo-1472396961693-142e6e269027"
      },
      {
        icon: <Brain className="h-8 w-8" />,
        title: "Bioeconomy",
        description: "Soluções inovadoras",
        bgImage: "photo-1485827404703-89b55fcc595e"
      }
    ].map((useCase, index) => (
      <div
        key={index}
        className="relative overflow-hidden rounded-lg group cursor-pointer"
        style={{
          backgroundImage: `url(https://images.unsplash.com/${useCase.bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '200px'
        }}
      >
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors" />
        <div className="absolute inset-0 p-4 flex flex-col justify-end text-white">
          <div className="mb-2">{useCase.icon}</div>
          <h3 className="text-lg font-bold mb-1">{useCase.title}</h3>
          <p className="text-sm opacity-80">{useCase.description}</p>
        </div>
      </div>
    ))}
  </div>
);

const Index = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentText, setCurrentText] = useState("Olá, meu nome é Eda");
  const [showRotatingSubtitles, setShowRotatingSubtitles] = useState(true);
  const [showChat, setShowChat] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setShowChat(scrollPosition < 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        {/* Hero Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-12">
          <div className="space-y-6">
            <div className="text-4xl md:text-6xl font-bold text-eda-green">
              <TypewriterText text={currentText} />
            </div>
            {showRotatingSubtitles && <RotatingSubtitles />}
          </div>

          <div className="flex justify-center items-center">
            <AudioPlayer
              isPlaying={isPlaying}
              onPlay={handlePlay}
              onPause={handlePause}
            />
          </div>
        </div>

        {/* Chat/Use Cases Section */}
        <div className="mt-8">
          {showChat ? <ExampleChat /> : <UseCases />}
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