import { SubtitleEntry } from "../../contexts/types";
import { ToastOptions } from "../../types/toast";

/**
 * Converts SRT timestamp to milliseconds
 */
const timeToMs = (timeStr: string): number => {
  const [time, ms] = timeStr.split(",");
  const [hours, minutes, seconds] = time.split(":").map(Number);
  return hours * 3600000 + minutes * 60000 + seconds * 1000 + parseInt(ms);
};

/**
 * Parses SRT content into structured subtitle entries
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

    entries.push({ id, startTime, endTime, text });
  });

  return entries;
};

/**
 * Gets the current subtitle based on the playback time
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

  // Handle both property naming conventions (startTime/endTime and start/end)
  const subtitle = subtitles.find((sub) => {
    const start = 'startTime' in sub ? sub.startTime : (sub as any).start;
    const end = 'endTime' in sub ? sub.endTime : (sub as any).end;
    return currentTime >= start && currentTime <= end;
  });

  console.log('Found subtitle:', subtitle);
  return subtitle;
};

/**
 * Loads and parses an SRT file from the given path
 */
export const loadSRTFile = async (
  srtPath: string,
  setSubtitles: (subtitles: SubtitleEntry[]) => void,
  toast?: (options: ToastOptions) => void
): Promise<SubtitleEntry[] | null> => {
  try {
    const response = await fetch(srtPath);
    if (!response.ok) throw new Error("Failed to load SRT file");

    const content = await response.text();
    const parsed = parseSRT(content);
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
