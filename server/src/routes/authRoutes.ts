import express, { Router } from "express";

import {
  register,
  loginUser,
  checkAuthStatus,
  logout,
  resetPassword,
  resetPasswordStep2,
  refreshToken,
} from "../controllers/authController";
import authMiddleware from "../middlewares/authMiddleware";

const router: Router = express.Router();

router.post("/register", register);

router.post("/login", loginUser);

router.get("/auth-check", checkAuthStatus);

router.post("/logout", logout);

router.post("/reset-password", resetPassword);

router.post("/reset-password/step2", resetPasswordStep2);

router.post("/refresh-token", authMiddleware, refreshToken);

export default router;
