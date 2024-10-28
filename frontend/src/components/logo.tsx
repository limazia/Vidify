import { cn } from "@/shared/utils/cn";

interface LogoProps {
  background?: string;
}

export function Logo({ background = "bg-white" }: LogoProps) {
  return (
    <div className="animate-pulse duration-2000">
      <div className="relative flex size-14 items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 animate-spin duration-2000" />
        <div
          className={cn("relative size-9 rounded-full bg-white", background)}
        />
      </div>
    </div>
  );
}
