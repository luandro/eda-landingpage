import { SubtitleEntry } from "../../contexts/types";
import { ToastOptions } from "../../types/toast";
import { parseSRT } from "./subtitleParser";
import { findCurrentSubtitle } from "./subtitleMatcher";

export const getCurrentSubtitle = (
  subtitles: SubtitleEntry[],
  currentTimeMs: number,
): SubtitleEntry | null => {
  const { subtitle } = findCurrentSubtitle(subtitles, currentTimeMs);
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