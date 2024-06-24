import path from "node:path";

import { env } from "@/env";

export const videosPath = path.join(process.cwd(), "..", env.PATH_VIDEOS);
export const resultsPath = path.join(process.cwd(), "..", env.PATH_RESULTS);
export const clientDistPath = path.join(process.cwd(), "..", "client/dist");
