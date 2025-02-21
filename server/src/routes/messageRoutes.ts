import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import {
  getChatInfo,
  getMessages,
  getUserChats,
} from "../controllers/messageController";

const router: Router = Router();

router.post("/get_chat", authMiddleware, getChatInfo);
router.get("/get_messages/:username", authMiddleware, getMessages);
router.get("/get_user_chats", authMiddleware, getUserChats);

export default router;
