interface WordTiming {
  word: string;
  start: number;
  end: number;
}

export const calculateWordTimings = (text: string, startTime: number, endTime: number): WordTiming[] => {
  const words = text.split(' ');
  const totalDuration = endTime - startTime;
  const averageWordDuration = totalDuration / words.length;
  
  return words.map((word, index) => {
    const start = startTime + (index * averageWordDuration);
    const end = start + averageWordDuration;
    return { word, start, end };
  });
};

export const getCurrentWord = (text: string, currentTime: number, startTime: number, endTime: number): number => {
  const wordTimings = calculateWordTimings(text, startTime, endTime);
  const currentWordIndex = wordTimings.findIndex(
    timing => currentTime >= timing.start && currentTime < timing.end
  );
  return currentWordIndex >= 0 ? currentWordIndex : -1;
};