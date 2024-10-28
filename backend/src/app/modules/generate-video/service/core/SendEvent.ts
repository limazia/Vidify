import { v4 as uuidv4 } from "uuid";

import { connection } from "@/database";
import { VideoStatus, VideoStatusData } from "@/types/Events";

interface SendEventParams {
  io: any;
  videoId: string;
  status: VideoStatus;
  message: string;
  cover?: string;
}

export async function sendVideoEvent({
  io,
  videoId,
  status,
  message,
  cover,
}: SendEventParams): Promise<void> {
  const socketStatus =
    status === "failed"
      ? "error"
      : status === "completed"
      ? "finished"
      : "processing";

  const eventData: VideoStatusData = {
    id: videoId,
    status: socketStatus,
    status_message: message,
    ...(cover && { cover }),
  };

  try {
    const status = await connection("video_status")
      .where("id_video", videoId)
      .first();

    io.emit("video-status", eventData);

    if (status) {
      await connection("videos-status")
        .update({
          id: uuidv4(),
          status,
          status_message: message,
          id_video: videoId,
        })
        .where("id", videoId);
    } else {
      await connection("videos-status").insert({
        id: uuidv4(),
        status,
        status_message: message,
        id_video: videoId,
      });
    }
  } catch (error) {
    console.error("Failed to send video event:", error);
    throw new Error(`Failed to send video event: ${message}`);
  }
}
