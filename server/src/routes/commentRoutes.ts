import { Router } from "express";
import {
  addComment,
  likeComment,
  unLikeComment,
  deleteComment,
} from "../controllers/commentController";
import authMiddleware from "../middlewares/authMiddleware";

const router: Router = Router();

router.post("/add/:postId", authMiddleware, addComment);
router.delete("/:commentId", authMiddleware, deleteComment);

router.post("/like/:commentId", authMiddleware, likeComment);
router.delete("/unlike/:commentId", authMiddleware, unLikeComment);

export default router;
