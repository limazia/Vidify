import "express-async-errors";
import { Server } from "node:http";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";

import swaggerFile from "./swagger.json";

import { initializeSocket } from "@/app/lib/socket";
import { AppError } from "@/http/errors/app-error";
import { routes } from "./routes";
import { paths } from "@/app/config/paths";

const app = express();
export const server = new Server(app);

// Inicializa o Socket.IO
initializeSocket(server);

// Middleware
app.use(cors());
app.use(express.json());
app.use("/results", express.static(paths.results));
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

    console.error("Internal Server Error:", error.message);

    return response.status(500).json({
      statusCode: 500,
      message: "Internal server error",
    });
  }
);
