interface WordTiming {
  word: string;
  startTime: number;
  endTime: number;
}

export const calculateWordTimings = (
  text: string,
  startTime: number,
  endTime: number
): WordTiming[] => {
  const words = text.split(' ');
  const duration = endTime - startTime;
  const avgWordDuration = duration / words.length;

  return words.map((word, index) => ({
    word,
    startTime: startTime + (index * avgWordDuration),
    endTime: startTime + ((index + 1) * avgWordDuration)
  }));
};

export const getCurrentWord = (
  wordTimings: WordTiming[],
  currentTime: number
): string | null => {
  const currentWordTiming = wordTimings.find(
    timing => currentTime >= timing.startTime && currentTime < timing.endTime
  );
  
  return currentWordTiming?.word || null;
};