import express from "express";
import * as authController from "../controllers/authController.ts";
import { limiter } from "../middleware/rateLimiter.ts";

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", limiter, authController.login);
router.post("/refresh", authController.refreshToken);

export default router;
