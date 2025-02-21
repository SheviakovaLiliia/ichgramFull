import express, { Router } from "express";
import {
  createPost,
  getPostById,
  updatePost,
  deletePost,
  likePost,
  unLikePost,
  getRandomPosts,
  getFollowedPosts,
  getPostComments,
  getUserPosts,
  searchPosts,
} from "../controllers/postController";
import { uploadImageMiddleware } from "../middlewares/multer";
import authMiddleware from "../middlewares/authMiddleware";

const router: Router = express.Router();

router.post("/create", authMiddleware, uploadImageMiddleware, createPost);

router.get("/:postId", authMiddleware, getPostById);

router.put("/:postId", authMiddleware, updatePost);

router.delete("/:postId", authMiddleware, deletePost);

router.get("/get/:postId/comments", authMiddleware, getPostComments);

router.get("/get/followed", authMiddleware, getFollowedPosts);

router.get("/get/random", authMiddleware, getRandomPosts);

router.get("/get/:username", authMiddleware, getUserPosts);

router.get("/search/get-posts", authMiddleware, searchPosts);

router.post("/like/:postId", authMiddleware, likePost);

router.delete("/unlike/:postId", authMiddleware, unLikePost);

export default router;
