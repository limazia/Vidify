import "express-async-errors";
import express, { Request, Response, NextFunction } from "express";
import swaggerUi from "swagger-ui-express";
import bodyParser from "body-parser";
import cors from "cors";
import { createServer } from "http";

import { initializeSocket } from "@/shared/lib/socket";
import { HttpError } from "@/http/errors/http-error";
import { routes } from "./routes";
import { paths } from "@/shared/config/paths";
import swaggerFile from "./swagger.json";

const app = express();
const server = createServer(app);

const io = initializeSocket(server);

app.set("view engine", "ejs");
app.set("views", paths.views);

app.use(cors());
app.use(bodyParser.json());
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
    if (error instanceof HttpError) {
      console.log(error.message);

      response.status(error.statusCode).json({
        success: false,
        error: {
          statusCode: error.statusCode,
          type: error.type,
          message: error.message,
          code: error.code,
        },
        timestamp: new Date().toISOString(),
      });
    }

    console.log(error.message);

    response.status(500).json({
      success: false,
      error: {
        statusCode: 500,
        type: "error",
        message: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      },
      timestamp: new Date().toISOString(),
    });
  }
);

export { server, io };
