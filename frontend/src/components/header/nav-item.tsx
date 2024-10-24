import { useLocation, Link } from "react-router-dom";

import { cn } from "@/shared/lib/utils";
import { NavItemProps } from "@/shared/types/NavItem";

export function NavItem({ title = "", to = "", icon: Icon }: NavItemProps) {
  const { pathname } = useLocation();
  const isActiveLink = pathname === to;

  return (
    <li>
      <Link
        to={to}
        className={cn(
          "w-full flex items-center gap-1.5 text-sm font-medium text-gray-500 p-2 hover:bg-gray-100 rounded-md transition ease-linear duration-300",
          isActiveLink && "text-blue-600 bg-gray-100"
        )}
      >
        {Icon && (
          <Icon
            className={cn(
              "size-5",
              isActiveLink ? "text-blue-600" : "text-gray-600"
            )}
          />
        )}

        {title && <span>{title}</span>}
      </Link>
    </li>
  );
}
