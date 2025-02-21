import { Application } from "express";
import authRouter from "./authRoutes";
import usersRouter from "./userRoutes";
import postsRouter from "./postRoutes";
import commentRouter from "./commentRoutes";
import messagesRouter from "./messageRoutes";
import notificationsRouter from "./notificationRoutes";

export const mainRouter = (app: Application) => {
  app.use("/api/auth", authRouter);
  app.use("/api/user", usersRouter);
  app.use("/api/post", postsRouter);
  app.use("/api/comment", commentRouter);
  app.use("/api/messages", messagesRouter);
  app.use("/api/notifications", notificationsRouter);

  app.get("/", (_req, res) => {
    res.send("index");
  });
};
