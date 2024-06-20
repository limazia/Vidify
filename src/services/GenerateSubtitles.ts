import {
  PollyClient,
  StartSpeechSynthesisTaskCommand,
  StartSpeechSynthesisTaskCommandInput,
} from "@aws-sdk/client-polly";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import fs from "fs/promises";

import { SpeechBase } from "../../types";
import { env } from "../env";

type GenerateSubtitle = {
  text: string;
  id: string;
  config: SpeechBase;
};

const polly = new PollyClient({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});
const s3 = new S3Client({
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

export const generateSubtitle = async ({
  text,
  id,
  config,
}: GenerateSubtitle) => {
  try {
    const keyPrefix = `audios/${id}/`;

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

    try {
      const s3response = await s3.send(s3command);

      if (!s3response.Body) {
        throw new Error("Body is empty");
      }
      // The Body object also has 'transformToByteArray' and 'transformToWebStream' methods.
      const audioWebStream =
        (await s3response.Body.transformToByteArray()) as Buffer;

      const outputMarks = `${env.PATH_RESULTS}/${id}/subtitles.marks`;

      await fs.writeFile(outputMarks, Buffer.from(audioWebStream));
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
};
