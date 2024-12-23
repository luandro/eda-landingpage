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

const sectionHashes = ['hero', 'categories', 'features', 'contact'];

const IndexContent = () => {
  const { activeSection, sectionsRef, scrollToSection } = useSmoothScroll({
    threshold: 50,
    animationDuration: 800,
  });

  const {
    isPlaying,
    currentText,
    currentSection,
    togglePlayback,
    audioRef,
  } = useNarrative();

  const { selectedCategory, handleCategorySelect } = useCategoryNavigation(scrollToSection);
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null);
  const location = useLocation();

  // Handle hash navigation and restore section
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    const index = sectionHashes.indexOf(hash);
    if (index !== -1) {
      setTimeout(() => {
        scrollToSection(index);
      }, 100);
    } else if (!location.hash && sessionStorage.getItem('lastSection')) {
      const lastSection = parseInt(sessionStorage.getItem('lastSection') || '0');
      scrollToSection(lastSection);
    }
  }, [location.hash, scrollToSection]);

  // Save current section
  useEffect(() => {
    sessionStorage.setItem('lastSection', activeSection.toString());

    const newHash = sectionHashes[activeSection];
    if (newHash && location.hash !== `#${newHash}`) {
      window.history.replaceState(
        null,
        '',
        `${window.location.pathname}#${newHash}`
      );
    }
  }, [activeSection, location.hash]);

  // Sync section with narrative
  useEffect(() => {
    if (isPlaying) {
      scrollToSection(currentSection);
    }
  }, [currentSection, isPlaying, scrollToSection]);

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
          currentText={currentText}
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
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
          isPlaying={isPlaying}
          onPlay={togglePlayback}
          onPause={togglePlayback}
          currentText={currentText}
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
          selectedFeature={selectedFeature}
          onFeatureSelect={setSelectedFeature}
          isPlaying={isPlaying}
          onPlay={togglePlayback}
          onPause={togglePlayback}
          currentText={currentText}
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
          isPlaying={isPlaying}
          onPlay={togglePlayback}
          onPause={togglePlayback}
          currentText={currentText}
          activeSection={activeSection}
        />

      </Section>

      <audio ref={audioRef}>
        <source src="/audio.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
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
