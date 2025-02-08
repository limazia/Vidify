import { GoogleGenerativeAI } from "@google/generative-ai";

import { env } from "@/shared/config/env";

export const gemini = new GoogleGenerativeAI(env.OPENAI_API_KEY);
