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
    <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50">
      <div className="relative flex flex-col items-center">
        {/* Vertical line */}
        <div className="absolute h-full w-[2px] bg-gray-200 -z-10" />
        
        {/* Navigation dots with labels */}
        <div className="flex flex-col items-center space-y-8">
          {Array.from({ length: totalSections }, (_, index) => (
            <button
              key={index}
              onClick={() => onSectionChange(index)}
              className="group relative flex items-center"
              aria-label={`Go to section ${index + 1}`}
            >
              {/* Dot */}
              <div
                className={`
                  w-4 h-4 rounded-full transition-all duration-300
                  ${
                    activeSection === index
                      ? "bg-eda-green scale-110 shadow-lg"
                      : "bg-gray-300 hover:bg-gray-400"
                  }
                `}
              />
              
              {/* Label */}
              <span
                className={`
                  absolute left-0 transform -translate-x-[calc(100%+12px)]
                  text-sm whitespace-nowrap opacity-0 group-hover:opacity-100
                  transition-opacity duration-200
                  ${activeSection === index ? "text-eda-green" : "text-gray-600"}
                `}
              >
                {index === 0 && "Home"}
                {index === 1 && "Categories"}
                {index === 2 && "Features"}
                {index === 3 && "Contact"}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};