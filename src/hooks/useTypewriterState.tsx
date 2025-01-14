import { useState, useEffect } from 'react';
import { useNarrative } from '@/contexts/NarrativeContext';

export const useTypewriterState = (initialDelay: number = 0) => {
  const [showRotating, setShowRotating] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const {
    progress,
    isComplete,
    isPlaying,
    currentText: narrativeText,
    audioRef,
  } = useNarrative();

  useEffect(() => {
    console.log('Setting up initial delay timer:', { initialDelay });
    const startTimeout = setTimeout(() => {
      console.log('Initial delay complete, setting hasStarted to true');
      setHasStarted(true);
    }, initialDelay);

    return () => {
      console.log('Cleaning up initial delay timer');
      clearTimeout(startTimeout);
    };
  }, [initialDelay]);

  const getCurrentTime = () => {
    if (audioRef.current && isPlaying) {
      const currentTime = audioRef.current.currentTime * 1000;
      console.log('Current audio time:', { currentTime });
      return currentTime;
    }
    return 0;
  };

  const getEndTime = () => {
    if (audioRef.current?.duration) {
      const endTime = audioRef.current.duration * 1000;
      console.log('Audio end time:', { endTime });
      return endTime;
    }
    return 0;
  };

  return {
    showRotating,
    setShowRotating,
    hasStarted,
    progress,
    isComplete,
    isPlaying,
    narrativeText,
    getCurrentTime,
    getEndTime,
  };
};