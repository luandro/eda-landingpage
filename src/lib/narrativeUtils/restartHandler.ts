import { NarrativeStateHandlers } from "@/types/narrative";

export const createRestartHandler = ({
  restart,
  setCurrentSection,
  setIsPlaying,
  scrollToSection
}: NarrativeStateHandlers) => {
  return () => {
    console.log("Handling restart - resetting state and scrolling to first section");
    
    // Stop playback first
    setIsPlaying(false);
    
    // Reset section and trigger scroll immediately
    setCurrentSection(0);
    if (scrollToSection) {
      console.log("Triggering scroll to first section");
      scrollToSection(0);
    }
    
    // Reset audio and progress
    restart();
    
    // Resume playback after state updates
    setTimeout(() => {
      console.log("Resuming playback after restart");
      setIsPlaying(true);
    }, 100); // Increased timeout to ensure scroll completes
  };
};