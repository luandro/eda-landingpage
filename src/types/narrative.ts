import { RefObject } from "react";

export interface SubtitleEntry {
  id: number;
  startTime: number;
  endTime: number;
  text: string;
}

export interface NarrativeContextType {
  isPlaying: boolean;
  currentText: string;
  currentSection: number;
  isComplete: boolean;
  progress: number;
  togglePlayback: () => void;
  restart: () => void;
  setCurrentSection: (section: number) => void;
  audioRef: RefObject<HTMLAudioElement>;
  scrollToSection?: (section: number) => void;
}

export interface NarrativeStateHandlers {
  restart: () => void;
  setCurrentSection: (section: number) => void;
  setIsPlaying: (playing: boolean) => void;
  scrollToSection?: (section: number) => void;
}