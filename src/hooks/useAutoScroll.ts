import { useEffect } from "react";
import { SubtitleEntry } from "@/types/narrative";

export const useAutoScroll = (
  isPlaying: boolean,
  isComplete: boolean,
  currentSection: number,
  subtitles: SubtitleEntry[],
  setCurrentSection: (section: number) => void,
  setCurrentText: (text: string) => void,
  scrollInterval: number,
  scrollToSection?: (section: number) => void
) => {
  useEffect(() => {
    if (!isPlaying) {
      console.log('Not playing, maintaining current section:', currentSection);
      setCurrentText(subtitles[currentSection]?.text || subtitles[0]?.text || "");
      return;
    }

    if (isComplete) {
      console.log('Playback complete, resetting to start');
      setCurrentSection(0);
      if (scrollToSection) {
        scrollToSection(0);
      }
      setCurrentText(subtitles[0]?.text || "");
      return;
    }

    const interval = setInterval(() => {
      if (currentSection < subtitles.length - 1) {
        const nextSection = currentSection + 1;
        setCurrentSection(nextSection);
        if (scrollToSection) {
          scrollToSection(nextSection);
        }
      }
    }, scrollInterval);

    return () => clearInterval(interval);
  }, [isPlaying, isComplete, currentSection, subtitles, scrollInterval, scrollToSection]);
};