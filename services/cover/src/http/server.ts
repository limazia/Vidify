import "express-async-errors";

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";

import swaggerFile from "./swagger.json";

import { AppError } from "@/http/errors/app-error";
import { routes } from "./routes";
import { paths } from "@/app/config/paths";

export const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(paths.results));
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
