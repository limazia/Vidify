import { z } from "zod";
import dotenv from "dotenv";
import path from "node:path";

dotenv.config({ path: path.join(process.cwd(), "..", ".env") });

const envSchema = z.object({
  APP_HOST: z.string().default("http://localhost:10000"),

  OPENAI_API_KEY: z.string().min(1),

  AWS_REGION: z.string().min(1),
  AWS_ACCESS_KEY_ID: z.string().min(1),
  AWS_SECRET_ACCESS_KEY: z.string().min(1),

  UNSPLASH_API_URL: z.string().min(1),
  UNSPLASH_API_TOKEN: z.string().min(1),

  PATH_RESULTS: z.string().default("results"),
});

export const env = envSchema.parse(process.env);
