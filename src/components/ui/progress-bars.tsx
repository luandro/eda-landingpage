import React from 'react';

interface ProgressBarsProps {
  isComplete: boolean;
  progress: number;
  isPlaying: boolean;
}

export const ProgressBars: React.FC<ProgressBarsProps> = ({
  isComplete,
  progress,
  isPlaying,
}) => {
  console.log('Progress bars:', {
    isComplete,
    progress,
    isPlaying,
    calculatedWidth: `${isComplete ? 100 : progress}%`,
    calculatedOpacity: isPlaying ? 1 : 0
  });

  return (
    <>
      <div
        className="absolute bottom-0 left-0 h-0.5 bg-blue-500/30 transition-all duration-1000 ease-linear rounded"
        style={{
          width: `${isComplete ? 100 : progress}%`,
          opacity: isPlaying ? 1 : 0,
        }}
      />
      <div
        className="absolute inset-0 left-0 bg-blue-500/10 transition-all duration-300 ease-linear rounded"
        style={{
          width: `${isComplete ? 100 : Math.min(100, progress * 1.2)}%`,
          opacity: isPlaying ? 1 : 0,
        }}
      />
    </>
  );
};