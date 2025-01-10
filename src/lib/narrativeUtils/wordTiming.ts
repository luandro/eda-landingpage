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
  const words = text.split(/\s+/).filter(word => word.length > 0);
  const duration = endTime - startTime;
  
  // Calculate average word duration with a small buffer
  const avgWordDuration = duration / words.length;
  const buffer = avgWordDuration * 0.1; // 10% buffer between words
  
  console.log('Calculating word timings:', {
    totalWords: words.length,
    duration,
    avgWordDuration,
    buffer
  });

  return words.map((word, index) => {
    const wordStart = startTime + (index * avgWordDuration);
    const wordEnd = wordStart + (avgWordDuration - buffer);
    
    console.log('Word timing:', {
      word,
      start: wordStart,
      end: wordEnd
    });
    
    return {
      word,
      startTime: wordStart,
      endTime: wordEnd
    };
  });
};

export const getCurrentWord = (
  wordTimings: WordTiming[],
  currentTime: number
): string | null => {
  const currentWordTiming = wordTimings.find(
    timing => currentTime >= timing.startTime && currentTime <= timing.endTime
  );
  
  if (currentWordTiming) {
    console.log('Current word found:', {
      word: currentWordTiming.word,
      currentTime,
      wordStart: currentWordTiming.startTime,
      wordEnd: currentWordTiming.endTime
    });
  }
  
  return currentWordTiming?.word || null;
};