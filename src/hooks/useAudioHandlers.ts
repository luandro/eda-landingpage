import { RefObject } from "react";
import { SubtitleEntry } from "@/types/narrative";

export const useAudioHandlers = (
  audioRef: RefObject<HTMLAudioElement>,
  setIsPlaying: (playing: boolean) => void,
  setIsComplete: (complete: boolean) => void,
  setCurrentText: (text: string) => void,
  setProgress: (progress: number) => void,
  setCurrentSection: (section: number) => void,
  subtitles: SubtitleEntry[]
) => {
  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;

    const currentTimeMs = Math.floor(audio.currentTime * 1000);
    console.log('Audio time update:', {
      currentTimeMs,
      audioCurrentTime: audio.currentTime,
      audioDuration: audio.duration
    });

    const currentSubtitle = subtitles.find((subtitle, index) => {
      const nextSubtitle = subtitles[index + 1];
      return currentTimeMs >= subtitle.startTime && (!nextSubtitle || currentTimeMs < nextSubtitle.startTime);
    });

    if (currentSubtitle) {
      console.log('Current subtitle:', currentSubtitle);
      setCurrentText(currentSubtitle.text);
      setCurrentSection(currentSubtitle.id - 1);
      setProgress((audio.currentTime / audio.duration) * 100);
    }
  };

  const handleEnded = () => {
    console.log('Audio playback ended');
    setIsPlaying(false);
    setIsComplete(true);
    const lastSubtitle = subtitles[subtitles.length - 1];
    if (lastSubtitle) {
      setCurrentText(lastSubtitle.text);
      setCurrentSection(subtitles.length - 1);
      setProgress(100);
    }
  };

  return { handleTimeUpdate, handleEnded };
};