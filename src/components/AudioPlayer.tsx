import React, { useState } from "react";
import { Play, Pause, RotateCw } from "lucide-react";

interface AudioPlayerProps {
  onPlay?: () => void;
  onPause?: () => void;
  isPlaying?: boolean;
  isComplete?: boolean;
  onRestart?: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  onPlay,
  onPause,
  isPlaying: externalIsPlaying,
  isComplete,
  onRestart,
}) => {
  const [internalIsPlaying, setInternalIsPlaying] = useState(false);
  const isPlaying = externalIsPlaying !== undefined ? externalIsPlaying : internalIsPlaying;

  const handlePlayPause = () => {
    if (isPlaying) {
      onPause?.();
      setInternalIsPlaying(false);
    } else {
      onPlay?.();
      setInternalIsPlaying(true);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={isComplete ? onRestart : handlePlayPause}
        className="w-16 h-16 rounded-full bg-eda-orange hover:bg-eda-orange-light transition-colors duration-300 flex items-center justify-center text-white relative z-10"
      >
        {isComplete ? (
          <>
            <RotateCw className="mr-2" />
            Restart
          </>
        ) : isPlaying ? (
          <Pause className="w-8 h-8" />
        ) : (
          <Play className="w-8 h-8 ml-1" />
        )}
      </button>
    </div>
  );
};

export default AudioPlayer;
