import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  OPENAI_API_KEY: z.string().min(1),
  AWS_REGION: z.string().default("us-east-1"),
  AWS_ACCESS_KEY_ID: z.string().min(1),
  AWS_SECRET_ACCESS_KEY: z.string().min(1),
  PATH_RESULTS: z.string().min(1).default("results"),
  IMAGE_GENERATOR_HOST: z.string().default("localhost"),
  CARBONARA_HOST: z.string().default("localhost"),
});

export const env = envSchema.parse(process.env);
