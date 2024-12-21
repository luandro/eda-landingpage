import React from "react";
import { Play, Pause } from "lucide-react";
import DividingLine from "./DividingLine";

interface AudioPlayerProps {
  onPlay: () => void;
  onPause: () => void;
  isPlaying: boolean;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  onPlay,
  onPause,
  isPlaying,
}) => {
  return (
    <div className="relative">
      <button
        onClick={() => (isPlaying ? onPause() : onPlay())}
        className="w-16 h-16 rounded-full bg-eda-orange hover:bg-eda-orange-light transition-colors duration-300 flex items-center justify-center text-white relative z-10"
      >
        {isPlaying ? (
          <Pause className="w-8 h-8" />
        ) : (
          <Play className="w-8 h-8 ml-1" />
        )}
      </button>
      <div className="absolute inset-0 flex items-center justify-center">
        <DividingLine />
      </div>
    </div>
  );
};

export default AudioPlayer;
