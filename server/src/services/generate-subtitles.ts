import fs from "fs/promises";
import {
  StartSpeechSynthesisTaskCommand,
  StartSpeechSynthesisTaskCommandInput,
} from "@aws-sdk/client-polly";
import { GetObjectCommand } from "@aws-sdk/client-s3";

import { SpeechBase } from "@/shared/types/speech-base";
import { polly, s3 } from "@/shared/lib/aws";
import { paths } from "@/shared/config/paths";

interface GenerateSubtitle {
  text: string;
  id: string;
  config: SpeechBase;
}

export async function generateSubtitle({ text, id, config }: GenerateSubtitle) {
  const folderPrefix = `video_${id}`;
  const keyPrefix = `videos/video_${id}/`;

  try {
    const params: StartSpeechSynthesisTaskCommandInput = {
      ...config,
      OutputS3KeyPrefix: keyPrefix,
      OutputFormat: "json",
      Text: text,
      SpeechMarkTypes: ["word"],
    };

    const command = new StartSpeechSynthesisTaskCommand(params);

    const pollyResponse = await polly.send(command);

    await new Promise((resolve) => setTimeout(resolve, 30000));

    const s3command = new GetObjectCommand({
      Bucket: config.OutputS3BucketName,
      Key: `${keyPrefix}.${pollyResponse.SynthesisTask?.TaskId}.marks`,
    });

    const s3response = await s3.send(s3command);

    if (!s3response.Body) {
      throw new Error("Body is empty");
    }

    const audioWebStream =
      (await s3response.Body.transformToByteArray()) as Buffer;

    const filePath = `${paths.results}/${folderPrefix}/subtitles.marks`;

    await fs.writeFile(filePath, Buffer.from(audioWebStream));

    return {
      s3uri: pollyResponse.SynthesisTask?.OutputUri,
      taskId: pollyResponse.SynthesisTask?.TaskId,
    };
  } catch (err) {
    console.error("Error generating subtitle:", (err as Error).message);
    throw err;
  }
}
