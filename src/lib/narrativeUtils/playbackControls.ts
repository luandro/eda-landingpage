import { ToastOptions } from "../../types/toast";

export const createPlaybackControls = (
  audioRef: React.RefObject<HTMLAudioElement>,
  setIsPlaying: (playing: boolean) => void,
  setCurrentSection: (section: number) => void,
  setIsComplete: (complete: boolean) => void,
  setProgress: (progress: number) => void,
  toast: (options: ToastOptions) => void,
) => {
  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play().catch((error) => {
        console.error("Error playing audio:", error);
        toast({
          title: "Error",
          description: "Failed to play audio",
          variant: "destructive",
        });
      });
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const restart = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = 0;
    setCurrentSection(0);
    setIsComplete(false);
    setProgress(0);

    audio.play().catch((error) => {
      console.error("Error playing audio:", error);
      toast({
        title: "Error",
        description: "Failed to restart audio",
        variant: "destructive",
      });
    });
    setIsPlaying(true);
  };

  return { togglePlayback, restart };
};