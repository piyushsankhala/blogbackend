import express from "express";
import { sendMessage } from "../controllers/message.controller.js";
import { authmiddleware} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/send",authmiddleware, sendMessage);

export default router;