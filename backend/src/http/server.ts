import "express-async-errors";
import express, { Request, Response, NextFunction } from "express";
import path from "node:path";
import http from "node:http";
import cors from "cors";
import swaggerUi from "swagger-ui-express";

import { initializeSocket } from "@/app/lib/socket";
import { AppError } from "@/http/errors/app-error";
import { routes } from "./routes";

import swaggerFile from "./swagger.json";

const app = express();
export const server = http.createServer(app);

initializeSocket(server);

app.use(cors());
app.use(express.json());
app.use("/results", express.static(path.resolve(process.cwd(), "tmp")));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use(routes);

app.use(
  async (
    error: Error,
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    if (error instanceof AppError) {
      return response.status(error.statusCode).json({
        statusCode: error.statusCode,
        message: error.message,
      });
    }

    console.log(error.message);

    return response.status(500).json({
      statusCode: 500,
      message: "Internal server error",
    });
  }
);
