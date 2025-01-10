import React from 'react';
import RotatingText from './RotatingText';
import { SubtitleItem } from './RotatingText';

interface RotatingTextWrapperProps {
  show: boolean;
  subtitles: SubtitleItem[];
  rotationSpeed: number;
  delay: number;
}

const RotatingTextWrapper: React.FC<RotatingTextWrapperProps> = ({
  show,
  subtitles,
  rotationSpeed,
  delay,
}) => {
  if (!show || !subtitles?.length) return null;

  return (
    <RotatingText
      subtitles={subtitles}
      rotationSpeed={rotationSpeed}
      className="ml-1 !rounded-none !px-1 !py-0 !inline"
      typewriterEnabled={true}
      typewriterDelay={delay}
    />
  );
};

export default RotatingTextWrapper;