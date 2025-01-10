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

    // Get precise current time in milliseconds
    const currentTimeMs = Math.floor(audio.currentTime * 1000);
    console.log('Audio time update:', {
      currentTimeMs,
      audioCurrentTime: audio.currentTime,
      audioDuration: audio.duration
    });

    // Find the current subtitle with precise timing
    const currentSubtitle = getCurrentSubtitle(subtitles, currentTimeMs);
    
    if (currentSubtitle) {
      console.log('Subtitle match found:', {
        id: currentSubtitle.id,
        text: currentSubtitle.text,
        startTime: currentSubtitle.startTime,
        endTime: currentSubtitle.endTime,
        currentTime: currentTimeMs
      });

      // Calculate precise progress within the current subtitle
      const subtitleProgress = (currentTimeMs - currentSubtitle.startTime) / 
                             (currentSubtitle.endTime - currentSubtitle.startTime);
      
      // Update text and section with exact timing
      setCurrentText(currentSubtitle.text);
      setCurrentSection(currentSubtitle.id - 1);

      // Calculate overall progress with high precision
      const totalDuration = audio.duration * 1000;
      const progress = (currentTimeMs / totalDuration) * 100;
      setProgress(Math.min(100, progress));

      console.log('Progress update:', {
        subtitleProgress,
        overallProgress: progress,
        currentSection: currentSubtitle.id - 1
      });
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