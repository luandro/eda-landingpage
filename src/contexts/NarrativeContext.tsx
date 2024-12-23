import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { parseSRT, getCurrentSubtitle } from '../utils/srtParser';
import { useToast } from "@/components/ui/use-toast";

interface NarrativeContextType {
  isPlaying: boolean;
  currentText: string;
  currentSection: number;
  isComplete: boolean;
  progress: number;
  togglePlayback: () => void;
  restart: () => void;
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
  srtPath = '/subtitles.srt',
  audioPath = '/audio.mp3',
  scrollInterval = 3000,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [currentSection, setCurrentSection] = useState(0);
  const [subtitles, setSubtitles] = useState<any[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

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
        toast({
          title: "Error",
          description: "Failed to load subtitles",
          variant: "destructive",
        });
      });
  }, [srtPath, toast]);

  // Handle audio time updates
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      const currentTime = audio.currentTime * 1000;
      const subtitle = getCurrentSubtitle(subtitles, currentTime);
      
      if (subtitle) {
        setCurrentText(subtitle.text);
        // Calculate progress as a percentage
        const duration = audio.duration * 1000;
        setProgress((currentTime / duration) * 100);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setIsComplete(true);
      // Keep the last section visible
      const lastSubtitle = subtitles[subtitles.length - 1];
      if (lastSubtitle) {
        setCurrentText(lastSubtitle.text);
        setCurrentSection(subtitles.length - 1);
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [subtitles]);

  // Auto-scrolling effect
  useEffect(() => {
    if (!isPlaying || isComplete) return;

    const interval = setInterval(() => {
      setCurrentSection(prev => {
        const next = prev + 1;
        if (next >= subtitles.length) {
          clearInterval(interval);
          return prev;
        }
        return next;
      });
    }, scrollInterval);

    return () => clearInterval(interval);
  }, [isPlaying, isComplete, subtitles.length, scrollInterval]);

  const togglePlayback = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(error => {
        console.error('Error playing audio:', error);
        toast({
          title: "Error",
          description: "Failed to play audio",
          variant: "destructive",
        });
      });
      setIsPlaying(true);
    }
  }, [isPlaying, toast]);

  const restart = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = 0;
    setCurrentSection(0);
    setIsComplete(false);
    setProgress(0);
    
    audio.play().catch(error => {
      console.error('Error playing audio:', error);
      toast({
        title: "Error",
        description: "Failed to restart audio",
        variant: "destructive",
      });
    });
    setIsPlaying(true);
  }, [toast]);

  return (
    <NarrativeContext.Provider
      value={{
        isPlaying,
        currentText,
        currentSection,
        isComplete,
        progress,
        togglePlayback,
        restart,
        setCurrentSection,
        audioRef,
      }}
    >
      {children}
      <audio ref={audioRef} src={audioPath} />
    </NarrativeContext.Provider>
  );
};
