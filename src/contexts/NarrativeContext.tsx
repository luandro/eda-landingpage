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

/**
 * NarrativeContext orchestrates audio playback and subtitle synchronization by utilizing
 * several specialized utility modules:
 *
 * 1. audioHandler - Manages audio playback events and time synchronization
 * 2. srtLoader - Handles loading and parsing of SRT subtitle files
 * 3. playbackControls - Provides play/pause and restart functionality
 * 4. autoScroll - Manages automatic scrolling through subtitle sections
 */

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
