import React from 'react';

interface TypewriterCursorProps {
  isVisible: boolean;
}

const TypewriterCursor: React.FC<TypewriterCursorProps> = ({ isVisible }) => {
  if (!isVisible) return null;
  
  return <span className="animate-blink ml-0.5">|</span>;
};

export default TypewriterCursor;