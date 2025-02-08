import swaggerAutogen from "swagger-autogen";

import { env } from "@/shared/config/env";

const doc = {
  info: {
    title: "Vidify API",
    version: "1.0.0",
  },
  servers: [
    {
      url: env.HOST,
    },
  ],
  schemes: ["http", "https"],
  tags: [
    {
      name: "Video",
    },
  ],
};

const output = "./swagger.json";
const routes = ["./routes/index.ts"];

swaggerAutogen()(output, routes, doc).then(() => {
  //await import("../app.js");

  console.log("🧊 swagger.json gerado com sucesso!");
});
