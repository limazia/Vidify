import { Server } from "http";
import express from "express";
import cors from "cors";

import { initializeSocket } from "@/shared/lib/socket";
import { clientPath, publicPath, resultsPath } from "@/shared/utils";
import { routes } from "@/routes";

const app = express();
const PORT = 10000;

const httpServer = new Server(app);

initializeSocket(httpServer);

app.use(cors());
app.use(express.json());
app.use("/", express.static(clientPath));
app.use("/public", express.static(publicPath));
app.use('/results', express.static(resultsPath));
app.use(routes);

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
