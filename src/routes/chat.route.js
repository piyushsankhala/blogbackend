
import express from "express";
import { acesschat , createchat } from "../controllers/chat.controller.js";
import { authmiddleware } from "../middlewares/auth.middleware.js"; // Assuming JWT token middleware

const router = express.Router();

// All routes are protected with token
router.post("/acesschat", authmiddleware, acesschat);
router.post("/createchat", authmiddleware, createchat);


export default router;
