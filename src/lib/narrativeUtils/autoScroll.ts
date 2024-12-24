import { SubtitleEntry } from "../../contexts/types";

interface AutoScrollConfig {
  scrollInterval: number;
  onScroll?: (sectionIndex: number) => void;
}

export class AutoScroll {
  private currentSection: number;
  private config: AutoScrollConfig;
  private scrollTimer: NodeJS.Timeout | null;

  constructor(config: AutoScrollConfig) {
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

// Legacy function kept for reference
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
    console.log('Playback complete, scrolling to beginning');
    setCurrentSection(0);
    setCurrentText(subtitles[0]?.text || "");
    return () => {};
  }

  if (!isPlaying) {
    console.log('Not playing, setting default text for section:', currentSection);
    const defaultText = subtitles[currentSection]?.text || subtitles[0]?.text || "";
    setCurrentText(defaultText);
    return () => {};
  }

  // Get current audio timestamp from the audio element
  const audioElement = document.querySelector('audio');
  if (!audioElement) {
    console.error('Audio element not found');
    return () => {};
  }
  console.log('Audio element found');

  const handleTimeUpdate = () => {
    const currentTime = audioElement.currentTime;
    console.log('Time update:', currentTime);

    // Find the correct section based on audio timestamp
    console.log('Finding section for time:', currentTime * 1000, 'ms');
    console.log('Current subtitles:', subtitles);

    const newSectionIndex = subtitles.findIndex((subtitle, index) => {
      const nextSubtitle = subtitles[index + 1];
      const currentTimeMs = Math.round(currentTime * 1000); // Convert to milliseconds and round
      const isInRange = currentTimeMs >= subtitle.startTime && currentTimeMs <= subtitle.endTime;
      console.log('Checking subtitle:', {
        index,
        subtitle,
        startTimeMs: subtitle.startTime,
        endTimeMs: subtitle.endTime,
        nextStartTimeMs: nextSubtitle?.startTime,
        currentTimeMs,
        isInRange,
      });

      // For the last subtitle, check if we're past its start time
      if (!nextSubtitle) {
        console.log('Last subtitle, checking if current time is past start:', currentTimeMs >= subtitle.startTime);
        return currentTimeMs >= subtitle.startTime && currentTimeMs <= subtitle.endTime;
      }

      console.log('Subtitle in range?', isInRange, 'Current section', currentSection);
      if (!isInRange) {
        console.log('next section', currentSection + 1)
        return currentSection + 1;
      }
      return currentSection;
    });

    console.log('Found section index:', newSectionIndex, 'Current section:', currentSection);

    if (newSectionIndex !== currentSection) {
      console.log('Scrolling to new section:', {
        newSectionIndex,
        currentSection,
        newText: subtitles[newSectionIndex].text,
        subtitle: subtitles[newSectionIndex]
      });
      setCurrentSection(newSectionIndex);
      setCurrentText(subtitles[newSectionIndex].text);
    } else {
      console.log('No section change needed:', {
        newSectionIndex,
        currentSection,
        reason: newSectionIndex === -1 ? 'No matching section found' : 'Already on correct section'
      });
    }
  };

  audioElement.addEventListener('timeupdate', handleTimeUpdate);

  return () => {
    audioElement.removeEventListener('timeupdate', handleTimeUpdate);
  };
};