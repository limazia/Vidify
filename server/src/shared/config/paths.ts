import { join } from "node:path";

export const paths = {
  results: join(process.cwd(), "_temp"),
  views: join(process.cwd(), "src", "views"),
};
