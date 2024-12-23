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
    <div className="fixed right-2 top-1/2 transform -translate-y-1/2 z-50">
      <div className="relative flex flex-col items-center bg-white rounded-full shadow-md p-4">
        {/* Vertical line segments */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[calc(100%-3rem)] flex flex-col justify-between">
          {Array.from({ length: totalSections - 1 }, (_, index) => (
            <div
              key={index}
              className={`
                w-[2px] h-8 transition-all duration-300
                ${index < activeSection ? "bg-eda-green shadow-[0_0_8px_rgba(74,222,128,0.4)]" : "bg-gray-600"}
              `}
            />
          ))}
        </div>

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
                    index <= activeSection
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
                  ${index <= activeSection ? "text-eda-green" : "text-gray-600"}
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
