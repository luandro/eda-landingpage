export interface SubtitleItem {
  text: string;
  backgroundColor?: string;
  textColor?: "white" | "dark";
}

export interface Category {
  id: number;
  title: string;
  description: string;
}

export interface Feature {
  id: number;
  title: string;
  description: string;
}

export const subtitles = [
  {
    startTime: 0.76,
    endTime: 3.44,
    text: "Olá, meu nome é Eda.",
  },
  {
    startTime: 5.84,
    endTime: 13.6,
    text: "Sou uma assistente virtual de voz para Guardiões da Terra.",
  },
];

export const subtitlesContact: SubtitleItem[] = [
  {
    text: "Let's talk!",
    backgroundColor: "#4CAF50",
    textColor: "white"
  },
  {
    text: "Get in touch",
    backgroundColor: "#FF5722",
    textColor: "white"
  },
  {
    text: "Contact us",
    backgroundColor: "#2196F3",
    textColor: "white"
  },
  {
    text: "Reach out",
    backgroundColor: "#4CAF50",
    textColor: "white"
  }
];

export const categories: Category[] = [
  {
    id: 1,
    title: "Financiamentos",
    description: "Explore opções de financiamento disponíveis"
  },
  {
    id: 2,
    title: "Cursos Online",
    description: "Acesse nossa biblioteca de cursos"
  },
  {
    id: 3,
    title: "Ferramentas",
    description: "Descubra ferramentas úteis"
  },
  {
    id: 4,
    title: "Autonomia",
    description: "Aprenda sobre autonomia e independência"
  }
];

export const features: Feature[] = [
  {
    id: 1,
    title: "Assistência por Voz",
    description: "Interaja através de comandos de voz"
  },
  {
    id: 2,
    title: "Chat Inteligente",
    description: "Converse com nossa IA assistente"
  },
  {
    id: 3,
    title: "Recursos Educacionais",
    description: "Acesse materiais de aprendizado"
  }
];

export const logos = [
  {
    name: "Developer 1",
    logo: "/placeholder.svg",
    website: "https://example.com",
    category: "developers",
    invert: false
  },
  {
    name: "Developer 2",
    logo: "/placeholder.svg",
    website: "https://example.com",
    category: "developers",
    invert: true
  },
  {
    name: "Funder 1",
    logo: "/placeholder.svg",
    website: "https://example.com",
    category: "funders",
    invert: false
  }
];

export const contactInfo = {
  email: "contact@example.com",
  phone: "+55 (11) 1234-5678",
  website: "www.example.com",
  github: "https://github.com/example",
};

export const organizations = [
  {
    id: 1,
    name: "Organização 1",
    description: "Breve descrição da contribuição desta organização para o projeto.",
  },
  {
    id: 2,
    name: "Organização 2",
    description: "Breve descrição da contribuição desta organização para o projeto.",
  },
  {
    id: 3,
    name: "Organização 3",
    description: "Breve descrição da contribuição desta organização para o projeto.",
  },
  {
    id: 4,
    name: "Organização 4",
    description: "Breve descrição da contribuição desta organização para o projeto.",
  },
];