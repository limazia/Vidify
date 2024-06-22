import express from "express";

import { capture } from "./services/capture";

const app = express();
const PORT = 2000;

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile("index.html");
});

app.get("/capture", async (req, res) => {
  const paramsDefault = {
    title: "useState",
    //tags: ["tag1", "tag2"],
  };

  const params = { ...paramsDefault, ...req.query };

  console.log("Params", params)

  const png = await capture(params);

  res.setHeader("Content-Type", "image/png");
  res.statusCode = 200;
  res.end(png);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
