import React from "react";
import { motion } from "framer-motion";

interface SectionProps {
  index: number;
  activeSection: number;
  setRef: (el: HTMLDivElement | null) => void;
  className?: string;
  children: React.ReactNode;
  background?: string;
}

const Section: React.FC<SectionProps> = ({
  index,
  activeSection,
  setRef,
  className = "",
  children,
  background = "bg-white",
}) => {
  return (
    <section
      ref={setRef}
      className={`
        min-h-screen
        relative
        flex
        items-center
        justify-center
        transition-opacity
        duration-1000
        ${background}
        ${activeSection === index ? "opacity-100" : "opacity-0"}
        ${className}
      `}
    >
      <div className="container mx-auto px-4 py-12">{children}</div>
    </section>
  );
};

export default Section;
