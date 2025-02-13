import { join } from "node:path";

export const paths = {
  results: join(process.cwd(), "_temp"),
  views: join(process.cwd(), "src", "views"),
};

export function getVideoPath(id: string) {
  const folderPrefix = `video_${id}`;

  return join(paths.results, folderPrefix);
}
