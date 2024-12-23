import React, { useEffect, useState } from "react";
import { SubtitleEntry, getCurrentSubtitle } from "@/utils/srtUtils";
import { cn } from "@/lib/utils";

interface SRTRendererProps {
  subtitles: SubtitleEntry[];
  currentTime: number;
  className?: string;
}

const SRTRenderer: React.FC<SRTRendererProps> = ({
  subtitles,
  currentTime,
  className,
}) => {
  const [currentSubtitle, setCurrentSubtitle] = useState<SubtitleEntry | null>(
    null,
  );

  useEffect(() => {
    const subtitle = getCurrentSubtitle(subtitles, currentTime);
    setCurrentSubtitle(subtitle);
  }, [subtitles, currentTime]);

  if (!currentSubtitle) return null;

  return (
    <span className={cn("inline-block", className)}>
      {currentSubtitle.text}
    </span>
  );
};

export default SRTRenderer;
