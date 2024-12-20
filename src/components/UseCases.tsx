import React from "react";
import { PiggyBank, BookOpen, Sprout, Brain } from "lucide-react";

const UseCases = () => (
  <div className="grid grid-cols-2 gap-4">
    {[
      {
        icon: <PiggyBank className="h-8 w-8" />,
        title: "Fundraising",
        description: "Apoie projetos ambientais",
        bgImage: "photo-1581091226825-a6a2a5aee158",
      },
      {
        icon: <BookOpen className="h-8 w-8" />,
        title: "Courses",
        description: "Aprenda sobre sustentabilidade",
        bgImage: "photo-1487058792275-0ad4aaf24ca7",
      },
      {
        icon: <Sprout className="h-8 w-8" />,
        title: "Agro-ecology",
        description: "Práticas sustentáveis",
        bgImage: "photo-1472396961693-142e6e269027",
      },
      {
        icon: <Brain className="h-8 w-8" />,
        title: "Bioeconomy",
        description: "Soluções inovadoras",
        bgImage: "photo-1485827404703-89b55fcc595e",
      },
    ].map((useCase, index) => (
      <div
        key={index}
        className="relative overflow-hidden rounded-lg group cursor-pointer animate-fade-in"
        style={{
          backgroundImage: `url(https://images.unsplash.com/${useCase.bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "200px",
          animationDelay: `${index * 0.1}s`,
        }}
      >
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-300" />
        <div className="absolute inset-0 p-4 flex flex-col justify-end text-white transform transition-transform duration-300 group-hover:translate-y-[-8px]">
          <div className="mb-2 transform transition-transform duration-300 group-hover:scale-110">
            {useCase.icon}
          </div>
          <h3 className="text-lg font-bold mb-1">{useCase.title}</h3>
          <p className="text-sm opacity-80">{useCase.description}</p>
        </div>
      </div>
    ))}
  </div>
);

export default UseCases;
