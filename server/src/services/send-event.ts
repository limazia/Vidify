import { connection } from "@/database";
import { io } from "@/http/server";
import { VideoStatus } from "@/shared/types/events";

interface SendEventParams {
  videoId: string;
  state: VideoStatus;
  message: string;
  cover?: string;
}

export async function sendVideoEvent({
  videoId,
  state,
  message,
  cover,
}: SendEventParams): Promise<void> {
  const eventData: SendEventParams = {
    videoId,
    state,
    message,
    ...(cover && { cover }),
  };

  try {
    const status = await connection("video_status")
      .where("video_id", videoId)
      .first();

    io.emit("video:status", eventData);

    if (status) {
      await connection("video_status")
        .update({
          state,
          message,
        })
        .where("id", status.id)
        .onConflict("id")
        .merge();
    }
  } catch (err) {
    console.error("Error sending video event:", (err as Error).message);
    throw err;
  }
}
