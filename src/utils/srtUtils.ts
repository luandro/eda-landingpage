export interface SubtitleEntry {
  id: number;
  startTime: number;
  endTime: number;
  text: string;
}

export const parseSRT = (content: string): SubtitleEntry[] => {
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

export const timeToMs = (timeStr: string): number => {
  const [time, ms] = timeStr.split(",");
  const [hours, minutes, seconds] = time.split(":").map(Number);
  return hours * 3600000 + minutes * 60000 + seconds * 1000 + parseInt(ms);
};

export const getCurrentSubtitle = (
  subtitles: SubtitleEntry[],
  currentTime: number,
): SubtitleEntry | null => {
  return (
    subtitles.find(
      (sub) => currentTime >= sub.startTime && currentTime <= sub.endTime,
    ) || null
  );
};
