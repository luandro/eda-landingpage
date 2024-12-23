import { useEffect, useRef, useState, useCallback } from "react";

interface SmoothScrollOptions {
  threshold?: number;
  animationDuration?: number;
  debounceTime?: number;
}

export const useSmoothScroll = (options: SmoothScrollOptions = {}) => {
  const [activeSection, setActiveSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const sectionsRef = useRef<HTMLDivElement[]>([]);
  const scrollTimeout = useRef<NodeJS.Timeout>();
  const scrollLock = useRef(false);

  const {
    threshold = 50,
    animationDuration = 1000,
    debounceTime = 50,
  } = options;

  // Cleanup function to reset scroll state
  const cleanupScroll = useCallback(() => {
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }
    setIsScrolling(false);
    scrollLock.current = false;
    document.body.style.overflow = "";
  }, []);

  // Validate section index and ref existence
  const isValidSection = useCallback((index: number) => {
    return (
      index >= 0 &&
      index < sectionsRef.current.length &&
      sectionsRef.current[index] !== null
    );
  }, []);

  const scrollToSection = useCallback(
    (index: number) => {
      if (!isValidSection(index) || scrollLock.current) return;

      cleanupScroll();
      scrollLock.current = true;
      setIsScrolling(true);
      setActiveSection(index);

      const targetSection = sectionsRef.current[index];
      if (targetSection) {
        document.body.style.overflow = "hidden";

        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                observer.disconnect();
                cleanupScroll();
              }
            });
          },
          { threshold: 0.5 },
        );

        observer.observe(targetSection);
        targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    [isValidSection, cleanupScroll],
  );

  useEffect(() => {
    let touchStartY = 0;
    let lastScrollTime = Date.now();

    const handleScroll = (delta: number) => {
      const currentTime = Date.now();
      if (currentTime - lastScrollTime < debounceTime || scrollLock.current)
        return;

      lastScrollTime = currentTime;
      const direction = delta > 0 ? 1 : -1;
      const nextSection = activeSection + direction;

      if (isValidSection(nextSection)) {
        scrollToSection(nextSection);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      handleScroll(e.deltaY);
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (scrollLock.current) {
        e.preventDefault();
        return;
      }

      const touchEndY = e.touches[0].clientY;
      const deltaY = touchStartY - touchEndY;

      if (Math.abs(deltaY) > threshold) {
        e.preventDefault();
        handleScroll(deltaY);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (scrollLock.current) return;

      switch (e.key) {
        case "ArrowDown":
        case "PageDown":
          e.preventDefault();
          handleScroll(1);
          break;
        case "ArrowUp":
        case "PageUp":
          e.preventDefault();
          handleScroll(-1);
          break;
      }
    };

    document.addEventListener("wheel", handleWheel, { passive: false });
    document.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("wheel", handleWheel);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("keydown", handleKeyDown);
      cleanupScroll();
    };
  }, [
    activeSection,
    threshold,
    debounceTime,
    isValidSection,
    scrollToSection,
    cleanupScroll,
  ]);

  return { activeSection, sectionsRef, scrollToSection };
};
