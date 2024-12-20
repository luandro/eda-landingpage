import { useEffect, useRef, useState, useCallback } from "react";

interface SmoothScrollOptions {
  threshold?: number; // Minimum scroll distance to trigger transition
  animationDuration?: number; // Duration of scroll animation in ms
  debounceTime?: number; // Time to wait between scroll events
}

export const useSmoothScroll = (options: SmoothScrollOptions = {}) => {
  const [activeSection, setActiveSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const sectionsRef = useRef<HTMLDivElement[]>([]);
  const lastScrollTime = useRef(Date.now());
  const scrollTimeout = useRef<NodeJS.Timeout>();
  const {
    threshold = 50,
    animationDuration = 1000,
    debounceTime = 50,
  } = options;

  const isValidSection = useCallback((index: number) => {
    return index >= 0 && index < sectionsRef.current.length;
  }, []);

  const scrollToSection = useCallback(
    (index: number) => {
      // Prevent invalid section indices
      if (!isValidSection(index)) return;

      // Prevent scrolling to same section or while already scrolling
      if (isScrolling || index === activeSection) return;

      // Clear any existing scroll timeout
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      setIsScrolling(true);
      setActiveSection(index);

      // Smooth scroll to section
      sectionsRef.current[index]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      // Ensure the page doesn't get stuck between sections
      document.body.style.overflow = "hidden";

      // Reset scrolling state after animation
      scrollTimeout.current = setTimeout(() => {
        setIsScrolling(false);
        document.body.style.overflow = "";
      }, animationDuration);
    },
    [isScrolling, activeSection, animationDuration, isValidSection],
  );

  useEffect(() => {
    let touchStartY = 0;
    let lastScrollTimeout: NodeJS.Timeout;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      // Debounce scroll events
      const currentTime = Date.now();
      if (currentTime - lastScrollTime.current < debounceTime) return;
      lastScrollTime.current = currentTime;

      if (isScrolling) return;

      // Clear any existing timeout
      if (lastScrollTimeout) {
        clearTimeout(lastScrollTimeout);
      }

      // Schedule the scroll after a brief delay to prevent rapid scrolling
      lastScrollTimeout = setTimeout(() => {
        const direction = e.deltaY > 0 ? 1 : -1;
        const nextSection = activeSection + direction;

        if (isValidSection(nextSection)) {
          scrollToSection(nextSection);
        }
      }, 50);
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (isScrolling) return;

      const touchEndY = e.touches[0].clientY;
      const deltaY = touchStartY - touchEndY;

      if (Math.abs(deltaY) > threshold) {
        const direction = deltaY > 0 ? 1 : -1;
        const nextSection = activeSection + direction;

        if (isValidSection(nextSection)) {
          scrollToSection(nextSection);
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScrolling) return;

      let nextSection = activeSection;

      switch (e.key) {
        case "ArrowDown":
        case "PageDown":
          e.preventDefault();
          nextSection = activeSection + 1;
          break;
        case "ArrowUp":
        case "PageUp":
          e.preventDefault();
          nextSection = activeSection - 1;
          break;
        default:
          return;
      }

      if (isValidSection(nextSection)) {
        scrollToSection(nextSection);
      }
    };

    // Add event listeners with proper options
    document.addEventListener("wheel", handleWheel, { passive: false });
    document.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup function
    return () => {
      // Remove event listeners
      document.removeEventListener("wheel", handleWheel);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("keydown", handleKeyDown);

      // Clear any pending timeouts
      if (lastScrollTimeout) {
        clearTimeout(lastScrollTimeout);
      }
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      // Reset body overflow
      document.body.style.overflow = "";
    };
  }, [
    activeSection,
    isScrolling,
    threshold,
    animationDuration,
    debounceTime,
    isValidSection,
    scrollToSection,
  ]);

  return { activeSection, sectionsRef, scrollToSection };
};
