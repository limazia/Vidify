import { Plus, Video } from "lucide-react";

import { NavItemProps } from "@/shared/types/NavItem";

export const NavItems: NavItemProps[] = [
  {
    to: "/",
    title: "Novo Video",
    icon: Plus,
  },
  {
    title: "Videos",
    to: "/videos",
    icon: Video,
  },
];
