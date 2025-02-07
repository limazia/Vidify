import swaggerAutogen from "swagger-autogen";

import { env } from "@/env";

const url = env.NODE_ENV === "production" ? env.HOST : `${env.HOST}:${env.PORT}`;

const doc = {
  info: {
    title: "Vidify",
    version: "1.0.0",
    description: "Documentação da API do Vidify",
  },
  servers: [
    {
      url,
    },
  ],
};

const output = "./swagger.json";
const routes = ["./routes/index.ts"];

swaggerAutogen()(output, routes, doc).then(async () => {
  await import("../app.js");
});
