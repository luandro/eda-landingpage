import React from "react";

interface NavigationDotsProps {
  totalSections: number;
  activeSection: number;
  onSectionChange: (index: number) => void;
}

export const NavigationDots: React.FC<NavigationDotsProps> = ({
  totalSections,
  activeSection,
  onSectionChange,
}) => {
  return (
    <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50">
      <div className="flex flex-col items-center space-y-4">
        {Array.from({ length: totalSections }, (_, index) => (
          <button
            key={index}
            onClick={() => onSectionChange(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              activeSection === index
                ? "bg-eda-green scale-125"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Go to section ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
