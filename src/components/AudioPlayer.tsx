import React from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCw } from "lucide-react";
import { useNarrative } from "@/contexts/NarrativeContext";

interface AudioPlayerProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  isComplete?: boolean;
  onRestart?: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  isPlaying,
  onPlay,
  onPause,
  isComplete,
  onRestart,
}) => {
  const { restart } = useNarrative();

  if (isComplete) {
    return (
      <Button
        onClick={onRestart || restart}
        variant="outline"
        size="icon"
        className="w-16 h-16 rounded-full bg-eda-orange hover:bg-eda-orange-light transition-colors duration-300 flex items-center justify-center text-white relative z-10"      >
        <RotateCw className="h-12 w-12" />
      </Button>
    );
  }

  return (
    <Button
      onClick={isPlaying ? onPause : onPlay}
      variant="outline"
      size="icon"
      className="w-16 h-16 rounded-full bg-eda-orange hover:bg-eda-orange-light transition-colors duration-300 flex items-center justify-center text-white relative z-10">
      {isPlaying ? (
        <Pause className="h-12 w-12" />
      ) : (
        <Play className="h-12 w-12" />
      )}
    </Button>
  );
};

export default AudioPlayer;