import { SubtitleEntry } from "../../contexts/types";

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
    
    // Find the exact section based on current time
    const newSectionIndex = subtitles.findIndex((subtitle, index) => {
      const isInCurrentTimeRange = currentTimeMs >= subtitle.startTime && 
                                 currentTimeMs <= subtitle.endTime;

      console.log('Section timing check:', {
        sectionIndex: index,
        currentTimeMs,
        subtitleStart: subtitle.startTime,
        subtitleEnd: subtitle.endTime,
        isInRange: isInCurrentTimeRange
      });

      return isInCurrentTimeRange;
    });

    if (newSectionIndex !== -1 && newSectionIndex !== currentSection) {
      console.log('Scrolling to new section:', {
        from: currentSection,
        to: newSectionIndex,
        timestamp: currentTimeMs,
        newText: subtitles[newSectionIndex].text
      });
      
      setCurrentSection(newSectionIndex);
      setCurrentText(subtitles[newSectionIndex].text);
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

  constructor(config: { scrollInterval: number; onScroll?: (sectionIndex: number) => void }) {
    this.currentSection = 0;
    this.config = config;
    this.scrollTimer = null;
  }

  public start() {
    if (this.scrollTimer) {
      this.stop();
    }

    this.scrollTimer = setInterval(() => {
      this.scrollToNextSection();
    }, this.config.scrollInterval);
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

  private scrollToNextSection() {
    this.currentSection++;
    if (this.config.onScroll) {
      this.config.onScroll(this.currentSection);
    }
  }
}