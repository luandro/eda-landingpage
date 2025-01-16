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
}

export const NarrativeProvider: React.FC<NarrativeProviderProps> = ({
  children,
  srtPath = "/subtitles.srt",
  audioPath = "/audio.mp3",
  scrollInterval = 3000,
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
  }, [isPlaying, isComplete, currentSection, subtitles, scrollInterval]);

  // Update text when section changes
  useEffect(() => {
    if (!isPlaying) {
      setCurrentText(
        subtitles[currentSection]?.text || subtitles[0]?.text || "",
      );
    }
  }, [currentSection, isPlaying]);

  // Create playback controls with enhanced restart functionality
  const { togglePlayback, restart } = createPlaybackControls(
    audioRef,
    setIsPlaying,
    setCurrentSection,
    setIsComplete,
    setProgress,
    toast
  );

  // Enhanced restart handler that ensures scrolling to first section
  const handleRestart = () => {
    console.log("Handling restart - scrolling to first section");
    restart();
    setCurrentSection(0);
    // Force scroll to top after a small delay to ensure state updates
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  return (
    <NarrativeContext.Provider
      value={{
        isPlaying,
        currentText,
        currentSection,
        isComplete,
        progress,
        togglePlayback,
        restart: handleRestart, // Use enhanced restart handler
        setCurrentSection,
        audioRef,
      }}
    >
      {children}
      <audio ref={audioRef} src={audioPath} />
    </NarrativeContext.Provider>
  );
};