import React, { useState } from "react";
import { Play, Pause } from "lucide-react";

interface AudioPlayerProps {
  onPlay: () => void;
  onPause: () => void;
  isPlaying: boolean;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ onPlay, onPause, isPlaying }) => {
  return (
    <button
      onClick={() => (isPlaying ? onPause() : onPlay())}
      className="w-16 h-16 rounded-full bg-eda-orange hover:bg-eda-orange-light transition-colors duration-300 flex items-center justify-center text-white"
    >
      {isPlaying ? (
        <Pause className="w-8 h-8" />
      ) : (
        <Play className="w-8 h-8 ml-1" />
      )}
    </button>
  );
};

export default AudioPlayer;