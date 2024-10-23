import fs from "fs/promises";
import {
  StartSpeechSynthesisTaskCommand,
  StartSpeechSynthesisTaskCommandInput,
} from "@aws-sdk/client-polly";
import { GetObjectCommand } from "@aws-sdk/client-s3";

import { SpeechBase } from "@/types/SpeechBase";
import { polly, s3 } from "@/app/lib/aws";
import { paths } from "@/app/config/paths";
 

type GenerateAudio = {
  text: string;
  id: string;
  config: SpeechBase;
};

export async function generateAudio({ text, id, config }: GenerateAudio) {
  try {
    const keyPrefix = `audios/${id}/`;

    const params: StartSpeechSynthesisTaskCommandInput = {
      ...config,
      OutputS3KeyPrefix: keyPrefix,
      OutputFormat: "mp3",
      Text: text,
    };

    const command = new StartSpeechSynthesisTaskCommand(params);

    const pollyResponse = await polly.send(command);

    await new Promise((resolve) => setTimeout(resolve, 30000));

    const s3command = new GetObjectCommand({
      Bucket: config.OutputS3BucketName,
      Key: `${keyPrefix}.${pollyResponse.SynthesisTask?.TaskId}.mp3`,
    });

    try {
      const s3response = await s3.send(s3command);

      if (!s3response.Body) {
        throw new Error("Body is empty");
      }
      // The Body object also has 'transformToByteArray' and 'transformToWebStream' methods.
      const audioWebStream =
        (await s3response.Body.transformToByteArray()) as Buffer;

      const filePath = `${paths.results}/${id}/audio.mp3`;

      await fs.writeFile(filePath, Buffer.from(audioWebStream));
    } catch (err) {
      console.error(err);
    }

    return {
      s3uri: pollyResponse.SynthesisTask?.OutputUri,
      taskId: pollyResponse.SynthesisTask?.TaskId,
    };
  } catch (err) {
    console.error(err);
  }
}
