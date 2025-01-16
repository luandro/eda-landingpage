import React, { createContext, useContext, useEffect } from "react";
import { loadSRTFile } from "../lib/narrativeUtils";
import { createPlaybackControls } from "../lib/narrativeUtils/playbackControls";
import { createRestartHandler } from "../lib/narrativeUtils/restartHandler";
import { NarrativeContextType } from "../types/narrative";
import { useNarrativeState } from "./useNarrativeState";
import { useAudioHandlers } from "@/hooks/useAudioHandlers";
import { useAutoScroll } from "@/hooks/useAutoScroll";

const NarrativeContext = createContext<NarrativeContextType | undefined>(undefined);

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

  // Handle audio events
  const { handleTimeUpdate, handleEnded } = useAudioHandlers(
    audioRef,
    setIsPlaying,
    setIsComplete,
    setCurrentText,
    setProgress,
    setCurrentSection,
    subtitles
  );

  // Set up audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [handleTimeUpdate, handleEnded]);

  // Handle auto-scrolling
  useAutoScroll(
    isPlaying,
    isComplete,
    currentSection,
    subtitles,
    setCurrentSection,
    setCurrentText,
    scrollInterval,
    scrollToSection
  );

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