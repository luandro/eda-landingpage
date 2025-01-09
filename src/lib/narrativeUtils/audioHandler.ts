import { SubtitleEntry } from "../../contexts/types";
import { getCurrentSubtitle } from "./srtHandler";

export const createAudioHandlers = (
  audioRef: React.RefObject<HTMLAudioElement>,
  setIsPlaying: (playing: boolean) => void,
  setIsComplete: (complete: boolean) => void,
  setCurrentText: (text: string) => void,
  setProgress: (progress: number) => void,
  setCurrentSection: (section: number) => void,
  subtitles: SubtitleEntry[],
) => {
  // Handles audio time updates to sync subtitles and progress bar
  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;

    // Get precise current time in milliseconds
    const currentTime = Math.floor(audio.currentTime * 1000);
    console.log('Current audio time (ms):', currentTime);

    // Find the subtitle that should be displayed at current time
    const subtitle = getCurrentSubtitle(subtitles, currentTime);
    console.log('Current subtitle:', subtitle);

    if (subtitle) {
      // Calculate precise timing within the subtitle
      const subtitleStart = subtitle.startTime;
      const subtitleDuration = subtitle.endTime - subtitle.startTime;
      const subtitleProgress = (currentTime - subtitleStart) / subtitleDuration;
      console.log('Subtitle timing:', {
        start: subtitleStart,
        duration: subtitleDuration,
        progress: subtitleProgress
      });

      // Update text and progress with precise timing
      setCurrentText(subtitle.text);
      const totalDuration = audio.duration * 1000;
      const progress = (currentTime / totalDuration) * 100;
      setProgress(Math.min(100, progress));
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
    }
  };

  return { handleTimeUpdate, handleEnded };
};