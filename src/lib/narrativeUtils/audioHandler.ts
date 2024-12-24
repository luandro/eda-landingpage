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
  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;

    const currentTime = audio.currentTime * 1000;
    console.log('Current time (ms):', currentTime);

    const subtitle = getCurrentSubtitle(subtitles, currentTime);
    console.log('Found subtitle:', subtitle);

    if (subtitle) {
      setCurrentText(subtitle.text);
      const duration = audio.duration * 1000;
      const progress = (currentTime / duration) * 100;
      console.log('Setting progress:', progress);
      setProgress(progress);
    }
  };

  const handleEnded = () => {
    console.log('Audio playback ended');
    setIsPlaying(false);
    setIsComplete(true);
    const lastSubtitle = subtitles[subtitles.length - 1];
    console.log('Last subtitle:', lastSubtitle);
    if (lastSubtitle) {
      setCurrentText(lastSubtitle.text);
      setCurrentSection(subtitles.length - 1);
    }
  };

  return { handleTimeUpdate, handleEnded };
};
