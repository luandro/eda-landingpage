import { useState, useEffect } from "react";
import Section from "../components/Section";
import DividingLine from "../components/DividingLine";
import { NavigationDots } from "../components/ui/navigation-dots";
import { useSmoothScroll } from "../hooks/useSmoothScroll";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import { useCategoryNavigation } from "../hooks/useCategoryNavigation";
import { subtitles } from "../config/content";
import HeroSection from "../components/sections/HeroSection";
import CategoriesSection from "../components/sections/CategoriesSection";
import FeaturesSection from "../components/sections/FeaturesSection";
import ContactSection from "../components/sections/ContactSection";
import { useLocation } from "react-router-dom";

const sectionHashes = ['hero', 'categories', 'features', 'contact'];

const Index = () => {
  const [currentText, setCurrentText] = useState("Olá, meu nome é Eda");
  const { activeSection, sectionsRef, scrollToSection } = useSmoothScroll({
    threshold: 50,
    animationDuration: 800,
  });

  const {
    isPlaying,
    audioRef,
    handlePlay,
    handlePause,
  } = useAudioPlayer({
    subtitles,
    onTextChange: setCurrentText,
  });

  const { selectedCategory, handleCategorySelect, handleCategoryClose } =
    useCategoryNavigation(scrollToSection);

  const [selectedFeature, setSelectedFeature] = useState<number | null>(null);
  const location = useLocation();

  // Handle hash navigation and restore section on page load/navigation
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    const index = sectionHashes.indexOf(hash);
    if (index !== -1) {
      // Small delay to ensure smooth transition
      setTimeout(() => {
        scrollToSection(index);
      }, 100);
    } else if (!location.hash && sessionStorage.getItem('lastSection')) {
      // Restore last visited section
      const lastSection = parseInt(sessionStorage.getItem('lastSection') || '0');
      scrollToSection(lastSection);
    }
  }, [location.hash, scrollToSection]);

  // Save current section to session storage
  useEffect(() => {
    sessionStorage.setItem('lastSection', activeSection.toString());
    
    // Update URL without using navigate
    const newHash = sectionHashes[activeSection];
    if (newHash && location.hash !== `#${newHash}`) {
      window.history.replaceState(
        null,
        '',
        `${window.location.pathname}#${newHash}`
      );
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

      {/* Hero Section */}
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
          onPlay={handlePlay}
          onPause={handlePause}
          activeSection={activeSection}
        />
      </Section>

      {/* Categories Section */}
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
          onPlay={handlePlay}
          onPause={handlePause}
        />
      </Section>

      {/* Features Section */}
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
          onPlay={handlePlay}
          onPause={handlePause}
        />
      </Section>

      {/* Contact Section */}
      <Section
        index={3}
        activeSection={activeSection}
        setRef={(el: HTMLDivElement | null) => {
          if (el) sectionsRef.current[3] = el;
        }}
        background="bg-gradient-to-b from-white to-gray-50"
      >
        <ContactSection />
      </Section>

      <audio ref={audioRef}>
        <source src="/path-to-your-audio.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default Index;