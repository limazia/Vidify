import { env } from "@/shared/config/env";
import { SpeechBase } from "@/shared/types/speech-base";

export const pollyConfig: SpeechBase = {
  OutputS3BucketName: env.AWS_BUCKET,
  Engine: "neural",
  LanguageCode: "pt-BR",
  TextType: "ssml",
  VoiceId: "Thiago",
};
