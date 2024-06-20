import { FileVideo } from "lucide-react";

export function Header() {
  return (
    <div className="flex items-center text-primary mb-10">
      <FileVideo className="size-16" />
      <h1 className="text-primary text-3xl font-bold tracking-wider">
        DarkClip
      </h1>
    </div>
  );
}
