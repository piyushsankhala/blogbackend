
import express from "express";
import { acesschat , createchat } from "../controllers/chat.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js"; // Assuming JWT token middleware

const router = express.Router();

// All routes are protected with token
router.post("/acesschat", authMiddleware, acesschat);
router.post("/createchat", authMiddleware, createchat);


export default router;
