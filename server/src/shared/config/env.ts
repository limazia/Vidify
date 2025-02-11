import { join } from "node:path";
import { config } from "dotenv";
import { z } from "zod";

config({
  path: join(process.cwd(), ".env"),
});

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("production"),
  HOST: z.string().url(),
  PORT: z.coerce.number().default(4000),

  DATABASE_URL: z
    .string({
      invalid_type_error: "DATABASE_URL must be a string",
      required_error: "Missing DATABASE_URL in environment variables",
    })
    .url(),

  REDIS_HOST: z.string().min(1),
  REDIS_PORT: z.coerce.number().default(6379),

  AWS_REGION: z.string().min(1),
  AWS_BUCKET: z.string().min(1),
  AWS_ACCESS_KEY_ID: z.string().min(1),
  AWS_SECRET_ACCESS_KEY: z.string().min(1),

  OPENAI_API_KEY: z.string().min(1),
});

export const env = envSchema.parse(process.env);
