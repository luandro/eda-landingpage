import { useState, useEffect } from "react";
import Section from "../components/Section";
import DividingLine from "../components/DividingLine";
import { NavigationDots } from "../components/ui/navigation-dots";
import { useSmoothScroll } from "../hooks/useSmoothScroll";
import { useCategoryNavigation } from "../hooks/useCategoryNavigation";
import HeroSection from "../components/sections/HeroSection";
import CategoriesSection from "../components/sections/CategoriesSection";
import FeaturesSection from "../components/sections/FeaturesSection";
import ContactSection from "../components/sections/ContactSection";
import { useLocation } from "react-router-dom";
import { NarrativeProvider, useNarrative } from "../contexts/NarrativeContext";
import { AutoScroll } from "../lib/narrativeUtils/autoScroll";

const sectionHashes = ["hero", "categories", "features", "contact"];

const IndexContent = () => {
  const [autoScroller, setAutoScroller] = useState<AutoScroll | null>(null);
  const { activeSection, sectionsRef, scrollToSection } = useSmoothScroll({
    threshold: 50,
    animationDuration: 800,
  });
  
  const { 
    currentText, 
    isPlaying, 
    togglePlayback, 
    isComplete,
    audioRef,
    currentSection 
  } = useNarrative();

  // Handle initial scroll sync with audio timestamp
  useEffect(() => {
    if (audioRef.current) {
      const currentTime = audioRef.current.currentTime;
      console.log('Current audio time:', currentTime, 'Current section:', currentSection);
      
      if (currentSection !== activeSection) {
        console.log('Scrolling to section:', currentSection);
        scrollToSection(currentSection);
      }
    }
  }, [currentSection, activeSection, scrollToSection, audioRef]);

  // Handle auto-scrolling during playback
  useEffect(() => {
    const scroller = new AutoScroll({
      scrollInterval: 3000,
      onScroll: (sectionIndex) => {
        if (sectionIndex < sectionHashes.length) {
          scrollToSection(sectionIndex);
        }
      }
    });
    setAutoScroller(scroller);

    if (isPlaying) {
      console.log('Auto scroll state:', { isPlaying, isComplete });
      if (isComplete) {
        console.log('Narrative complete, scrolling to start');
        scrollToSection(0);
      }
      console.log('Starting auto scroll');
      scroller.start();
    } else {
      scroller.stop();
    }

    return () => {
      scroller.stop();
    };
  }, [scrollToSection, isPlaying, isComplete]);

  const { selectedCategory, handleCategorySelect } = useCategoryNavigation(scrollToSection);
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null);
  const location = useLocation();

  // Handle hash navigation
  useEffect(() => {
    const hash = location.hash.replace("#", "");
    const index = sectionHashes.indexOf(hash);
    console.log('Hash navigation:', { hash, index });

    if (index !== -1) {
      console.log('Scrolling to hash section:', index);
      setTimeout(() => {
        scrollToSection(index);
      }, 100);
    } else if (!location.hash && sessionStorage.getItem("lastSection")) {
      const lastSection = parseInt(sessionStorage.getItem("lastSection") || "0");
      scrollToSection(lastSection);
    }
  }, [location.hash, scrollToSection]);

  // Save current section
  useEffect(() => {
    console.log('Saving section:', { activeSection });
    sessionStorage.setItem("lastSection", activeSection.toString());

    const newHash = sectionHashes[activeSection];
    if (newHash && location.hash !== `#${newHash}`) {
      console.log('Updating URL hash:', { newHash, currentHash: location.hash });
      window.history.replaceState(null, "", `${window.location.pathname}#${newHash}`);
    }
  }, [activeSection, location.hash]);

  return (
    <div className="min-h-screen overflow-hidden relative">
      <NavigationDots
        totalSections={4}
        activeSection={activeSection}
        onSectionChange={scrollToSection}
      />

      <div className="hidden md:block">
        <DividingLine />
      </div>

      <Section
        index={0}
        activeSection={activeSection}
        setRef={(el: HTMLDivElement | null) => {
          if (el) sectionsRef.current[0] = el;
        }}
      >
        <HeroSection
          text={currentText}
          defaultMarkdown="Olá eu sou a [ÊDA](https://awana.digital), uma assistente"
          isPlaying={isPlaying}
          onPlay={togglePlayback}
          onPause={togglePlayback}
          activeSection={activeSection}
        />
      </Section>

      <Section
        index={1}
        activeSection={activeSection}
        setRef={(el: HTMLDivElement | null) => {
          if (el) sectionsRef.current[1] = el;
        }}
      >
        <CategoriesSection
          text={currentText}
          defaultMarkdown="Testando um, dois três"
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
          isPlaying={isPlaying}
          onPlay={togglePlayback}
          onPause={togglePlayback}
        />
      </Section>

      <Section
        index={2}
        activeSection={activeSection}
        setRef={(el: HTMLDivElement | null) => {
          if (el) sectionsRef.current[2] = el;
        }}
      >
        <FeaturesSection
          text={currentText}
          defaultMarkdown="Testando um, dois três..."
          selectedFeature={selectedFeature}
          onFeatureSelect={setSelectedFeature}
          isPlaying={isPlaying}
          onPlay={togglePlayback}
          onPause={togglePlayback}
          activeSection={activeSection}
        />
      </Section>

      <Section
        index={3}
        activeSection={activeSection}
        setRef={(el: HTMLDivElement | null) => {
          if (el) sectionsRef.current[3] = el;
        }}
        background="bg-gradient-to-b from-white to-gray-50"
      >
        <ContactSection
          text={currentText}
          defaultMarkdown="Testando um, dois três. Meu nome é Goku"
          isPlaying={isPlaying}
          onPlay={togglePlayback}
          onPause={togglePlayback}
          activeSection={activeSection}
        />
      </Section>
    </div>
  );
};

const Index = () => (
  <NarrativeProvider
    srtPath="/subtitles.srt"
    audioPath="/audio.mp3"
    scrollInterval={3000}
  >
    <IndexContent />
  </NarrativeProvider>
);

export default Index;