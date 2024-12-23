import React from "react";
import { Mail, Github } from "lucide-react";
import { contactInfo, organizations } from "@/config/content";
import AudioPlayer from "../AudioPlayer";
import TypewriterText from "../TypewriterText";
import DividingLine from "../DividingLine";

const logos = [
  {
    category: 'funders',
    name: 'HP',
    logo: 'https://banner2.cleanpng.com/20180413/lyw/avfbdsl42.webp',
    description: 'Hewlett-Packard Company',
    website: 'https://www.hp.com',
    invert: false
  },
  {
    category: 'developers',
    name: 'Awana Digital',
    logo: 'https://cdn.prod.website-files.com/65fdc7abae501de4e3e82a40/664e5bcc334210d16d6b9f70_AD-Temp-Logomark-HiRes.png',
    description: 'Digital Innovation Agency',
    website: 'https://awanadigital.com',
    invert: false
  },
  {
    category: 'developers',
    name: 'Terra Krya',
    logo: 'https://www.terrakrya.com/api/uploads/images/Estudo_Terracrya_03-1-1653617568395.png',
    description: 'Sustainable Technology Solutions',
    website: 'https://www.terrakrya.com',
    invert: true
  }
];

const subtitlesContact = [
  {
    text: "para saber mais",
    backgroundColor: "#4CAF50",
    textColor: "white" as const,
  },
  {
    text: "para tirar dúvidas",
    backgroundColor: "#FF5722",
    textColor: "white" as const,
  },
  {
    text: "para fazer parte",
    backgroundColor: "#2196F3",
    textColor: "white" as const,
  },
];


const ContactSection: React.FC = () => {
  const contactItems = [
    {
      icon: Mail,
      href: `mailto:${contactInfo.email}`,
      text: "E-Mail",
    },
    {
      icon: Github,
      href: contactInfo.github,
      text: "GitHub",
      external: true,
    },
  ];

  return (
    <div className="relative grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
      <DividingLine />
      <div className="space-y-8 animate-fade-in text-center">
        <div className="text-2xl md:text-3xl lg:text-4xl text-left h-[8vh] sm:h-[15vh] md:h-[15vh] ">
          <TypewriterText
            text={'Entre em contato'}
            subtitles={subtitlesContact}
            rotationSpeed={4000}
            delay={50}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {contactItems.map((item, index) => (
            <a
              key={item.href}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              className={`flex justify-center items-center text-white font-bold py-2 px-4 rounded transition-colors ${index % 2 === 0 ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"
                }`}
            >
              <item.icon className="h-5 w-5 mr-2" />
              <span>{item.text}</span>
            </a>
          ))}
        </div>
      </div>

      <div className="flex justify-center items-center animate-scale-in">
        <AudioPlayer />
      </div>

      <div className="space-y-8 animate-fade-in delay-200 text-center">
        <h2 className="text-medium text-eda-green mb-6">
          Desenvolvido por
        </h2>
        <div className="grid grid-cols-1 gap-8">
          {logos
            .filter(logo => logo.category === 'developers')
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
                    className={`h-12 object-contain mb-4 ${developer.invert ? 'invert' : ''}`}
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
            .filter(logo => logo.category === 'funders')
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
                  className={`h-16 object-contain ${funder.invert ? 'invert' : ''}`}
                />
              </a>
            ))}
        </div>
      </div>

      <div className="col-span-full mt-12">

      </div>
      <div className="relative">
        <div className="fixed h-[50px] w-[50px] md:h-[75px] md:w-[75px] bottom-20 right-8 flex justify-center items-center bg-white shadow-lg rounded-full">
          <a
            href={`https://wa.me/${contactInfo.phone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex justify-center items-center h-full w-full bg-eda-green hover:bg-eda-green/90 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            <span className="sr-only">Chat</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 16.5A5.5 5.5 0 0115.5 22H6l-4 4V6.5A5.5 5.5 0 017.5 1h8A5.5 5.5 0 0121 6.5v10z" />
            </svg>
          </a>
          <div className="absolute -top-12 -left-4 md:-left-2 flex flex-col items-center animate-bounce w-[90px]">
            <div className="bg-eda-green text-white px-4 py-2 rounded-lg shadow-lg text-xs">
              <span>Try me out</span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="-mt-8 h-16 w-16 text-green-700" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 16l-6-6h12l-6 6z" />
            </svg>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ContactSection;
