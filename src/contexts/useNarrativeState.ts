import { useState, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";

export const useNarrativeState = (srtPath: string, audioPath: string) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentText, setCurrentText] = useState("");
  const [currentSection, setCurrentSection] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [subtitles, setSubtitles] = useState<any[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  return {
    isPlaying,
    setIsPlaying,
    currentText,
    setCurrentText,
    currentSection,
    setCurrentSection,
    currentTime,
    setCurrentTime,
    subtitles,
    setSubtitles,
    isComplete,
    setIsComplete,
    progress,
    setProgress,
    audioRef,
    toast,
  };
};
