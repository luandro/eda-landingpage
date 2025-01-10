import { SubtitleEntry } from "../../contexts/types";
import { ToastOptions } from "../../types/toast";

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
      startTimeMs: startTime,
      endTimeMs: endTime,
      text,
      duration: endTime - startTime
    });

    entries.push({ id, startTime, endTime, text });
  });

  return entries;
};

export const getCurrentSubtitle = (
  subtitles: SubtitleEntry[],
  currentTimeMs: number,
): SubtitleEntry | null => {
  if (!subtitles?.length) {
    console.log('No subtitles available');
    return null;
  }

  const subtitle = subtitles.find((sub) => {
    const isWithinRange = currentTimeMs >= sub.startTime && currentTimeMs <= sub.endTime;
    
    if (isWithinRange) {
      console.log('Found matching subtitle:', {
        id: sub.id,
        text: sub.text,
        timing: {
          currentMs: currentTimeMs,
          startMs: sub.startTime,
          endMs: sub.endTime,
          progressWithinSubtitle: (currentTimeMs - sub.startTime) / (sub.endTime - sub.startTime)
        }
      });
    }
    
    return isWithinRange;
  });

  return subtitle;
};

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
    
    console.log('Successfully parsed subtitles:', {
      count: parsed.length,
      totalDuration: parsed.reduce((acc, sub) => Math.max(acc, sub.endTime), 0)
    });
    
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