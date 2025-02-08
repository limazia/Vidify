import { Loader2, CheckCircle2, XCircle } from "lucide-react";

import { VideoStatusType } from "@/shared/interfaces/video";
import { cn } from "@/shared/utils/cn";

const statusIconMap: Record<
  VideoStatusType,
  React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
  pending: Loader2,
  processing: Loader2,
  error: XCircle,
  finished: CheckCircle2,
};

interface VideoStatusProps {
  status: VideoStatusType;
}

export function VideoStatus({ status }: VideoStatusProps) {
  const Icon = statusIconMap[status];

  if (!Icon) return null;

  return (
    <div className="absolute">
      <Icon
        className={cn(
          "w-10 h-10",
          status === "pending" && "text-primary animate-spin",
          status === "processing" && "text-primary animate-spin",
          status === "error" && "text-red-500",
          status === "finished" && "text-green-500"
        )}
      />
    </div>
  );
}
