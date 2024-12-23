import React, { createContext, useContext, useState, useEffect } from 'react';
import { parseSRT, getCurrentSubtitle } from '../utils/srtParser';

interface NarrativeContextType {
  isPlaying: boolean;
  currentText: string;
  currentSection: number;
  togglePlayback: () => void;
  setCurrentSection: (section: number) => void;
  audioRef: React.RefObject<HTMLAudioElement>;
}

const NarrativeContext = createContext<NarrativeContextType | undefined>(undefined);

export const useNarrative = () => {
  const context = useContext(NarrativeContext);
  if (!context) {
    throw new Error('useNarrative must be used within a NarrativeProvider');
  }
  return context;
};

interface NarrativeProviderProps {
  children: React.ReactNode;
  srtPath?: string;
  audioPath?: string;
  scrollInterval?: number;
}

export const NarrativeProvider: React.FC<NarrativeProviderProps> = ({
  children,
  srtPath = '/default.srt',
  audioPath = '/audio.mp3',
  scrollInterval = 3000,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [currentSection, setCurrentSection] = useState(0);
  const [subtitles, setSubtitles] = useState<any[]>([]);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  // Load SRT file
  useEffect(() => {
    fetch(srtPath)
      .then(response => {
        if (!response.ok) throw new Error('Failed to load SRT file');
        return response.text();
      })
      .then(content => {
        const parsed = parseSRT(content);
        setSubtitles(parsed);
        console.log('Loaded subtitles:', parsed);
      })
      .catch(error => {
        console.error('Error loading SRT file:', error);
      });
  }, [srtPath]);

  // Handle audio time updates
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      const currentTime = audio.currentTime * 1000;
      const subtitle = getCurrentSubtitle(subtitles, currentTime);
      if (subtitle) {
        setCurrentText(subtitle.text);
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    return () => audio.removeEventListener('timeupdate', handleTimeUpdate);
  }, [subtitles]);

  // Auto-scrolling effect
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentSection(prev => (prev + 1) % 4); // Assuming 4 sections
    }, scrollInterval);

    return () => clearInterval(interval);
  }, [isPlaying, scrollInterval]);

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(error => {
        console.error('Error playing audio:', error);
      });
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <NarrativeContext.Provider
      value={{
        isPlaying,
        currentText,
        currentSection,
        togglePlayback,
        setCurrentSection,
        audioRef,
      }}
    >
      {children}
      <audio ref={audioRef} src={audioPath} />
    </NarrativeContext.Provider>
  );
};