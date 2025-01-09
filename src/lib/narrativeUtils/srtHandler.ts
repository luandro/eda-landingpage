import { SubtitleEntry } from "../../contexts/types";
import { ToastOptions } from "../../types/toast";

/**
 * Converts SRT timestamp to milliseconds with high precision
 */
const timeToMs = (timeStr: string): number => {
  const [time, ms] = timeStr.split(",");
  const [hours, minutes, seconds] = time.split(":").map(Number);
  return (
    hours * 3600000 + 
    minutes * 60000 + 
    seconds * 1000 + 
    parseInt(ms)
  );
};

/**
 * Parses SRT content into structured subtitle entries with precise timing
 */
const parseSRT = (content: string): SubtitleEntry[] => {
  const entries: SubtitleEntry[] = [];
  const blocks = content.trim().split("\n\n");

  blocks.forEach((block) => {
    const lines = block.split("\n");
    if (lines.length < 3) return;

    const id = parseInt(lines[0]);
    const [startTime, endTime] = lines[1].split(" --> ").map(timeToMs);
    const text = lines.slice(2).join("\n").trim();

    console.log('Parsed subtitle entry:', {
      id,
      startTime,
      endTime,
      text
    });

    entries.push({ id, startTime, endTime, text });
  });

  return entries;
};

/**
 * Gets the current subtitle based on precise playback time
 */
export const getCurrentSubtitle = (
  subtitles: SubtitleEntry[],
  currentTime: number,
): SubtitleEntry | null => {
  console.log('Getting subtitle for time:', currentTime);

  if (!subtitles?.length) {
    console.log('No subtitles available');
    return null;
  }

  // Find subtitle that matches current time precisely
  const subtitle = subtitles.find((sub) => {
    const isWithinRange = currentTime >= sub.startTime && currentTime <= sub.endTime;
    if (isWithinRange) {
      console.log('Found matching subtitle:', {
        id: sub.id,
        text: sub.text,
        timing: {
          current: currentTime,
          start: sub.startTime,
          end: sub.endTime
        }
      });
    }
    return isWithinRange;
  });

  return subtitle;
};

/**
 * Loads and parses an SRT file with precise timing information
 */
export const loadSRTFile = async (
  srtPath: string,
  setSubtitles: (subtitles: SubtitleEntry[]) => void,
  toast?: (options: ToastOptions) => void
): Promise<SubtitleEntry[] | null> => {
  try {
    console.log('Loading SRT file:', srtPath);
    const response = await fetch(srtPath);
    if (!response.ok) throw new Error("Failed to load SRT file");

    const content = await response.text();
    const parsed = parseSRT(content);
    console.log('Successfully parsed subtitles:', parsed);
    setSubtitles(parsed);
    return parsed;
  } catch (error) {
    console.error("Error loading SRT file:", error);
    if (toast) {
      toast({
        title: "Error",
        description: "Failed to load subtitles",
        variant: "destructive",
      });
    }
    return null;
  }
};

export type { SubtitleEntry };