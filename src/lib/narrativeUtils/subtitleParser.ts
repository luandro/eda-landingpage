import { SubtitleEntry } from "../../contexts/types";
import { timeToMs } from "./timeUtils";

export const parseSubtitleBlock = (block: string): SubtitleEntry | null => {
  const lines = block.split("\n");
  if (lines.length < 3) return null;

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

  return { id, startTime, endTime, text };
};

export const parseSRT = (content: string): SubtitleEntry[] => {
  const entries: SubtitleEntry[] = [];
  const blocks = content.trim().split("\n\n");

  blocks.forEach((block) => {
    const entry = parseSubtitleBlock(block);
    if (entry) entries.push(entry);
  });

  console.log('Parsed all subtitles:', {
    totalEntries: entries.length,
    totalDuration: entries[entries.length - 1]?.endTime || 0
  });

  return entries;
};