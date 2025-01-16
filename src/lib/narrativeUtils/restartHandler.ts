import { NarrativeStateHandlers } from "@/types/narrative";

export const createRestartHandler = ({
  restart,
  setCurrentSection,
  setIsPlaying,
  scrollToSection
}: NarrativeStateHandlers) => {
  return () => {
    console.log("Starting restart sequence");
    
    // First stop playback and reset section
    setIsPlaying(false);
    setCurrentSection(0);
    
    // Ensure scroll happens before restarting audio
    if (scrollToSection) {
      console.log("Triggering scroll to first section");
      scrollToSection(0);
    }
    
    // Small delay to ensure scroll completes before audio restarts
    setTimeout(() => {
      console.log("Restarting audio playback");
      restart();
      setIsPlaying(true);
    }, 100);
  };
};