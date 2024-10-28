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
});

export const env = envSchema.parse(process.env);
