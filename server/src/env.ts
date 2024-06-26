import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  OPENAI_API_KEY: z.string().min(1),
  AWS_REGION: z.string().min(1),
  AWS_ACCESS_KEY_ID: z.string().min(1),
  AWS_SECRET_ACCESS_KEY: z.string().min(1),
  IMAGE_GENERATOR_HOST: z.string().default("localhost"),
  PATH_RESULTS: z.string().default("results"),
  PATH_VIDEOS: z.string().default("videos"),
});

export const env = envSchema.parse(process.env);
