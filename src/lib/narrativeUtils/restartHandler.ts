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
    
    // Reset audio and progress
    restart();
    
    // Reset section and trigger scroll
    setCurrentSection(0);
    if (scrollToSection) {
      scrollToSection(0);
    }
    
    // Resume playback after state updates
    setTimeout(() => {
      console.log("Resuming playback after restart");
      setIsPlaying(true);
    }, 50);
  };
};