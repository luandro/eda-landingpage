interface SubtitleEntry {
  id: number;
  startTime: number;
  endTime: number;
  text: string;
}

export const parseSRT = (srtContent: string): SubtitleEntry[] => {
  const subtitles: SubtitleEntry[] = [];
  const blocks = srtContent.trim().split('\n\n');

  blocks.forEach(block => {
    const lines = block.split('\n');
    if (lines.length < 3) return;

    const id = parseInt(lines[0]);
    const times = lines[1].split(' --> ');
    
    const startTime = timeToMilliseconds(times[0]);
    const endTime = timeToMilliseconds(times[1]);
    const text = lines.slice(2).join('\n');

    subtitles.push({ id, startTime, endTime, text });
  });

  return subtitles;
};

const timeToMilliseconds = (timeString: string): number => {
  const [time, ms] = timeString.split(',');
  const [hours, minutes, seconds] = time.split(':').map(Number);
  
  return (hours * 3600000) + (minutes * 60000) + (seconds * 1000) + parseInt(ms);
};

export const getCurrentSubtitle = (
  subtitles: SubtitleEntry[],
  currentTime: number
): SubtitleEntry | null => {
  return (
    subtitles.find(
      sub => currentTime >= sub.startTime && currentTime <= sub.endTime
    ) || null
  );
};