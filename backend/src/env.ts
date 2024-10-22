import { join } from "node:path";
import { config } from "dotenv";
import { z } from "zod";

config({
  path: join(process.cwd(), ".env"),
});

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("production"),
  HOST: z.string().url(),
  PORT: z.coerce.number().default(3333),

  DATABASE_URL: z
    .string({
      invalid_type_error: "DATABASE_URL must be a string",
      required_error: "Missing DATABASE_URL in environment variables",
    })
    .url(),
  REDIS_URL: z
    .string({
      invalid_type_error: "REDIS_URL must be a string",
      required_error: "Missing REDIS_URL in environment variables",
    })
    .url(),

  OPENAI_API_KEY: z.string().min(1),

  AWS_REGION: z.string().min(1),
  AWS_ACCESS_KEY_ID: z.string().min(1),
  AWS_SECRET_ACCESS_KEY: z.string().min(1),

  UNSPLASH_API_URL: z.string().min(1),
  UNSPLASH_API_TOKEN: z.string().min(1),
});

export const env = envSchema.parse(process.env);
