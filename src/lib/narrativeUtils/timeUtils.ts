/**
 * Converts SRT timestamp string to milliseconds
 */
export const timeToMs = (timeStr: string): number => {
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
 * Calculates progress percentage within a time range
 */
export const calculateProgress = (
  currentTime: number,
  startTime: number,
  endTime: number
): number => {
  const duration = endTime - startTime;
  if (duration <= 0) return 0;
  return Math.min(100, Math.max(0, ((currentTime - startTime) / duration) * 100));
};

/**
 * Formats milliseconds into a readable time string
 */
export const formatTime = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = ms % 1000;
  
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')},${String(milliseconds).padStart(3, '0')}`;
};