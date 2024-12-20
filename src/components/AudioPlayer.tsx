import React from "react";
import { Play, Pause, ChevronDown } from "lucide-react";

interface AudioPlayerProps {
  onPlay: () => void;
  onPause: () => void;
  isPlaying: boolean;
  showNextSection?: boolean;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ 
  onPlay, 
  onPause, 
  isPlaying,
  showNextSection = false 
}) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={() => (isPlaying ? onPause() : onPlay())}
        className={`w-16 h-16 rounded-full bg-eda-orange hover:bg-eda-orange-light transition-colors duration-300 flex items-center justify-center text-white ${
          !isPlaying && "animate-pulse"
        }`}
      >
        {isPlaying ? (
          <Pause className="w-8 h-8" />
        ) : (
          <Play className="w-8 h-8 ml-1" />
        )}
      </button>
      {showNextSection && (
        <ChevronDown 
          className="w-8 h-8 text-eda-orange animate-bounce cursor-pointer" 
          onClick={() => {
            window.scrollTo({
              top: window.innerHeight,
              behavior: "smooth"
            });
          }}
        />
      )}
    </div>
  );
};

export default AudioPlayer;