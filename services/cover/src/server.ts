import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import { routes } from "./routes";

const app = express();

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(routes);

export { app };
