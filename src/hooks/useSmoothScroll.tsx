import { useEffect, useRef, useState } from 'react';

export const useSmoothScroll = () => {
  const [activeSection, setActiveSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const sectionsRef = useRef<HTMLDivElement[]>([]);
  
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let lastScrollTime = Date.now();
    const scrollThreshold = 50; // ms between scroll events
    
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      const currentTime = Date.now();
      if (currentTime - lastScrollTime < scrollThreshold) return;
      lastScrollTime = currentTime;
      
      if (isScrolling) return;
      
      const direction = e.deltaY > 0 ? 1 : -1;
      const nextSection = Math.min(
        Math.max(activeSection + direction, 0),
        sectionsRef.current.length - 1
      );
      
      if (nextSection !== activeSection) {
        setIsScrolling(true);
        setActiveSection(nextSection);
        
        sectionsRef.current[nextSection]?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
        
        timeoutId = setTimeout(() => setIsScrolling(false), 1000);
      }
    };
    
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      const startY = touch.pageY;
      
      const handleTouchMove = (e: TouchEvent) => {
        const touch = e.touches[0];
        const deltaY = touch.pageY - startY;
        
        if (Math.abs(deltaY) > 50) {
          const direction = deltaY < 0 ? 1 : -1;
          const nextSection = Math.min(
            Math.max(activeSection + direction, 0),
            sectionsRef.current.length - 1
          );
          
          if (nextSection !== activeSection) {
            setActiveSection(nextSection);
            sectionsRef.current[nextSection]?.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            });
          }
          
          document.removeEventListener('touchmove', handleTouchMove);
        }
      };
      
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', () => {
        document.removeEventListener('touchmove', handleTouchMove);
      }, { once: true });
    };
    
    document.addEventListener('wheel', handleWheel, { passive: false });
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    
    return () => {
      document.removeEventListener('wheel', handleWheel);
      document.removeEventListener('touchstart', handleTouchStart);
      clearTimeout(timeoutId);
    };
  }, [activeSection, isScrolling]);
  
  return { activeSection, sectionsRef };
};