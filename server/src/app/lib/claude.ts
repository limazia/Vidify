const Claude = require("claude-ai");

import { env } from "@/env";

export const claude = new Claude({
  sessionKey: env.OPENAI_API_KEY,
});
