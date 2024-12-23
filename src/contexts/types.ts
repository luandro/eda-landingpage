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
  currentTime: number;
  isComplete: boolean;
  progress: number;
  togglePlayback: () => void;
  restart: () => void;
  setCurrentSection: (section: number) => void;
  audioRef: React.RefObject<HTMLAudioElement>;
}
