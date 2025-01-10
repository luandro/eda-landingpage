import { SubtitleEntry } from "../../contexts/types";
import { findCurrentSubtitle } from "./subtitleMatcher";

export const setupAutoScroll = (
  isPlaying: boolean,
  isComplete: boolean,
  currentSection: number,
  subtitles: SubtitleEntry[],
  setCurrentSection: (section: number) => void,
  setCurrentText: (text: string) => void,
  scrollInterval: number
) => {
  if (isComplete) {
    console.log('Playback complete, resetting to start');
    setCurrentSection(0);
    setCurrentText(subtitles[0]?.text || "");
    return () => {};
  }

  if (!isPlaying) {
    console.log('Not playing, maintaining current section:', currentSection);
    const defaultText = subtitles[currentSection]?.text || subtitles[0]?.text || "";
    setCurrentText(defaultText);
    return () => {};
  }

  const audioElement = document.querySelector('audio');
  if (!audioElement) {
    console.error('Audio element not found');
    return () => {};
  }

  const handleTimeUpdate = () => {
    const currentTimeMs = Math.floor(audioElement.currentTime * 1000);
    const totalDurationMs = Math.floor(audioElement.duration * 1000);
    
    const { subtitle, progress } = findCurrentSubtitle(subtitles, currentTimeMs);
    
    if (subtitle) {
      const sectionIndex = subtitle.id - 1;
      
      console.log('Auto-scroll timing:', {
        currentTimeMs,
        totalDurationMs,
        progress,
        currentSection: sectionIndex,
        subtitle: {
          id: subtitle.id,
          text: subtitle.text,
          start: subtitle.startTime,
          end: subtitle.endTime
        }
      });

      if (sectionIndex !== currentSection) {
        setCurrentSection(sectionIndex);
        setCurrentText(subtitle.text);
      }
    }
  };

  audioElement.addEventListener('timeupdate', handleTimeUpdate);
  
  return () => {
    audioElement.removeEventListener('timeupdate', handleTimeUpdate);
  };
};

export class AutoScroll {
  private currentSection: number;
  private config: { scrollInterval: number; onScroll?: (sectionIndex: number) => void };
  private scrollTimer: NodeJS.Timeout | null;
  private audioElement: HTMLAudioElement | null;

  constructor(config: { scrollInterval: number; onScroll?: (sectionIndex: number) => void }) {
    this.currentSection = 0;
    this.config = config;
    this.scrollTimer = null;
    this.audioElement = null;
  }

  public start() {
    this.stop();
    this.audioElement = document.querySelector('audio');
    
    if (!this.audioElement) {
      console.error('Audio element not found');
      return;
    }

    const handleScroll = () => {
      if (this.audioElement) {
        const progress = (this.audioElement.currentTime / this.audioElement.duration) * 100;
        const totalSections = 4; // Total number of sections
        const newSection = Math.floor((progress / 100) * totalSections);
        
        if (newSection !== this.currentSection) {
          this.currentSection = newSection;
          if (this.config.onScroll) {
            this.config.onScroll(this.currentSection);
          }
        }
      }
    };

    this.scrollTimer = setInterval(handleScroll, this.config.scrollInterval);
  }

  public stop() {
    if (this.scrollTimer) {
      clearInterval(this.scrollTimer);
      this.scrollTimer = null;
    }
  }

  public reset() {
    this.currentSection = 0;
    this.stop();
  }
}