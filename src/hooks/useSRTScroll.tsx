import { useEffect, useState } from "react";
import { SubtitleEntry, getCurrentSubtitle } from "@/utils/srtUtils";
import { useSmoothScroll } from "./useSmoothScroll";

interface SRTScrollOptions {
  subtitles: SubtitleEntry[];
  currentTime: number;
  sectionMapping: { [key: number]: number }; // Maps subtitle IDs to section indices
  defaultTexts: string[]; // Default text for each section when no subtitle is active
}

export const useSRTScroll = ({
  subtitles,
  currentTime,
  sectionMapping,
  defaultTexts,
}: SRTScrollOptions) => {
  const [currentSubtitle, setCurrentSubtitle] = useState<SubtitleEntry | null>(
    null,
  );
  const { scrollToSection, activeSection, sectionsRef } = useSmoothScroll({
    threshold: 0, // Disable manual scrolling while SRT is playing
    animationDuration: 1000,
  });

  useEffect(() => {
    const subtitle = getCurrentSubtitle(subtitles, currentTime);

    if (subtitle !== currentSubtitle) {
      setCurrentSubtitle(subtitle);

      if (subtitle && sectionMapping[subtitle.id] !== undefined) {
        // Smooth scroll to the mapped section
        scrollToSection(sectionMapping[subtitle.id]);
      }
    }
  }, [
    subtitles,
    currentTime,
    sectionMapping,
    scrollToSection,
    currentSubtitle,
  ]);

  return {
    currentSubtitle,
    activeSection,
    sectionsRef,
    getCurrentText: (sectionIndex: number) => {
      if (
        currentSubtitle &&
        sectionMapping[currentSubtitle.id] === sectionIndex
      ) {
        return currentSubtitle.text;
      }
      return defaultTexts[sectionIndex] || "";
    },
  };
};
