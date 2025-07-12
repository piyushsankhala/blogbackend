import express from "express";
import { sendMessage } from "../controllers/message.controller.js";
import { authMiddleware} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/send",authMiddleware, sendMessage);

export default router;