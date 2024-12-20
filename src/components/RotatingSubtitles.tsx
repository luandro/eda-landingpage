import React, { useState, useEffect } from "react";

const subtitles = [
  "Protegendo nossa casa comum",
  "Defendendo os direitos da natureza",
  "Unindo vozes pela Terra",
  "Construindo um futuro sustentável",
];

const RotatingSubtitles: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % subtitles.length);
        setIsVisible(true);
      }, 500);
    }, 4000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="h-8 flex items-center justify-center">
      <p
        className={`text-eda-orange text-lg transition-opacity duration-500 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        {subtitles[currentIndex]}
      </p>
    </div>
  );
};

export default RotatingSubtitles;
