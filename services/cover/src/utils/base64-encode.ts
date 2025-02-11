import fs from "fs";

export function base64Encode(file: string) {
  if (!fs.existsSync(file)) {
    return "";
  }

  const buffer = fs.readFileSync(file);
  const base64 = Buffer.from(buffer).toString("base64");

  return `data:image/png;base64,${base64}`;
}
