import { Loader2, CheckCircle2, XCircle } from "lucide-react";

import { VideoStatusType } from "@/shared/interfaces/Video";

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
  return <>{statusIconMap[status]}</>;
}
