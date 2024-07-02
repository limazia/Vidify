import { ReactComponent as Logo } from "@/assets/logo.svg";

export function Header() {
  return (
    <div className="flex items-center text-primary mb-10">
      <a className="flex items-center" href="/">
        <Logo className="size-16" />
        <span className="text-primary text-3xl tracking-wider">Vidi</span>
        <span className="text-primary text-3xl font-bold tracking-wider">
          fy
        </span>
      </a>
    </div>
  );
}
