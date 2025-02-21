import express, { Router } from "express";
import {
  getUserNotifications,
  deleteNotification,
  deleteAllNotifications,
} from "../controllers/notificationController";
import authMiddleware from "../middlewares/authMiddleware";

const router: Router = express.Router();

router.get("/", authMiddleware, getUserNotifications);

router.delete("/:notificationId", authMiddleware, deleteNotification);

router.delete("/delete-all", authMiddleware, deleteAllNotifications);

export default router;
