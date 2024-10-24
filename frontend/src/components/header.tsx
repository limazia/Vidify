import { PulsingCircle } from "./pulsing-gradient-circle";

export function Header() {
  return (
    <div className="flex items-center justify-between text-primary mb-10">
      <div className="flex items-center gap-2 cursor-pointer">
        <PulsingCircle />

        <div className="flex flex-col">
          <div className="flex items-center">
            <span className="text-primary text-2xl tracking-wider">Vidi</span>
            <span className="text-primary text-2xl font-bold tracking-wider">
              fy
            </span>
          </div>

          <small>AI for generating videos</small>
        </div>
      </div>
    </div>
  );
}
