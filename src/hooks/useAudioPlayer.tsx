import { useState, useRef, useCallback, useEffect } from "react";

interface Subtitle {
  startTime: number;
  endTime: number;
  text: string;
}

interface UseAudioPlayerProps {
  subtitles: Subtitle[];
  onTextChange?: (text: string) => void;
}

export const useAudioPlayer = ({
  subtitles,
  onTextChange,
}: UseAudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlay = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
      setShowSubtitles(false);
    }
  }, []);

  const handlePause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setShowSubtitles(true);
    }
  }, []);

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current && onTextChange) {
      const currentTime = audioRef.current.currentTime;
      const currentSubtitle = subtitles.find(
        (subtitle) =>
          currentTime >= subtitle.startTime && currentTime <= subtitle.endTime,
      );
      if (currentSubtitle) {
        onTextChange(currentSubtitle.text);
      }
    }
  }, [subtitles, onTextChange]);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    setShowSubtitles(true);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.addEventListener("ended", handleEnded);
    }

    return () => {
      if (audio) {
        audio.removeEventListener("timeupdate", handleTimeUpdate);
        audio.removeEventListener("ended", handleEnded);
      }
    };
  }, [handleTimeUpdate, handleEnded]);

  return {
    isPlaying,
    showSubtitles,
    audioRef,
    handlePlay,
    handlePause,
  };
};
