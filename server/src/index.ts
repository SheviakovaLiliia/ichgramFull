import express, { Application } from "express";
import "dotenv/config";
import { connectDB } from "./config/db";
import cors from "cors";
import http from "http";
import { mainRouter } from "./routes/mainRouter";
import { configureCors } from "./config/cors";
import { initializeSocket } from "./config/socket";
import cookieParser from "cookie-parser";

const port: string | number = process.env.PORT || 5000;

(async function startServer() {
  try {
    await connectDB();

    const app: Application = express();
    const server = http.createServer(app);
    const corsOptions = configureCors();
    app.use(cors(corsOptions));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());

    mainRouter(app);

    initializeSocket(server);

    server.listen(Number(port), "0.0.0.0", () => {
      console.log("Server is running on port " + port);
    });
  } catch (error) {
    console.error("Error starting server: ", error);
  }
})();
