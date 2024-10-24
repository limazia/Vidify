import { Rocket, Trees, Brain, Globe } from "lucide-react";
import { ElementType } from "react";

interface Category {
  name: string;
  icon: ElementType;
  items: string[];
}

export const categorizedSuggestions: Category[] = [
  {
    name: "Ciência e Tecnologia",
    icon: Rocket,
    items: [
      "Coisas mais tecnológicas do mercado",
      "Coisas mais incríveis da ciência",
      "Coisas mais inovadoras da tecnologia",
      "Coisas mais estranhas do espaço",
      "Avanços científicos recentes",
      "Tecnologias emergentes no setor automotivo",
      "Experiências imersivas de realidade virtual",
      "Artigos científicos mais impactantes",
      "Descobertas recentes na medicina",
      "Tecnologias verdes e sustentáveis",
      "Curiosidades sobre inteligência artificial",
      "Curiosidades sobre tecnologia espacial",
      "Invenções revolucionárias na medicina",
      "Curiosidades sobre o universo dos games",
      "Grandes feitos da engenharia moderna",
      "Curiosidades sobre astronomia",
      "Invenções que revolucionaram o mundo",
      "Desafios científicos não resolvidos",
    ],
  },
  {
    name: "Natureza e Meio Ambiente",
    icon: Trees,
    items: [
      "Coisas mais estranhas encontradas na natureza",
      "Coisas mais misteriosas do oceano",
      "Coisas mais belas da natureza",
      "Coisas mais curiosas sobre animais",
      "Coisas mais raras sobre plantas",
      "Coisas mais fascinantes sobre a água",
      "Jardins botânicos mais bonitos",
      "Curiosidades sobre fenômenos naturais",
      "Destinos de ecoturismo incríveis",
      "Curiosidades sobre dinossauros",
      "Descobertas mais fascinantes da biologia",
      "Curiosidades sobre terremotos e vulcões",
      "Curiosidades sobre energias renováveis",
      "Curiosidades sobre a vida marinha",
      "Curiosidades sobre fenômenos meteorológicos",
    ],
  },
  {
    name: "Conhecimento e Descobertas",
    icon: Brain,
    items: [
      "Coisas mais antigas já descobertas",
      "Coisas mais incríveis do mundo antigo",
      "Coisas mais secretas do governo",
      "Coisas mais misteriosas da história",
      "Coisas mais antigas feitas por humanos",
      "Coisas mais fascinantes sobre o cérebro",
      "Histórias fascinantes de descobertas arqueológicas",
      "Artigos de pesquisa revolucionários",
      "Momentos históricos que mudaram o mundo",
      "Descobertas arqueológicas controversas",
      "Momentos históricos esquecidos",
      "Grandes avanços na neurociência",
      "Descobertas mais estranhas da ciência",
      "Descobertas incríveis da psicologia",
    ],
  },
  {
    name: "Cultura e Sociedade",
    icon: Globe,
    items: [
      "Coisas mais interessantes sobre culturas",
      "Coisas mais incomuns na culinária",
      "Coisas mais estranhas sobre moda",
      "Coisas mais espetaculares sobre festivais",
      "Coisas mais intrigantes sobre mitologia",
      "Tradições de casamento ao redor do mundo",
      "Danças folclóricas de várias culturas",
      "Curiosidades sobre idiomas diferentes",
      "Arte de rua mais impressionante do mundo",
      "Tradições culinárias familiares",
      "Arte corporal ao redor do mundo",
      "Tradições de Natal ao redor do mundo",
      "Estilos de dança únicos ao redor do mundo",
      "Histórias de grandes bibliotecas ao redor do mundo",
      "Tradições de celebração de Ano Novo",
    ],
  },
];
