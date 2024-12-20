import { useEffect, useRef, useState } from 'react';

interface SmoothScrollOptions {
  threshold?: number; // Minimum scroll distance to trigger transition
  animationDuration?: number; // Duration of scroll animation in ms
}

export const useSmoothScroll = (options: SmoothScrollOptions = {}) => {
  const [activeSection, setActiveSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const sectionsRef = useRef<HTMLDivElement[]>([]);
  const lastScrollTime = useRef(Date.now());
  const { threshold = 50, animationDuration = 1000 } = options;

  const scrollToSection = (index: number) => {
    if (isScrolling || index === activeSection) return;
    
    setIsScrolling(true);
    setActiveSection(index);
    
    sectionsRef.current[index]?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
    
    // Reset scrolling state after animation
    setTimeout(() => setIsScrolling(false), animationDuration);
  };

  useEffect(() => {
    let touchStartY = 0;
    const scrollThreshold = 50; // ms between scroll events

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      const currentTime = Date.now();
      if (currentTime - lastScrollTime.current < scrollThreshold) return;
      lastScrollTime.current = currentTime;
      
      if (isScrolling) return;
      
      const direction = e.deltaY > 0 ? 1 : -1;
      const nextSection = Math.min(
        Math.max(activeSection + direction, 0),
        sectionsRef.current.length - 1
      );
      
      scrollToSection(nextSection);
    };
    
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (isScrolling) return;
      
      const touchEndY = e.touches[0].clientY;
      const deltaY = touchStartY - touchEndY;
      
      if (Math.abs(deltaY) > threshold) {
        const direction = deltaY > 0 ? 1 : -1;
        const nextSection = Math.min(
          Math.max(activeSection + direction, 0),
          sectionsRef.current.length - 1
        );
        scrollToSection(nextSection);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScrolling) return;
      
      switch (e.key) {
        case 'ArrowDown':
        case 'PageDown':
          e.preventDefault();
          scrollToSection(Math.min(activeSection + 1, sectionsRef.current.length - 1));
          break;
        case 'ArrowUp':
        case 'PageUp':
          e.preventDefault();
          scrollToSection(Math.max(activeSection - 1, 0));
          break;
      }
    };
    
    document.addEventListener('wheel', handleWheel, { passive: false });
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('wheel', handleWheel);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeSection, isScrolling, threshold, animationDuration]);
  
  return { activeSection, sectionsRef, scrollToSection };
};