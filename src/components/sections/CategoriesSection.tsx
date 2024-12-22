import React from "react";
import TypewriterText from "../TypewriterText";
import AudioPlayer from "../AudioPlayer";
import Categories from "../Categories";
import DividingLine from "../DividingLine";

interface CategoriesSectionProps {
  selectedCategory: number | null;
  onCategorySelect: (categoryId: number) => void;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
}

const subtitlesCategories = [
  {
    text: "Financiamentos",
    backgroundColor: "#4CAF50",
    textColor: "white" as const,
  },
  {
    text: "Cursos Online",
    backgroundColor: "#FF5722",
    textColor: "white" as const,
  },
  {
    text: "Ferramentas",
    backgroundColor: "#2196F3",
    textColor: "white" as const,
  },
  {
    text: "Autonomia",
    backgroundColor: "#4CAF50",
    textColor: "white" as const,
  },
];

const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  selectedCategory,
  onCategorySelect,
  isPlaying,
  onPlay,
  onPause,
}) => {
  return (
    <div className="relative grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
      <div className="mb-12 text-2xl md:text-3xl lg:text-4xl space-y-6 animate-fade-in transform translate-y-0 transition-transform duration-1000">
        <div className="h-[5vh] sm:h-[15vh] md:h-[15vh] font-bold text-eda-green items-start">
          <TypewriterText
            text={'Explore nossas categorias de conteúdo...'}
            subtitles={subtitlesCategories}
            rotationSpeed={4000}
            delay={50}
          />
        </div>
      </div>

      <div className="flex justify-center items-center animate-scale-in mb-12 md:mb-0">
        <AudioPlayer isPlaying={isPlaying} onPlay={onPlay} onPause={onPause} />
      </div>

      <div className="block animate-slide-in-right h-[60vh]">
        <Categories selectedCategory={selectedCategory} onCategorySelect={onCategorySelect} />
      </div>
    </div>
  );
};

export default CategoriesSection;
