import path from "node:path";

import { env } from "@/env";

export const resultsPath = path.join(process.cwd(), "..", env.PATH_RESULTS);
export const clientPath = path.join(process.cwd(), "..", "client/dist");
export const publicPath = path.join(process.cwd(), "public");
