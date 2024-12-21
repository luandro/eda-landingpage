import React, { useState, useCallback, useEffect } from "react";
import { ArrowLeft, Mail, Phone, Globe, Github } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TypewriterText from "../components/TypewriterText";
import RotatingSubtitles from "../components/RotatingSubtitles";
import AudioPlayer from "../components/AudioPlayer";
import ExampleChat from "../components/ExampleChat";
import DividingLine from "../components/DividingLine";
import UseCases from "../components/UseCases";
import Section from "../components/Section";
import { NavigationDots } from "@/components/ui/navigation-dots";
import { useSmoothScroll } from "../hooks/useSmoothScroll";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import { Button } from "@/components/ui/button";
import {
  subtitles,
  categories,
  contactInfo,
  organizations,
} from "../config/content";

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

const Index = () => {
  const [currentText, setCurrentText] = useState("Olá, meu nome é Eda");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const { activeSection, sectionsRef, scrollToSection } = useSmoothScroll({
    threshold: 50,
    animationDuration: 800,
  });

  const {
    isPlaying,
    showSubtitles: showRotatingSubtitles,
    audioRef,
    handlePlay,
    handlePause,
  } = useAudioPlayer({
    subtitles,
    onTextChange: setCurrentText,
  });

  // Handle category selection and body scroll
  const handleCategorySelect = useCallback((categoryId: number) => {
    setSelectedCategory(categoryId);
    // Use a class instead of inline styles for better performance
    document.body.classList.add("category-open");
  }, []);

  // Handle category close
  const handleCategoryClose = useCallback(() => {
    setSelectedCategory(null);
    document.body.classList.remove("category-open");
    // Ensure we're back to the categories section
    // Use a small delay to ensure smooth transition
    setTimeout(() => {
      scrollToSection(1);
    }, 100);
  }, [scrollToSection]);

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

      <DividingLine />

      {/* Hero Section */}
      <Section
        index={0}
        activeSection={activeSection}
        setRef={(el: HTMLDivElement | null) => {
          if (el) sectionsRef.current[0] = el;
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="space-y-6 animate-fade-in transform translate-y-0 transition-transform duration-1000">
            <div className="text-4xl md:text-6xl font-bold text-eda-green">
              <TypewriterText text={currentText} />
            </div>
            {showRotatingSubtitles && <RotatingSubtitles />}
          </div>

          <div className="flex justify-center items-center animate-scale-in">
            <AudioPlayer
              isPlaying={isPlaying}
              onPlay={handlePlay}
              onPause={handlePause}
            />
          </div>

          <div className="block animate-slide-in-right">
            <ExampleChat />
          </div>
        </div>
        <div
          className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-white/20"
          style={{
            transform: `translateY(${(1 - activeSection) * 20}%)`,
            transition: "transform 0.8s ease-in-out",
          }}
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
        <div className="relative w-full h-full">
          {/* Categories Grid */}
          <div
            className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-500 ease-in-out ${
              selectedCategory !== null
                ? "opacity-0 -translate-x-full"
                : "opacity-100 translate-x-0"
            }`}
            role="grid"
            aria-label="Categories"
          >
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className={`group p-8 bg-white/5 rounded-lg border-2 transition-all duration-300 text-left hover:shadow-lg ${
                  selectedCategory === category.id
                    ? "border-eda-green bg-eda-green/5"
                    : "border-gray-200 hover:border-eda-green"
                }`}
                aria-label={`Select ${category.title} category`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-eda-green mb-2 group-hover:translate-x-2 transition-transform">
                    {category.title}
                  </h3>
                  <motion.div
                    className="text-eda-green opacity-0 group-hover:opacity-100"
                    initial={{ x: -10 }}
                    animate={{ x: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ArrowLeft className="transform rotate-180" size={20} />
                  </motion.div>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {category.description}
                </p>
              </motion.button>
            ))}
          </div>

          {/* Chat Interface */}
          <AnimatePresence mode="wait">
            {selectedCategory !== null && (
              <>
                <motion.div
                  className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 category-transition"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={handleCategoryClose}
                />
                <motion.div
                  className="fixed inset-0 bg-white z-50 touch-pan-x category-transition"
                  role="dialog"
                  aria-modal="true"
                  aria-label="Chat interface"
                  initial="category-enter"
                  animate="category-enter-active"
                  exit="category-exit-active"
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(e, { offset, velocity }) => {
                    const swipe = swipePower(offset.x, velocity.x);
                    if (swipe > swipeConfidenceThreshold || offset.x > 100) {
                      handleCategoryClose();
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Escape" || e.key === "ArrowLeft") {
                      handleCategoryClose();
                    }
                  }}
                  tabIndex={0}
                >
                  <div className="h-full max-h-screen overflow-hidden">
                    <motion.div
                      className="fixed top-4 left-4 z-10"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Button
                        variant="ghost"
                        onClick={handleCategoryClose}
                        className="group flex items-center text-eda-green hover:text-eda-green/80 transition-all duration-300 category-transition"
                        aria-label="Back to categories"
                      >
                        <ArrowLeft className="mr-2 transition-transform group-hover:-translate-x-2" />
                        <span className="font-medium">Voltar</span>
                      </Button>
                    </motion.div>

                    <motion.div
                      className="pt-16 px-4 h-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <ExampleChat className="max-w-4xl mx-auto" />
                    </motion.div>

                    <motion.div
                      className="fixed bottom-8 left-1/2 transform -translate-x-1/2 text-gray-400 flex items-center gap-2 pointer-events-none select-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{
                        delay: 1,
                        duration: 2,
                        times: [0, 0.5, 1],
                        repeat: Infinity,
                        repeatDelay: 3,
                      }}
                    >
                      <ArrowLeft size={16} />
                      <span className="text-sm">Deslize para voltar</span>
                    </motion.div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8 animate-fade-in">
            <h2 className="text-3xl font-bold text-eda-green mb-6">
              Entre em Contato
            </h2>
            <div className="space-y-4">
              <a
                href={`mailto:${contactInfo.email}`}
                className="flex items-center space-x-3 text-gray-600 hover:text-eda-green transition-colors"
              >
                <Mail className="h-5 w-5" />
                <span>{contactInfo.email}</span>
              </a>
              <a
                href={`tel:${contactInfo.phone}`}
                className="flex items-center space-x-3 text-gray-600 hover:text-eda-green transition-colors"
              >
                <Phone className="h-5 w-5" />
                <span>{contactInfo.phone}</span>
              </a>
              <a
                href={`https://${contactInfo.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-gray-600 hover:text-eda-green transition-colors"
              >
                <Globe className="h-5 w-5" />
                <span>{contactInfo.website}</span>
              </a>
              <a
                href={contactInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-gray-600 hover:text-eda-green transition-colors"
              >
                <Github className="h-5 w-5" />
                <span>GitHub</span>
              </a>
            </div>
          </div>

          {/* Acknowledgments */}
          <div className="space-y-8 animate-fade-in delay-200">
            <h2 className="text-3xl font-bold text-eda-green mb-6">
              Agradecimentos
            </h2>
            <div className="grid grid-cols-2 gap-6">
              {organizations.map((org) => (
                <div
                  key={org.id}
                  className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full" />
                  <h3 className="text-lg font-semibold text-center mb-2">
                    {org.name}
                  </h3>
                  <p className="text-sm text-gray-600 text-center">
                    {org.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <audio ref={audioRef}>
        <source src="/path-to-your-audio.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default Index;
