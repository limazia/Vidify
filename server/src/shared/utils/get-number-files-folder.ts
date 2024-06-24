import fs from "fs";

export function getNumberFilesFolder(dir: string) {
  const length = fs.readdirSync(dir).length;

  return length;
}
