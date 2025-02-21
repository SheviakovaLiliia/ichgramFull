import express, { Router } from "express";
import {
  getUserProfile,
  updateUserProfile,
  searchUsers,
  addUserToSearch,
  followUser,
  unfollowUser,
  getAuthenticatedUser,
} from "../controllers/userController";
import authMiddleware from "../middlewares/authMiddleware";
import { ifFollowed } from "../middlewares/followMiddleware";
import { uploadImageMiddleware } from "../middlewares/multer";

const router: Router = express.Router();

router.get("/get/me", getAuthenticatedUser);

router.get("/:username", authMiddleware, getUserProfile);

router.post(
  "/:username/edit",
  authMiddleware,
  uploadImageMiddleware,
  updateUserProfile
);
router.get("/", authMiddleware, searchUsers);

router.post("/add-to-search", authMiddleware, addUserToSearch);

router.post("/follow/:username", authMiddleware, ifFollowed, followUser);

router.delete("/unfollow/:username", authMiddleware, ifFollowed, unfollowUser);

export default router;
