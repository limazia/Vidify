import { Logo } from "../logo";
import { MenuMobile } from "./mobile";
import { NavItems } from "./items";
import { NavItem } from "./nav-item";

export function Header() {
  return (
    <header className="flex items-center justify-between text-primary mb-10">
      <div className="flex items-center gap-3 cursor-pointer">
        <Logo />

        <div className="flex flex-col">
          <div className="flex items-center">
            <span className="text-primary text-2xl tracking-wider">Vidi</span>
            <span className="text-primary text-2xl font-bold tracking-wider">
              fy
            </span>{" "}
          </div>

          <small>Crie vídeos incríveis em segundos com IA</small>
        </div>
      </div>
 
      <div className="hidden lg:flex lg:items-center lg:gap-3 cursor-pointer">
        <ul className="flex items-center justify-center flex-wrap gap-4">
          {NavItems.map(
            (item, index) => (
              <NavItem
                key={`${index}-${item.title}`}
                title={item.title}
                to={item.to}
                icon={item.icon}
              />
            )
          )}
        </ul>
      </div>

      <div className="-mr-1 ml-5 lg:hidden">
        <MenuMobile />
      </div>
    </header>
  );
}
