import { ToastOptions } from "../../types/toast";

export const createPlaybackControls = (
  audioRef: React.RefObject<HTMLAudioElement>,
  setIsPlaying: (playing: boolean) => void,
  setCurrentSection: (section: number) => void,
  setIsComplete: (complete: boolean) => void,
  setProgress: (progress: number) => void,
  toast: (options: ToastOptions) => void,
  onRestart?: () => void,
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

    console.log('Restarting playback');
    setIsPlaying(false);
    audio.currentTime = 0;
    setCurrentSection(0);
    setIsComplete(false);
    setProgress(0);
    onRestart?.();

    setTimeout(() => {
      audio.play().catch((error) => {
        console.error("Error playing audio:", error);
        toast({
          title: "Error",
          description: "Failed to restart audio",
          variant: "destructive",
        });
      });
      setIsPlaying(true);
    }, 50);
  };

  return { togglePlayback, restart };
};