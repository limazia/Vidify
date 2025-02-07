import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { NavItem } from "./nav-item";
import { NavItems } from "./items";

export function MenuMobile() {
  const [menuMobile, setMenuMobile] = useState<boolean>(false);

  const handleOpenMenuMobile = (open: boolean) => setMenuMobile(open);

  return (
    <Popover onOpenChange={handleOpenMenuMobile}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          aria-label="Toggle Navigation"
          className="[&[data-state=open]]:border-gray-400"
        >
          <motion.div
            initial={false}
            animate={menuMobile ? "open" : "closed"}
            variants={{
              closed: { rotate: 0, scale: 1 },
              open: { rotate: 180, scale: 1.2 },
            }}
            transition={{ duration: 0.4 }}
          >
            {menuMobile ? (
              <X className="size-5 text-zinc-400" />
            ) : (
              <Menu className="size-5 text-zinc-400" />
            )}
          </motion.div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 p-4 bg-white border border-gray-300 text-lg tracking-tight text-gray-800 shadow-xl ring-1 ring-gray-200/5"
        align="end"
      >
        <ul className="flex flex-wrap flex-col gap-4">
          {NavItems.map(({ title, to, icon }) => (
            <NavItem key={title} title={title} to={to} icon={icon} />
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
