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
    console.log('Playback complete, stopping auto-scroll');
    return () => {};
  }

  if (!isPlaying) {
    // When not playing, show default text for current section
    const defaultText = subtitles[currentSection]?.text || subtitles[0]?.text || "";
    console.log('Setting default text:', defaultText);
    setCurrentText(defaultText);
    return () => {};
  }

  console.log('Starting auto-scroll interval');
  const interval = setInterval(() => {
    setCurrentSection((prev: number) => {
      const next = prev + 1;
      console.log('Auto-scrolling to next section:', { prev, next, total: subtitles.length });

      if (next >= subtitles.length) {
        console.log('Reached end of subtitles, stopping interval');
        clearInterval(interval);
        return prev;
      }
      return next;
    });
  }, scrollInterval);

  return () => {
    console.log('Cleaning up auto-scroll interval');
    clearInterval(interval);
  };
};