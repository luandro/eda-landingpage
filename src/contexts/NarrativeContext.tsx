import React, {
  createContext,
  useContext,
  useEffect,
} from "react";
import {
  createAudioHandlers,
  loadSRTFile,
  createPlaybackControls,
  setupAutoScroll,
} from "../lib/narrativeUtils";
import { createRestartHandler } from "../lib/narrativeUtils/restartHandler";
import { NarrativeContextType } from "../types/narrative";
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
  scrollToSection?: (section: number) => void;
}

export const NarrativeProvider: React.FC<NarrativeProviderProps> = ({
  children,
  srtPath = "/subtitles.srt",
  audioPath = "/audio.mp3",
  scrollInterval = 3000,
  scrollToSection,
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

  // Create playback controls
  const { togglePlayback, restart } = createPlaybackControls(
    audioRef,
    setIsPlaying,
    setCurrentSection,
    setIsComplete,
    setProgress,
    toast
  );

  // Create restart handler with scroll functionality
  const handleRestart = createRestartHandler({
    restart,
    setCurrentSection,
    setIsPlaying,
    scrollToSection,
  });

  return (
    <NarrativeContext.Provider
      value={{
        isPlaying,
        currentText,
        currentSection,
        isComplete,
        progress,
        togglePlayback,
        restart: handleRestart,
        setCurrentSection,
        audioRef,
        scrollToSection,
      }}
    >
      {children}
      <audio ref={audioRef} src={audioPath} />
    </NarrativeContext.Provider>
  );
};