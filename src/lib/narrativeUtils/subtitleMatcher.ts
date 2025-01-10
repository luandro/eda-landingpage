import { SubtitleEntry } from "../../contexts/types";
import { calculateProgress } from "./timeUtils";

export const findCurrentSubtitle = (
  subtitles: SubtitleEntry[],
  currentTimeMs: number,
): { subtitle: SubtitleEntry | null; progress: number } => {
  if (!subtitles?.length) {
    console.log('No subtitles available');
    return { subtitle: null, progress: 0 };
  }

  const subtitle = subtitles.find((sub) => 
    currentTimeMs >= sub.startTime && currentTimeMs <= sub.endTime
  );

  const progress = subtitle 
    ? calculateProgress(currentTimeMs, subtitle.startTime, subtitle.endTime)
    : 0;

  console.log('Subtitle matching:', {
    currentTimeMs,
    foundSubtitle: subtitle?.id,
    progress,
    timing: subtitle ? {
      start: subtitle.startTime,
      end: subtitle.endTime,
      duration: subtitle.endTime - subtitle.startTime
    } : null
  });

  return { subtitle, progress };
};