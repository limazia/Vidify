import { Plus, Video } from "lucide-react";

interface NavItemProps {
  title: string;
  to: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export const NavItems: NavItemProps[] = [
  {
    to: "/",
    title: "Novo Vídeo",
    icon: Plus,
  },
  {
    title: "Vídeos",
    to: "/videos",
    icon: Video,
  },
];
