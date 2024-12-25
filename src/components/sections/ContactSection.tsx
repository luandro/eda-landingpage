import React from "react";
import { Mail, Github } from "lucide-react";
import { contactInfo } from "@/config/content";
import AudioPlayer from "../AudioPlayer";
import TypewriterText from "../TypewriterText";
import DividingLine from "../DividingLine";
import ContactButton from "../ContactButton";
import { useNarrative } from "@/contexts/NarrativeContext";

interface ContactSectionProps {
  text: string;
  defaultMarkdown: string;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  activeSection: number;
}

const ContactSection: React.FC<ContactSectionProps> = ({
  text,
  defaultMarkdown,
  isPlaying,
  onPlay,
  onPause,
  activeSection
}) => {
  const { isComplete, restart } = useNarrative();

  const contactButtons = [
    {
      icon: Mail,
      label: "E-Mail",
      href: `mailto:${contactInfo.email}`,
      color: "bg-gradient-to-r from-eda-green to-eda-green-light",
      external: false
    },
    {
      icon: Github,
      label: "GitHub",
      href: contactInfo.github,
      color: "bg-gradient-to-r from-gray-700 to-gray-600",
      external: true
    }
  ];

  return (
    <div className="relative grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
      <DividingLine />
      <div className="space-y-8 animate-fade-in text-center">
        <div className="text-2xl md:text-3xl lg:text-4xl text-left h-[8vh] sm:h-[15vh] md:h-[15vh]">
          <TypewriterText
            text={text}
            defaultMarkdown={defaultMarkdown}
            rotatingText={subtitlesContact}
            rotationSpeed={4000}
            delay={50}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {contactButtons.map((button, index) => (
            <ContactButton key={index} {...button} />
          ))}
        </div>
      </div>

      <div className="flex justify-center items-center animate-scale-in">
        <AudioPlayer
          isPlaying={isPlaying}
          onPlay={onPlay}
          onPause={onPause}
          isComplete={isComplete}
          onRestart={restart}
        />
      </div>

      <div className="space-y-8 animate-fade-in delay-200 text-center">
        <h2 className="text-medium text-eda-green mb-6">Desenvolvido por</h2>
        <div className="grid grid-cols-1 gap-8">
          {logos
            .filter((logo) => logo.category === "developers")
            .map((developer) => (
              <div key={developer.name} className="flex flex-col items-center">
                <a
                  href={developer.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity"
                >
                  <img
                    src={developer.logo}
                    alt={developer.name}
                    className={`h-12 object-contain mb-4 ${developer.invert ? "invert" : ""}`}
                  />
                </a>
                {/* <span className="text-sm text-gray-600">{developer.description}</span> */}
              </div>
            ))}
        </div>
        <h2 className="text-medidum text-eda-green mb-8 text-center">
          Financiadores
        </h2>
        <div className="flex justify-center">
          {logos
            .filter((logo) => logo.category === "funders")
            .map((funder) => (
              <a
                key={funder.name}
                href={funder.website}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                <img
                  src={funder.logo}
                  alt={funder.name}
                  className={`h-16 object-contain ${funder.invert ? "invert" : ""}`}
                />
              </a>
            ))}
        </div>
      </div>

      <div className="col-span-full mt-12"></div>
      <div className="relative">
        <div className="fixed h-[50px] w-[50px] md:h-[75px] md:w-[75px] bottom-20 right-8 flex justify-center items-center bg-white shadow-lg rounded-full">
          <a
            href={`https://wa.me/${contactInfo.phone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex justify-center items-center h-full w-full bg-eda-green hover:bg-eda-green/90 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            <span className="sr-only">Chat</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 md:h-8 md:w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M21 16.5A5.5 5.5 0 0115.5 22H6l-4 4V6.5A5.5 5.5 0 017.5 1h8A5.5 5.5 0 0121 6.5v10z"
              />
            </svg>
          </a>
          <div className="absolute -top-12 -left-4 md:-left-2 flex flex-col items-center animate-bounce w-[90px]">
            <div className="bg-eda-green text-white px-4 py-2 rounded-lg shadow-lg text-xs">
              <span>Try me out</span>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="-mt-8 h-16 w-16 text-green-700"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 16l-6-6h12l-6 6z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
