import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Section from "../components/Section";
import DividingLine from "../components/DividingLine";
import { NavigationDots } from "../components/ui/navigation-dots";
import { useSmoothScroll } from "../hooks/useSmoothScroll";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import { useCategoryNavigation } from "../hooks/useCategoryNavigation";
import { subtitles } from "../config/content";
import HeroSection from "../components/sections/HeroSection";
import CategoriesSection from "../components/sections/CategoriesSection";
import ContactSection from "../components/sections/ContactSection";

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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.classList.remove("category-open");
    };
  }, []);

  return (
    <div className="min-h-screen overflow-hidden relative">
      <NavigationDots
        totalSections={3}
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
          onCategoryClose={handleCategoryClose}
        />
      </Section>

      {/* Contact Section */}
      <Section
        index={2}
        activeSection={activeSection}
        setRef={(el: HTMLDivElement | null) => {
          if (el) sectionsRef.current[2] = el;
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
