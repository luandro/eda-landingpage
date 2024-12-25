import React, {
  createContext,
  useContext,
  useEffect,
} from "react";
import {
  createAudioHandlers,
  loadSRTFile,
  createPlaybackControls,
  setupAutoScroll
} from "../lib/narrativeUtils";
import { NarrativeContextType } from "./types";
import { useNarrativeState } from "./useNarrativeState";

const NarrativeContext = createContext<NarrativeContextType | undefined>(
  undefined,
);

export const useNarrative = () => {
  const context = useContext(NarrativeContext);
  if (!context) {
    throw new Error("useNarrative must be used within a NarrativeProvider");
  }
  return context;
};

interface NarrativeProviderProps {
  children: React.ReactNode;
  srtPath?: string;
  audioPath?: string;
  scrollInterval?: number;
  onSectionChange?: (section: number) => void;
}

export const NarrativeProvider: React.FC<NarrativeProviderProps> = ({
  children,
  srtPath = "/subtitles.srt",
  audioPath = "/audio.mp3",
  scrollInterval = 3000,
  onSectionChange,
}) => {
  const {
    isPlaying,
    setIsPlaying,
    currentText,
    setCurrentText,
    currentSection,
    setCurrentSection,
    subtitles,
    setSubtitles,
    isComplete,
    setIsComplete,
    progress,
    setProgress,
    audioRef,
    toast,
  } = useNarrativeState(srtPath, audioPath);

  // Load SRT file
  useEffect(() => {
    loadSRTFile(srtPath, setSubtitles, toast);
  }, [srtPath, toast]);

  // Handle audio time updates and ended events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const { handleTimeUpdate, handleEnded } = createAudioHandlers(
      audioRef,
      setIsPlaying,
      setIsComplete,
      setCurrentText,
      setProgress,
      setCurrentSection,
      subtitles
    );

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [subtitles]);

  // Sync section with current playback time
  useEffect(() => {
    if (!audioRef.current || !subtitles.length) return;

    const syncSectionWithPlayback = () => {
      const currentTime = audioRef.current?.currentTime || 0;
      const timeMs = currentTime * 1000;
      
      console.log('Syncing section with playback time:', timeMs);
      
      const newSection = subtitles.findIndex((subtitle, index) => {
        const nextSubtitle = subtitles[index + 1];
        return timeMs >= subtitle.startTime && (!nextSubtitle || timeMs < nextSubtitle.startTime);
      });

      if (newSection !== -1 && newSection !== currentSection) {
        console.log('Updating section to:', newSection);
        setCurrentSection(newSection);
        onSectionChange?.(newSection);
      }
    };

    if (isPlaying) {
      console.log('Playback started/resumed, syncing section');
      syncSectionWithPlayback();
    }
  }, [isPlaying, subtitles, currentSection, onSectionChange]);

  // Auto-scrolling effect
  useEffect(() => {
    if (isPlaying) {
      const audio = audioRef.current;
      if (!audio) return;

      // Immediate section sync based on current time
      const currentTime = audio.currentTime;
      const newSection = subtitles.findIndex((subtitle, index) => {
        const nextSubtitle = subtitles[index + 1];
        return currentTime >= subtitle.startTime && (!nextSubtitle || currentTime < nextSubtitle.startTime);
      });

      if (newSection !== -1 && newSection !== currentSection) {
        setCurrentSection(newSection);
        onSectionChange?.(newSection);
      }
    }

    return setupAutoScroll(
      isPlaying,
      isComplete,
      currentSection,
      subtitles,
      setCurrentSection,
      setCurrentText,
      scrollInterval
    );
  }, [isPlaying, isComplete, currentSection, subtitles, scrollInterval, onSectionChange]);

  // Create playback controls with enhanced restart behavior
  const { togglePlayback, restart } = createPlaybackControls(
    audioRef,
    setIsPlaying,
    setCurrentSection,
    setIsComplete,
    setProgress,
    toast,
    () => {
      console.log('Restarting narrative and scrolling to first section');
      onSectionChange?.(0);
    }
  );

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