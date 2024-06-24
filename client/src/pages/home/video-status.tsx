import { Loader2, CheckCircle2, XCircle } from "lucide-react";

import { VideoStatusType } from "@/shared/types/Video";

const statusIconMap: Record<VideoStatusType, JSX.Element> = {
  pending: <Loader2 className="size-10 animate-spin" />,
  processing: <Loader2 className="size-10 animate-spin" />,
  error: <XCircle className="size-10 text-red-500" />,
  finished: <CheckCircle2 className="size-10 text-green-500" />,
};

interface VideoStatusProps {
  status: VideoStatusType;
}

export function VideoStatus({ status }: VideoStatusProps) {
  return <div>{statusIconMap[status]}</div>;
}
