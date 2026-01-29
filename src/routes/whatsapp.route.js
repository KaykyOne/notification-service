import { Router } from "express";
import { sendMessage, clearMessages, startWhatsappBot, deleteScheduledMessages } from "../controller/whatsapp.controller.js";

const router = Router();

router.post("/", sendMessage);
router.get("/start", startWhatsappBot);
router.delete("/clearAll", clearMessages);
router.delete("/clearScheduled/:phone", deleteScheduledMessages);

export default router;
